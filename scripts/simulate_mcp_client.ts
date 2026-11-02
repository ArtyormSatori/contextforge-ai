/**
 * ContextForge AI - MCP Simulation Client
 * Demonstrates external coding agent (Claude Code / Cursor / Hermes) querying
 * Atlassian Teamwork Graph context and blast radius via Model Context Protocol (MCP).
 */

import { ContextForgeMcpServer } from '../src/mcp/server';

async function main() {
  console.log('================================================================');
  console.log(' ContextForge AI - Model Context Protocol (MCP) Live Simulation');
  console.log('================================================================\n');

  const server = new ContextForgeMcpServer();

  // 1. Initialize MCP Session
  console.log('--> Step 1: Initializing MCP Session...');
  const initResponse = await server.handleRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      clientInfo: { name: 'Claude-Code-Agent', version: '1.0.0' },
      protocolVersion: '2024-11-05'
    }
  });
  console.log('MCP Init Response:', JSON.stringify(initResponse.result, null, 2));

  // 2. Discover Tools
  console.log('\n--> Step 2: Listing Available Context Tools...');
  const toolsResponse = await server.handleRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  });
  console.log(`Discovered ${toolsResponse.result?.tools?.length || 0} Tools:`);
  toolsResponse.result?.tools?.forEach((t: any) => {
    console.log(` - [${t.name}]: ${t.description}`);
  });

  // 3. Call get_issue_context for PAY-402
  console.log('\n--> Step 3: Invoking get_issue_context for PAY-402...');
  const contextCall = await server.handleRequest({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_issue_context',
      arguments: { issueKey: 'PAY-402' }
    }
  });
  const dossier = JSON.parse(contextCall.result?.content?.[0]?.text || '{}');
  console.log(`Dossier Issue: ${dossier.issueKey} - ${dossier.title}`);
  console.log(`Connected Confluence Specs (${dossier.connectedSpecs?.length || 0}):`);
  dossier.connectedSpecs?.forEach((s: any) => console.log(`   * [${s.id}] ${s.title} (${s.docType})`));
  console.log(`Related Bitbucket PRs (${dossier.relatedPrs?.length || 0}):`);
  dossier.relatedPrs?.forEach((p: any) => console.log(`   * [${p.id}] ${p.title} (${p.status})`));
  console.log(`Key Stakeholders: ${dossier.keyStakeholders?.join(', ')}`);

  // 4. Call query_teamwork_graph
  console.log('\n--> Step 4: Querying Full Teamwork Graph for PAY-402...');
  const graphCall = await server.handleRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'query_teamwork_graph',
      arguments: { issueKey: 'PAY-402', depth: 2 }
    }
  });
  const graphData = JSON.parse(graphCall.result?.content?.[0]?.text || '{}');
  console.log(`Graph contains ${graphData.nodes?.length || 0} nodes and ${graphData.edges?.length || 0} relational edges.`);

  // 5. Call calculate_blast_radius for PAY-402
  console.log('\n--> Step 5: Invoking calculate_blast_radius for PAY-402...');
  const blastCall = await server.handleRequest({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'calculate_blast_radius',
      arguments: { issueKey: 'PAY-402' }
    }
  });
  const blastData = JSON.parse(blastCall.result?.content?.[0]?.text || '{}');
  console.log(`Risk Score: ${blastData.score}/100 [Level: ${blastData.riskLevel}]`);
  console.log('Affected Services:');
  blastData.affectedServices?.forEach((s: any) => {
    console.log(`   - ${s.name} (Tier ${s.tier} / ${s.criticality}): ${s.reason}`);
  });
  console.log('Risk Factors:');
  blastData.riskFactors?.forEach((rf: string) => console.log(`   ! ${rf}`));
  console.log('Mitigations:');
  blastData.mitigations?.forEach((m: string) => console.log(`   + ${m}`));

  // 6. Post Agent Verdict back to Jira
  console.log('\n--> Step 6: Posting Agent Verdict via post_agent_verdict...');
  const verdictCall = await server.handleRequest({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'post_agent_verdict',
      arguments: {
        issueKey: 'PAY-402',
        verdict: 'APPROVED_WITH_CAUTION',
        summary: 'Distributed lock implemented with fallback TTL. High load tests verified 0 deadlocks across 500 concurrent webhooks.',
        diffSnippet: 'src/services/orderStateMachine.ts: withLock(`order:${orderId}`, 5000)'
      }
    }
  });
  const verdictResult = JSON.parse(verdictCall.result?.content?.[0]?.text || '{}');
  console.log('Agent Verdict Outcome:', verdictResult);
  console.log('\n MCP Simulation Completed Successfully!');
}

main().catch(console.error);
