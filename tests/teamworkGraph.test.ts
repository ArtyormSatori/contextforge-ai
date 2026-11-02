import test from 'node:test';
import assert from 'node:assert';
import { TeamworkGraphEngine, HermeticDataProvider } from '../src/engine/teamworkGraph';

test('TeamworkGraphEngine builds associative graph for PAY-402', async () => {
  const engine = new TeamworkGraphEngine();
  const graph = await engine.buildGraphForIssue('PAY-402');

  assert.strictEqual(graph.rootKey, 'PAY-402');
  assert.ok(graph.nodes.length >= 7, `Expected at least 7 nodes, got ${graph.nodes.length}`);
  assert.ok(graph.edges.length >= 7, `Expected at least 7 edges, got ${graph.edges.length}`);

  // Root node check
  const rootNode = graph.nodes.find(n => n.id === 'jira:PAY-402');
  assert.ok(rootNode, 'Root node must exist in graph');
  assert.strictEqual(rootNode?.type, 'jira_issue');
  assert.strictEqual(rootNode?.key, 'PAY-402');

  // Verify node types
  const types = new Set(graph.nodes.map(n => n.type));
  assert.ok(types.has('jira_issue'), 'Graph must contain jira_issue nodes');
  assert.ok(types.has('developer'), 'Graph must contain developer nodes');
  assert.ok(types.has('service'), 'Graph must contain service nodes');
  assert.ok(types.has('confluence_doc'), 'Graph must contain confluence_doc nodes');
  assert.ok(types.has('bitbucket_pr'), 'Graph must contain bitbucket_pr nodes');

  // Verify relations
  const relations = new Set(graph.edges.map(e => e.relation));
  assert.ok(relations.has('authored_by'), 'Must relate author');
  assert.ok(relations.has('touches_service'), 'Must relate touched services');
  assert.ok(relations.has('relates_to'), 'Must relate linked issues');
  assert.ok(relations.has('implements'), 'Must relate pull requests');
});

test('TeamworkGraphEngine handles fallback dynamic issue', async () => {
  const engine = new TeamworkGraphEngine();
  const graph = await engine.buildGraphForIssue('CUSTOM-999');

  assert.strictEqual(graph.rootKey, 'CUSTOM-999');
  assert.ok(graph.nodes.length >= 2, 'Must create at least root and service/dev nodes');
});
