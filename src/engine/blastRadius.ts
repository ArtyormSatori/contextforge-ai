/**
 * ContextForge AI - Blast Radius Analyzer
 * Computes risk scores, downstream service criticality, and regression risks using Teamwork Graph.
 */

import {
  TeamworkGraphData,
  BlastRadiusResult,
  RiskLevel,
  AffectedService
} from '../types';

export class BlastRadiusAnalyzer {
  private static CORE_SERVICE_KEYWORDS = [
    'payment',
    'auth',
    'checkout',
    'billing',
    'database',
    'security',
    'order'
  ];

  /**
   * Analyzes the blast radius and calculates risk score based on the associative graph.
   */
  public analyze(graph: TeamworkGraphData): BlastRadiusResult {
    const rootNode = graph.nodes.find(n => n.id === `jira:${graph.rootKey}`);
    const priority = (rootNode?.metadata?.priority as string) || 'Medium';

    // 1. Identify Affected Services & Tier Criticality
    const serviceNodes = graph.nodes.filter(n => n.type === 'service');
    const affectedServices: AffectedService[] = serviceNodes.map(node => {
      const name = node.key;
      const isCore = BlastRadiusAnalyzer.CORE_SERVICE_KEYWORDS.some(k => 
        name.toLowerCase().includes(k)
      );

      if (isCore) {
        return {
          name,
          tier: 1,
          criticality: 'CORE',
          reason: `Critical operational path: ${name} directly impacts financial or session integrity.`
        };
      } else {
        return {
          name,
          tier: 2,
          criticality: 'SUPPORTING',
          reason: `Supporting service linked via issue component association: ${name}.`
        };
      }
    });

    // 2. Count Connected Artifacts
    const linkedIssueNodes = graph.nodes.filter(
      n => n.type === 'jira_issue' && n.key !== graph.rootKey
    );
    const transitiveIssueCount = linkedIssueNodes.length;

    const prNodes = graph.nodes.filter(n => n.type === 'bitbucket_pr');
    const openConflictingPrCount = prNodes.filter(n => n.status === 'OPEN').length;

    const incidentNodes = graph.nodes.filter(
      n => n.type === 'confluence_doc' && n.metadata?.docType === 'incident_postmortem'
    );
    const historicalIncidentMatchCount = incidentNodes.length;

    // 3. Compute Deterministic Risk Score (0 - 100)
    let score = 0;

    // (a) Priority base score
    switch (priority) {
      case 'Highest': score += 35; break;
      case 'High': score += 25; break;
      case 'Medium': score += 15; break;
      default: score += 5; break;
    }

    // (b) Core service impact (+15 per tier 1 service, max +30)
    const tier1Count = affectedServices.filter(s => s.tier === 1).length;
    score += Math.min(tier1Count * 15, 30);

    // (c) Transitive dependency penalty (+8 per connected issue, max +24)
    score += Math.min(transitiveIssueCount * 8, 24);

    // (d) Open PR conflicts (+10 per open PR, max +20)
    score += Math.min(openConflictingPrCount * 10, 20);

    // (e) Historical incident correlation (+15 if past post-mortem matched)
    if (historicalIncidentMatchCount > 0) {
      score += 15;
    }

    // Cap score at 100
    score = Math.min(Math.max(score, 0), 100);

    // 4. Map to Risk Level
    let riskLevel: RiskLevel;
    if (score >= 75) {
      riskLevel = 'CRITICAL';
    } else if (score >= 50) {
      riskLevel = 'HIGH';
    } else if (score >= 25) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    // 5. Generate Risk Factors & Mitigations
    const riskFactors: string[] = [];
    const mitigations: string[] = [];

    if (tier1Count > 0) {
      riskFactors.push(`Touches ${tier1Count} Tier-1 Core Services (${affectedServices.filter(s => s.tier === 1).map(s => s.name).join(', ')}).`);
      mitigations.push('Require secondary peer review from Core Infrastructure / Payments code owner.');
    }

    if (transitiveIssueCount > 1) {
      riskFactors.push(`High relational coupling: issue is cross-linked with ${transitiveIssueCount} related Jira issues.`);
      mitigations.push('Verify backward-compatibility of API payloads across all linked client services.');
    }

    if (openConflictingPrCount > 0) {
      riskFactors.push(`Detected ${openConflictingPrCount} active open PR(s) modifying overlapping repositories.`);
      mitigations.push('Rebase target branch against main prior to staging deployment to detect merge race conditions.');
    }

    if (historicalIncidentMatchCount > 0) {
      riskFactors.push(`Associative match with ${historicalIncidentMatchCount} previous incident post-mortem(s) in Confluence.`);
      mitigations.push('Enforce load/chaos tests validating deadlock avoidance and database timeout bounds under spike traffic.');
    }

    if (riskFactors.length === 0) {
      riskFactors.push('Isolated component change with low transitive coupling.');
      mitigations.push('Standard CI unit and integration test verification.');
    }

    return {
      rootKey: graph.rootKey,
      score,
      riskLevel,
      affectedServices,
      transitiveIssueCount,
      openConflictingPrCount,
      historicalIncidentMatchCount,
      riskFactors,
      mitigations,
      calculatedAt: new Date().toISOString()
    };
  }
}
