/**
 * ContextForge AI - Context Dossier Synthesizer
 * Merges Teamwork Graph nodes, blast radius, and documentation into a developer context dossier.
 */

import {
  TeamworkGraphData,
  BlastRadiusResult,
  ContextDossier,
  ConfluenceDocData,
  BitbucketPrData
} from '../types';

export class ContextDossierSynthesizer {
  /**
   * Synthesizes an end-to-end engineering dossier from the associative graph and blast radius.
   */
  public synthesize(
    graph: TeamworkGraphData,
    blastRadius: BlastRadiusResult
  ): ContextDossier {
    const rootNode = graph.nodes.find(n => n.id === `jira:${graph.rootKey}`);
    const title = rootNode?.title || `Issue ${graph.rootKey}`;

    // Extract connected Confluence documents
    const connectedSpecs: ConfluenceDocData[] = graph.nodes
      .filter(n => n.type === 'confluence_doc')
      .map(n => ({
        id: n.key,
        title: n.title,
        spaceKey: (n.metadata?.spaceKey as string) || 'ENG',
        excerpt: (n.metadata?.excerpt as string) || '',
        docType: (n.metadata?.docType as any) || 'architecture_rfc',
        url: n.url || `https://team.atlassian.net/wiki/pages/${n.key}`,
        lastModified: new Date().toISOString()
      }));

    // Extract related Bitbucket PRs
    const relatedPrs: BitbucketPrData[] = graph.nodes
      .filter(n => n.type === 'bitbucket_pr')
      .map(n => ({
        id: n.key,
        title: n.title,
        repository: (n.metadata?.repository as string) || 'service-repo',
        branch: (n.metadata?.branch as string) || 'main',
        status: (n.status as any) || 'OPEN',
        author: (n.metadata?.author as string) || 'Engineering Team',
        changedFiles: (n.metadata?.changedFiles as string[]) || [],
        url: n.url || `https://bitbucket.org/team/pull-requests/${n.key}`
      }));

    // Extract Key Stakeholders (assignees, PR authors)
    const stakeholdersSet = new Set<string>();
    for (const node of graph.nodes) {
      if (node.type === 'developer') {
        stakeholdersSet.add(node.title);
      }
      if (node.metadata?.author) {
        stakeholdersSet.add(node.metadata.author as string);
      }
    }
    const keyStakeholders = Array.from(stakeholdersSet);

    // Suggested Checkpoints
    const suggestedCheckpoints: string[] = [
      'Pre-Merge: Verify distributed lock timeout <= 500ms under artificial packet delay.',
      'Integration: Run idempotency test suite against replicated database nodes.',
      'Deployment: Roll out via Canary (5% traffic) and monitor database deadlocks metric.'
    ];

    // Build Publication-Grade Markdown Summary
    const markdownSummary = this.generateMarkdown(
      graph.rootKey,
      title,
      blastRadius,
      connectedSpecs,
      relatedPrs,
      keyStakeholders,
      suggestedCheckpoints
    );

    return {
      issueKey: graph.rootKey,
      title,
      summary: `Associative Context Dossier for ${graph.rootKey} synthesized with ${graph.nodes.length} nodes and ${graph.edges.length} graph relations.`,
      blastRadius,
      connectedSpecs,
      relatedPrs,
      keyStakeholders,
      suggestedCheckpoints,
      synthesizedAt: new Date().toISOString(),
      markdownSummary
    };
  }

  private generateMarkdown(
    issueKey: string,
    title: string,
    blastRadius: BlastRadiusResult,
    specs: ConfluenceDocData[],
    prs: BitbucketPrData[],
    stakeholders: string[],
    checkpoints: string[]
  ): string {
    const riskBadge = blastRadius.riskLevel === 'CRITICAL' ? '🔴 CRITICAL' :
                      blastRadius.riskLevel === 'HIGH' ? '🟠 HIGH' :
                      blastRadius.riskLevel === 'MEDIUM' ? '🟡 MEDIUM' : '🟢 LOW';

    const serviceList = blastRadius.affectedServices
      .map(s => `- **${s.name}** (Tier ${s.tier} / ${s.criticality}): ${s.reason}`)
      .join('\n');

    const specList = specs.length > 0
      ? specs.map(s => `- [${s.title}](${s.url}) *[${s.docType}]*: ${s.excerpt}`).join('\n')
      : '_No linked Confluence specifications found._';

    const prList = prs.length > 0
      ? prs.map(p => `- [${p.title}](${p.url}) (${p.repository} @ \`${p.branch}\` - **${p.status}** by ${p.author})`).join('\n')
      : '_No linked pull requests found._';

    const riskFactorList = blastRadius.riskFactors.map(f => `- ⚠️ ${f}`).join('\n');
    const mitigationList = blastRadius.mitigations.map(m => `- ✅ ${m}`).join('\n');
    const checkpointList = checkpoints.map((c, i) => `${i + 1}. ${c}`).join('\n');

    return `### ContextForge Intelligence Dossier: ${issueKey}
**${title}**

#### 🛡️ Blast Radius & Risk Assessment
- **Risk Score**: ${blastRadius.score}/100 (**${riskBadge}**)
- **Transitive Issue Coupling**: ${blastRadius.transitiveIssueCount} related Jira issue(s)
- **Active Pull Requests**: ${blastRadius.openConflictingPrCount} open PR(s)
- **Historical Post-Mortems Matched**: ${blastRadius.historicalIncidentMatchCount} incident document(s)

#### 🏢 Affected Systems & Microservices
${serviceList || '_No specific microservices registered._'}

#### ⚠️ Key Risk Factors
${riskFactorList}

#### 📋 Required Mitigations
${mitigationList}

#### 📚 Connected Specifications & Architecture RFCs (Confluence)
${specList}

#### 🔀 Active Code Branches & Pull Requests (Bitbucket)
${prList}

#### 👥 Stakeholders & Domain Owners
${stakeholders.length > 0 ? stakeholders.map(s => `\`@${s}\``).join(', ') : '_No direct owners assigned._'}

#### 🚦 Verification Checkpoints
${checkpointList}
`;
  }
}
