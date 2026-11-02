import test from 'node:test';
import assert from 'node:assert';
import { actionHandler, mcpWebtriggerHandler } from '../src/index';

test('actionHandler routes Rovo Agent action', async () => {
  const result = await actionHandler({
    actionKey: 'query-teamwork-context',
    parameters: { issueKey: 'PAY-402' }
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.markdown.includes('PAY-402'));
});

test('mcpWebtriggerHandler handles HTTP POST JSON-RPC', async () => {
  const httpRequest = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 99,
      method: 'tools/call',
      params: {
        name: 'calculate_blast_radius',
        arguments: { issueKey: 'PAY-402' }
      }
    })
  };

  const httpResponse = await mcpWebtriggerHandler(httpRequest);
  assert.strictEqual(httpResponse.statusCode, 200);
  assert.ok(httpResponse.headers['Content-Type'] === 'application/json' || httpResponse.headers['Content-Type']?.[0] === 'application/json');

  const rpcResponse = JSON.parse(httpResponse.body);
  assert.strictEqual(rpcResponse.jsonrpc, '2.0');
  assert.strictEqual(rpcResponse.id, 99);
  const data = JSON.parse(rpcResponse.result.content[0].text);
  assert.strictEqual(data.riskLevel, 'CRITICAL');
});

test('mcpWebtriggerHandler rejects non-POST requests', async () => {
  const httpRequest = {
    method: 'GET'
  };

  const httpResponse = await mcpWebtriggerHandler(httpRequest);
  assert.strictEqual(httpResponse.statusCode, 405);
});
