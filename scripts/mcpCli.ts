/**
 * ContextForge AI - MCP Stdio Bridge & Interactive Inspector
 * Run directly via Node to inspect the MCP server or bridge with desktop agents.
 */

import { ContextForgeMcpServer } from '../src/mcp/server';

async function main() {
  const server = new ContextForgeMcpServer();
  const args = process.argv.slice(2);
  const command = args[0] || 'demo';

  if (command === 'demo') {
    console.log('===============================================================');
    console.log(' ContextForge AI - Atlassian Teamwork Graph & MCP Live Demo');
    console.log('===============================================================');

    // 1. Initialize
    console.log('\n[1] Client Handshake: initialize');
    const initRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize'
    });
    console.log('Response:', initRes.result?.content[0]?.text);

    // 2. List Tools
    console.log('\n[2] Client Query: tools/list');
    const toolsRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    });
    const toolsData = JSON.parse(toolsRes.result?.content[0]?.text || '{}');
    console.log(`Available Tools (${toolsData.tools.length}):`);
    toolsData.tools.forEach((t: any) => console.log(` - ${t.name}: ${t.description}`));

    // 3. Query Teamwork Graph & Blast Radius for PAY-402
    console.log('\n[3] Calling Tool: calculate_blast_radius for PAY-402');
    const blastRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'calculate_blast_radius',
        arguments: { issueKey: 'PAY-402' }
      }
    });
    console.log('Blast Radius Analysis:\n', blastRes.result?.content[0]?.text);

    // 4. Propose Solution Diff
    console.log('\n[4] Calling Tool: propose_solution_diff for PAY-402');
    const diffRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'propose_solution_diff',
        arguments: { issueKey: 'PAY-402' }
      }
    });
    const diffData = JSON.parse(diffRes.result?.content[0]?.text || '{}');
    console.log('Affected Files:', diffData.affectedFiles);
    console.log('Proposed Unified Diff:\n', diffData.proposedDiff);

    // 5. Post Agent Verdict
    console.log('\n[5] Calling Tool: post_agent_verdict');
    const verdictRes = await server.handleRequest({
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'post_agent_verdict',
        arguments: {
          issueKey: 'PAY-402',
          agentName: 'Claude Code (Anthropic)',
          verdict: 'VERIFIED',
          summary: 'Validated distributed locks against 500 parallel webhook retry events. Zero deadlocks recorded.'
        }
      }
    });
    console.log('Verdict Response:\n', verdictRes.result?.content[0]?.text);

    console.log('\n===============================================================');
    console.log(' Live Demo Completed Successfully! Zero Cloud Credentials Needed.');
    console.log('===============================================================');
  } else if (command === 'stdio') {
    // Stdio JSON-RPC 2.0 loop
    process.stdin.setEncoding('utf8');
    let buffer = '';

    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const req = JSON.parse(line);
          const res = await server.handleRequest(req);
          process.stdout.write(JSON.stringify(res) + '\n');
        } catch (err: any) {
          process.stdout.write(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: err.message }
          }) + '\n');
        }
      }
    });
  }
}

main().catch(console.error);
