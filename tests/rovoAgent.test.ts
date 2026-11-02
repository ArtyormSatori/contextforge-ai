import test from 'node:test';
import assert from 'node:assert';
import { RovoActionHandler } from '../src/rovo/agentActions';

test('RovoActionHandler processes query-teamwork-context', async () => {
  const handler = new RovoActionHandler();
  const res = await handler.handleAction({
    actionKey: 'query-teamwork-context',
    parameters: { issueKey: 'PAY-402' }
  });

  assert.strictEqual(res.success, true);
  assert.ok(res.markdown?.includes('ContextForge Intelligence Dossier: PAY-402'));
  const data = res.data as any;
  assert.ok(data.nodeCount >= 7);
  assert.strictEqual(data.riskLevel, 'CRITICAL');
});

test('RovoActionHandler processes analyze-blast-radius', async () => {
  const handler = new RovoActionHandler();
  const res = await handler.handleAction({
    actionKey: 'analyze-blast-radius',
    parameters: { issueKey: 'PAY-402' }
  });

  assert.strictEqual(res.success, true);
  assert.ok(res.markdown?.includes('Blast Radius Analysis: PAY-402'));
  const blast = res.data as any;
  assert.strictEqual(blast.riskLevel, 'CRITICAL');
});

test('RovoActionHandler processes propose-solution-diff', async () => {
  const handler = new RovoActionHandler();
  const res = await handler.handleAction({
    actionKey: 'propose-solution-diff',
    parameters: { issueKey: 'PAY-402' }
  });

  assert.strictEqual(res.success, true);
  assert.ok(res.markdown?.includes('Architectural Solution Proposal for PAY-402'));
  assert.ok(res.markdown?.includes('diff --git'));
});

test('RovoActionHandler handles invalid action key', async () => {
  const handler = new RovoActionHandler();
  const res = await handler.handleAction({
    actionKey: 'non-existent-action',
    parameters: {}
  });

  assert.strictEqual(res.success, false);
  assert.ok(res.message.includes('Unrecognized Rovo action key'));
});
