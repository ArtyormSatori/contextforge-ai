/**
 * ContextForge AI - Jira Issue Panel Resolvers
 * Bridges Forge UI Kit / Custom UI with backend Teamwork Graph intelligence.
 */

import Resolver from '@forge/resolver';
import { TeamworkGraphEngine } from '../engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../engine/blastRadius';
import { ContextDossierSynthesizer } from '../engine/contextDossier';
import { SolutionProposer } from '../engine/solutionProposer';

const resolver = new Resolver();
const graphEngine = new TeamworkGraphEngine();
const blastAnalyzer = new BlastRadiusAnalyzer();
const dossierSynthesizer = new ContextDossierSynthesizer();
const solutionProposer = new SolutionProposer();

resolver.define('getIssueIntelligence', async (req: any) => {
  const issueKey = req.context?.extension?.issue?.key || req.payload?.issueKey || 'PAY-402';

  try {
    const graph = await graphEngine.buildGraphForIssue(issueKey);
    const blast = blastAnalyzer.analyze(graph);
    const dossier = dossierSynthesizer.synthesize(graph, blast);
    const proposal = solutionProposer.propose(dossier);

    return {
      success: true,
      issueKey,
      blastRadius: blast,
      dossier,
      proposal,
      graphOverview: {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        nodes: graph.nodes,
        edges: graph.edges
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
});

resolver.define('getProjectContextRadar', async (req: any) => {
  const projectKey = req.context?.extension?.project?.key || req.payload?.projectKey || 'PAY';

  return {
    projectKey,
    trackedIssuesCount: 42,
    criticalRiskCount: 2,
    highRiskCount: 7,
    mediumRiskCount: 18,
    lowRiskCount: 15,
    topRiskIssues: [
      { key: 'PAY-402', score: 85, risk: 'CRITICAL', title: 'Stripe webhook retry storm causing payment deadlocks' },
      { key: 'PAY-389', score: 62, risk: 'HIGH', title: 'Migrate idempotency keys to clustered Redis v7' },
      { key: 'CHK-120', score: 55, risk: 'HIGH', title: 'Checkout v2 UI fails to show pending state' }
    ],
    graphHealth: {
      density: 0.74,
      connectedComponents: 3,
      avgTransitiveCoupling: 2.8
    }
  };
});

resolver.define('applySuggestedMitigation', async (req: any) => {
  const { issueKey, mitigationIndex } = req.payload || {};
  return {
    success: true,
    message: `Mitigation #${mitigationIndex} acknowledged and registered for ${issueKey}.`,
    timestamp: new Date().toISOString()
  };
});

export const panelResolver = resolver.getDefinitions();
