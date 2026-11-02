import test from 'node:test';
import assert from 'node:assert';
import { TeamworkGraphEngine } from '../src/engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../src/engine/blastRadius';
import { ContextDossierSynthesizer } from '../src/engine/contextDossier';

test('ContextDossierSynthesizer generates structured markdown dossier', async () => {
  const engine = new TeamworkGraphEngine();
  const analyzer = new BlastRadiusAnalyzer();
  const synthesizer = new ContextDossierSynthesizer();

  const graph = await engine.buildGraphForIssue('PAY-402');
  const blast = analyzer.analyze(graph);
  const dossier = synthesizer.synthesize(graph, blast);

  assert.strictEqual(dossier.issueKey, 'PAY-402');
  assert.ok(dossier.connectedSpecs.length >= 2, 'Should include connected Confluence specs');
  assert.ok(dossier.relatedPrs.length >= 1, 'Should include connected Bitbucket PRs');
  assert.ok(dossier.keyStakeholders.length >= 1, 'Should identify key stakeholders');
  assert.ok(dossier.suggestedCheckpoints.length >= 3, 'Should provide verification checkpoints');

  // Markdown assertions
  assert.ok(dossier.markdownSummary.includes('ContextForge Intelligence Dossier: PAY-402'));
  assert.ok(dossier.markdownSummary.includes('Blast Radius & Risk Assessment'));
  assert.ok(dossier.markdownSummary.includes('CRITICAL'));
  assert.ok(dossier.markdownSummary.includes('Connected Specifications & Architecture RFCs'));
  assert.ok(dossier.markdownSummary.includes('Active Code Branches & Pull Requests'));
});
