import test from 'node:test';
import assert from 'node:assert';
import { TeamworkGraphEngine } from '../src/engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../src/engine/blastRadius';
import { ContextDossierSynthesizer } from '../src/engine/contextDossier';
import { SolutionProposer } from '../src/engine/solutionProposer';

test('SolutionProposer produces unified diff and test strategy for payment deadlock', async () => {
  const engine = new TeamworkGraphEngine();
  const analyzer = new BlastRadiusAnalyzer();
  const synthesizer = new ContextDossierSynthesizer();
  const proposer = new SolutionProposer();

  const graph = await engine.buildGraphForIssue('PAY-402');
  const blast = analyzer.analyze(graph);
  const dossier = synthesizer.synthesize(graph, blast);
  const proposal = proposer.propose(dossier);

  assert.strictEqual(proposal.issueKey, 'PAY-402');
  assert.ok(proposal.affectedFiles.includes('src/handlers/stripeWebhook.ts'));
  assert.ok(proposal.proposedDiff.includes('diff --git'));
  assert.ok(proposal.proposedDiff.includes('redisLock.acquire'));
  assert.ok(proposal.testStrategy.length >= 2, 'Must include test strategy points');
  assert.ok(proposal.verificationCriteria.length >= 2, 'Must include verification criteria');
});
