import test from 'node:test';
import assert from 'node:assert';
import { ContextForgeMcpServer } from '../src/mcp/server';
import { CONTEXTFORGE_MCP_TOOLS } from '../src/mcp/tools';

test('MCP Server handles initialize negotiation', async () => {
  const server = new ContextForgeMcpServer();
  const res = await server.handleRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize'
  });

  assert.strictEqual(res.jsonrpc, '2.0');
  assert.strictEqual(res.id, 1);
  assert.ok(res.result?.content[0]?.text);
  const data = JSON.parse(res.result.content[0].text);
  assert.strictEqual(data.serverInfo.name, 'contextforge-atlassian-mcp');
  assert.strictEqual(data.protocolVersion, '2024-11-05');
});

test('MCP Server handles tools/list', async () => {
  const server = new ContextForgeMcpServer();
  const res = await server.handleRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  });

  assert.strictEqual(res.jsonrpc, '2.0');
  assert.strictEqual(res.id, 2);
  const data = JSON.parse(res.result?.content[0]?.text || '{}');
  assert.strictEqual(data.tools.length, 5);
  const toolNames = data.tools.map((t: any) => t.name);
  assert.ok(toolNames.includes('get_issue_context'));
  assert.ok(toolNames.includes('query_teamwork_graph'));
  assert.ok(toolNames.includes('calculate_blast_radius'));
  assert.ok(toolNames.includes('propose_solution_diff'));
  assert.ok(toolNames.includes('post_agent_verdict'));
});

test('MCP Server executes tools/call get_issue_context', async () => {
  const server = new ContextForgeMcpServer();
  const res = await server.handleRequest({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_issue_context',
      arguments: { issueKey: 'PAY-402' }
    }
  });

  assert.strictEqual(res.jsonrpc, '2.0');
  assert.strictEqual(res.id, 3);
  const dossier = JSON.parse(res.result?.content[0]?.text || '{}');
  assert.strictEqual(dossier.issueKey, 'PAY-402');
  assert.strictEqual(dossier.blastRadius.riskLevel, 'CRITICAL');
});

test('MCP Server executes tools/call calculate_blast_radius', async () => {
  const server = new ContextForgeMcpServer();
  const res = await server.handleRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'calculate_blast_radius',
      arguments: { issueKey: 'PAY-402' }
    }
  });

  assert.strictEqual(res.jsonrpc, '2.0');
  const blast = JSON.parse(res.result?.content[0]?.text || '{}');
  assert.strictEqual(blast.rootKey, 'PAY-402');
  assert.strictEqual(blast.riskLevel, 'CRITICAL');
});

test('MCP Server executes tools/call post_agent_verdict', async () => {
  const server = new ContextForgeMcpServer();
  const res = await server.handleRequest({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'post_agent_verdict',
      arguments: {
        issueKey: 'PAY-402',
        agentName: 'Claude Code',
        verdict: 'VERIFIED',
        summary: 'All 15 integration tests passing with zero concurrency deadlocks.'
      }
    }
  });

  assert.strictEqual(res.jsonrpc, '2.0');
  const record = JSON.parse(res.result?.content[0]?.text || '{}');
  assert.strictEqual(record.verdict, 'VERIFIED');
  assert.strictEqual(record.status, 'RECORDED_IN_ENTITY_PROPERTY');
});

test('MCP Server handles ping and errors', async () => {
  const server = new ContextForgeMcpServer();
  const pingRes = await server.handleRequest({
    jsonrpc: '2.0',
    id: 6,
    method: 'ping'
  });
  assert.strictEqual(pingRes.result?.content[0]?.text, 'pong');

  const unknownRes = await server.handleRequest({
    jsonrpc: '2.0',
    id: 7,
    method: 'unknown_method'
  });
  assert.strictEqual(unknownRes.error?.code, -32601);
});
