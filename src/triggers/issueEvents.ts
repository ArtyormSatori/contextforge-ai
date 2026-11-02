/**
 * ContextForge AI - Jira Issue Event Triggers
 * Automatically calculates blast radius on issue creation and updates.
 */

import { TeamworkGraphEngine } from '../engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../engine/blastRadius';

const graphEngine = new TeamworkGraphEngine();
const blastAnalyzer = new BlastRadiusAnalyzer();

export async function handleIssueEvent(event: any): Promise<void> {
  const issueKey = event.issue?.key;
  if (!issueKey) {
    console.log('[ContextForge] No issue key found in event payload.');
    return;
  }

  console.log(`[ContextForge] Processing background event for issue ${issueKey}`);
  try {
    const graph = await graphEngine.buildGraphForIssue(issueKey);
    const blast = blastAnalyzer.analyze(graph);

    console.log(`[ContextForge] Calculated blast radius for ${issueKey}: Score=${blast.score}, Risk=${blast.riskLevel}`);
  } catch (err: any) {
    console.error(`[ContextForge] Error processing issue event for ${issueKey}:`, err.message);
  }
}
