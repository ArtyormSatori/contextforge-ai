import test from 'node:test';
import assert from 'node:assert';
import { TeamworkGraphEngine } from '../src/engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../src/engine/blastRadius';

test('BlastRadiusAnalyzer evaluates critical risk for PAY-402', async () => {
  const engine = new TeamworkGraphEngine();
  const analyzer = new BlastRadiusAnalyzer();

  const graph = await engine.buildGraphForIssue('PAY-402');
  const blast = analyzer.analyze(graph);

  assert.strictEqual(blast.rootKey, 'PAY-402');
  assert.ok(blast.score >= 75, `Expected critical score >= 75, got ${blast.score}`);
  assert.strictEqual(blast.riskLevel, 'CRITICAL');

  // Verify affected services
  assert.ok(blast.affectedServices.length >= 2, 'Should identify multiple affected services');
  const coreServices = blast.affectedServices.filter(s => s.tier === 1);
  assert.ok(coreServices.length >= 1, 'Should identify Tier-1 core payment services');

  // Verify factors & mitigations
  assert.ok(blast.riskFactors.length >= 2, 'Should identify multiple risk factors');
  assert.ok(blast.mitigations.length >= 2, 'Should provide actionable mitigations');
  assert.strictEqual(blast.historicalIncidentMatchCount >= 1, true, 'Should correlate past post-mortems');
});

test('BlastRadiusAnalyzer handles low-risk peripheral task', async () => {
  const engine = new TeamworkGraphEngine();
  const analyzer = new BlastRadiusAnalyzer();

  const graph = await engine.buildGraphForIssue('DOCS-101');
  const blast = analyzer.analyze(graph);

  assert.strictEqual(blast.rootKey, 'DOCS-101');
  assert.ok(blast.score < 50, `Expected low or medium score < 50, got ${blast.score}`);
  assert.ok(['LOW', 'MEDIUM'].includes(blast.riskLevel));
});
