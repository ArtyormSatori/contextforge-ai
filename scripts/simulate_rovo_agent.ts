/**
 * ContextForge AI - Rovo Agent Simulation Runner
 * Demonstrates Atlassian Rovo Agent executing conversational actions and triggering
 * Teamwork Graph queries, blast radius assessments, and solution proposals.
 */

import { RovoActionHandler } from '../src/rovo/agentActions';

async function main() {
  console.log('================================================================');
  console.log(' ContextForge AI - Atlassian Rovo Agent Action Simulation');
  console.log('================================================================\n');

  const handler = new RovoActionHandler();

  // Action 1: Query Teamwork Graph Context
  console.log('--> Rovo Action: query-teamwork-context for PAY-402');
  const res1 = await handler.handleAction({
    actionKey: 'query-teamwork-context',
    parameters: { issueKey: 'PAY-402' }
  });
  console.log('Status:', res1.success ? 'SUCCESS' : 'FAILED');
  console.log('Summary Preview:\n', (res1.markdown || '').substring(0, 320) + '...\n');

  // Action 2: Analyze Blast Radius
  console.log('--> Rovo Action: analyze-blast-radius for PAY-402');
  const res2 = await handler.handleAction({
    actionKey: 'analyze-blast-radius',
    parameters: { issueKey: 'PAY-402' }
  });
  console.log('Status:', res2.success ? 'SUCCESS' : 'FAILED');
  console.log('Blast Radius Output:\n', (res2.markdown || '').substring(0, 320) + '...\n');

  // Action 3: Propose Solution Diff
  console.log('--> Rovo Action: propose-solution-diff for PAY-402');
  const res3 = await handler.handleAction({
    actionKey: 'propose-solution-diff',
    parameters: { issueKey: 'PAY-402' }
  });
  console.log('Status:', res3.success ? 'SUCCESS' : 'FAILED');
  console.log('Solution Proposal Output:\n', (res3.markdown || '').substring(0, 320) + '...\n');

  console.log(' Rovo Agent Simulation Completed Successfully!');
}

main().catch(console.error);
