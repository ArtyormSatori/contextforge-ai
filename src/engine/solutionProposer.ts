/**
 * ContextForge AI - Solution & Diff Proposer
 * Produces architectural diff proposals and test verification plans based on Teamwork Graph context.
 */

import { ContextDossier, CodeDiffProposal } from '../types';

export class SolutionProposer {
  /**
   * Generates a concrete code proposal and test strategy based on the context dossier.
   */
  public propose(dossier: ContextDossier): CodeDiffProposal {
    const isPaymentIssue = dossier.issueKey.startsWith('PAY') || 
                           dossier.title.toLowerCase().includes('payment') ||
                           dossier.title.toLowerCase().includes('webhook');

    let affectedFiles: string[] = [];
    let proposedDiff = '';
    let testStrategy: string[] = [];
    let verificationCriteria: string[] = [];

    if (isPaymentIssue) {
      affectedFiles = [
        'src/handlers/stripeWebhook.ts',
        'src/services/orderStateMachine.ts',
        'src/storage/redisLock.ts'
      ];

      proposedDiff = `diff --git a/src/handlers/stripeWebhook.ts b/src/handlers/stripeWebhook.ts
--- a/src/handlers/stripeWebhook.ts
+++ b/src/handlers/stripeWebhook.ts
@@ -24,8 +24,19 @@ export async function handleWebhookEvent(event: StripeEvent): Promise<void> {
   const { orderId, paymentId } = event.data.object;
   
-  // Vulnerable to concurrency race conditions without distributed lock
-  const order = await orderService.getById(orderId);
-  await orderStateMachine.transition(order, event.type);
+  // Mitigated with Redis v7 two-phase distributed lock & idempotency key
+  const lockKey = \`lock:order:\${orderId}\`;
+  const lockAcquired = await redisLock.acquire(lockKey, { ttlMs: 4000, maxRetries: 3 });
+  
+  if (!lockAcquired) {
+    logger.warn(\`Concurrent webhook ignored for order \${orderId}\`);
+    return; // Safe idempotency ACK
+  }
+  
+  try {
+    const order = await orderService.getById(orderId);
+    await orderStateMachine.transition(order, event.type);
+  } finally {
+    await redisLock.release(lockKey);
+  }
 }`;

      testStrategy = [
        'Unit Test: Simulate concurrent duplicate webhooks with identical event IDs and assert single transition execution.',
        'Integration Test: Execute 50 parallel requests against Redis lock manager with artificial 100ms network latency.',
        'Regression Test: Verify RFC-44 compliance for webhook ACK HTTP 200 response times <= 300ms.'
      ];

      verificationCriteria = [
        'Zero deadlock occurrences observed in synthetic stress testing under 500 RPS.',
        'Idempotency key TTL verified at 86400s in Redis cache.',
        'Order state machine remains strictly in terminal state after repeated webhook replays.'
      ];
    } else {
      // General architectural recommendation
      affectedFiles = [
        `src/services/${dossier.issueKey.toLowerCase()}Service.ts`,
        `tests/integration/${dossier.issueKey.toLowerCase()}.test.ts`
      ];

      proposedDiff = `diff --git a/src/services/${dossier.issueKey.toLowerCase()}Service.ts b/src/services/${dossier.issueKey.toLowerCase()}Service.ts
--- a/src/services/${dossier.issueKey.toLowerCase()}Service.ts
+++ b/src/services/${dossier.issueKey.toLowerCase()}Service.ts
@@ -10,6 +10,12 @@ export class ServiceController {
   public async executeTask(context: TaskContext): Promise<TaskResult> {
+    // Added guardrails based on Teamwork Graph blast radius evaluation
+    if (context.hasTransitiveConflict) {
+      logger.info('Executing with isolated transaction boundary');
+    }
     return await this.worker.run(context);
   }
 }`;

      testStrategy = [
        'Hermetic component test verifying input boundary validation.',
        'Contract test verifying backwards compatibility of JSON responses.'
      ];

      verificationCriteria = [
        'Test suite passes with 100% assertions satisfied.',
        'No regressions detected in downstream dependent modules.'
      ];
    }

    return {
      issueKey: dossier.issueKey,
      summary: `Automated architectural fix proposal for ${dossier.issueKey} (${dossier.title})`,
      affectedFiles,
      proposedDiff,
      testStrategy,
      verificationCriteria
    };
  }
}
