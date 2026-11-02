/**
 * ContextForge AI - Atlassian Rovo Agent Action Handlers
 * Implements the backend functions invoked when users chat with or assign tasks to @ContextForge.
 */

import { TeamworkGraphEngine } from '../engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../engine/blastRadius';
import { ContextDossierSynthesizer } from '../engine/contextDossier';
import { SolutionProposer } from '../engine/solutionProposer';
import { RovoActionInvocation, RovoActionResult } from '../types';

export class RovoActionHandler {
  private graphEngine: TeamworkGraphEngine;
  private blastAnalyzer: BlastRadiusAnalyzer;
  private dossierSynthesizer: ContextDossierSynthesizer;
  private solutionProposer: SolutionProposer;

  constructor(graphEngine?: TeamworkGraphEngine) {
    this.graphEngine = graphEngine || new TeamworkGraphEngine();
    this.blastAnalyzer = new BlastRadiusAnalyzer();
    this.dossierSynthesizer = new ContextDossierSynthesizer();
    this.solutionProposer = new SolutionProposer();
  }

  /**
   * Main router for Atlassian Rovo Agent actions.
   */
  public async handleAction(invocation: RovoActionInvocation): Promise<RovoActionResult> {
    const actionKey = invocation.actionKey;
    const issueKey = (invocation.parameters?.issueKey as string) || 
                     invocation.context?.issueKey || 
                     'PAY-402';

    try {
      switch (actionKey) {
        case 'query-teamwork-context':
          return await this.handleQueryContext(issueKey);

        case 'analyze-blast-radius':
          return await this.handleAnalyzeBlastRadius(issueKey);

        case 'propose-solution-diff':
          return await this.handleProposeSolution(issueKey);

        default:
          return {
            success: false,
            message: `Unrecognized Rovo action key: ${actionKey}`
          };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Action execution error: ${error.message}`
      };
    }
  }

  private async handleQueryContext(issueKey: string): Promise<RovoActionResult> {
    const graph = await this.graphEngine.buildGraphForIssue(issueKey);
    const blast = this.blastAnalyzer.analyze(graph);
    const dossier = this.dossierSynthesizer.synthesize(graph, blast);

    return {
      success: true,
      message: `Retrieved connected Teamwork Graph context for ${issueKey}.`,
      data: {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        riskScore: blast.score,
        riskLevel: blast.riskLevel,
        connectedDocsCount: dossier.connectedSpecs.length,
        relatedPrsCount: dossier.relatedPrs.length
      },
      markdown: dossier.markdownSummary
    };
  }

  private async handleAnalyzeBlastRadius(issueKey: string): Promise<RovoActionResult> {
    const graph = await this.graphEngine.buildGraphForIssue(issueKey);
    const blast = this.blastAnalyzer.analyze(graph);

    const markdown = `### Blast Radius Analysis: ${issueKey}
- **Calculated Risk Level**: **${blast.riskLevel}** (${blast.score}/100)
- **Directly Impacted Services**: ${blast.affectedServices.map(s => `\`${s.name}\` (${s.criticality})`).join(', ')}
- **Transitive Linked Issues**: ${blast.transitiveIssueCount}
- **Active Competing PRs**: ${blast.openConflictingPrCount}
- **Past Incident Correlations**: ${blast.historicalIncidentMatchCount}

#### Recommended Safety Mitigations:
${blast.mitigations.map(m => `- ${m}`).join('\n')}
`;

    return {
      success: true,
      message: `Blast radius analysis completed for ${issueKey}.`,
      data: blast,
      markdown
    };
  }

  private async handleProposeSolution(issueKey: string): Promise<RovoActionResult> {
    const graph = await this.graphEngine.buildGraphForIssue(issueKey);
    const blast = this.blastAnalyzer.analyze(graph);
    const dossier = this.dossierSynthesizer.synthesize(graph, blast);
    const proposal = this.solutionProposer.propose(dossier);

    const markdown = `### Architectural Solution Proposal for ${issueKey}
**Files to update:**
${proposal.affectedFiles.map(f => `- \`${f}\``).join('\n')}

\`\`\`diff
${proposal.proposedDiff}
\`\`\`

#### Verification & Test Strategy:
${proposal.testStrategy.map(t => `- ${t}`).join('\n')}

#### Acceptance Criteria:
${proposal.verificationCriteria.map(v => `- ✅ ${v}`).join('\n')}
`;

    return {
      success: true,
      message: `Generated architectural solution proposal and test strategy for ${issueKey}.`,
      data: proposal,
      markdown
    };
  }
}
