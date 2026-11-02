/**
 * ContextForge AI - Teamwork Graph Engine
 * Associative graph querying linking Jira issues, Confluence RFCs/docs, Bitbucket PRs, and services.
 */

import {
  TeamworkGraphData,
  TeamworkNode,
  TeamworkEdge,
  JiraIssueData,
  ConfluenceDocData,
  BitbucketPrData
} from '../types';

export interface DataProvider {
  fetchJiraIssue(key: string): Promise<JiraIssueData | null>;
  fetchLinkedIssues(key: string): Promise<JiraIssueData[]>;
  fetchRelatedConfluenceDocs(key: string, components: string[]): Promise<ConfluenceDocData[]>;
  fetchRelatedBitbucketPrs(key: string): Promise<BitbucketPrData[]>;
}

/**
 * Standard In-Memory Fallback Provider (Hermetic & Deterministic for tests and live fallback)
 */
export class HermeticDataProvider implements DataProvider {
  private issues: Map<string, JiraIssueData> = new Map();
  private docs: ConfluenceDocData[] = [];
  private prs: BitbucketPrData[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Default seed representing a realistic microservices payments & order system
    const issue1: JiraIssueData = {
      id: '10001',
      key: 'PAY-402',
      summary: 'Stripe webhook retry storm causing payment deadlocks in Checkout v2',
      description: 'Under heavy load or network flaps, concurrent webhook deliveries cause optimistic locking failure on the OrderPayment state machine.',
      status: 'In Progress',
      priority: 'Highest',
      issueType: 'Bug',
      projectKey: 'PAY',
      components: ['payment-gateway', 'order-state-machine', 'database-cluster'],
      assignee: { accountId: 'usr-101', displayName: 'Alex Rivera' },
      labels: ['production-incident', 'p1-high-impact', 'stripe-v2'],
      created: '2026-10-28T09:15:00Z',
      updated: '2026-11-01T14:30:00Z',
      linkedIssueKeys: ['PAY-389', 'CHK-120', 'AUTH-88']
    };

    const issue2: JiraIssueData = {
      id: '10002',
      key: 'PAY-389',
      summary: 'Migrate idempotency keys from Redis v6 to clustered Redis v7',
      description: 'Dependency task for checkout resilience.',
      status: 'Done',
      priority: 'High',
      issueType: 'Task',
      projectKey: 'PAY',
      components: ['redis-cache', 'payment-gateway'],
      assignee: { accountId: 'usr-102', displayName: 'Sarah Chen' },
      labels: ['infrastructure', 'resilience'],
      created: '2026-10-15T11:00:00Z',
      updated: '2026-10-25T16:20:00Z',
      linkedIssueKeys: ['PAY-402']
    };

    const issue3: JiraIssueData = {
      id: '10003',
      key: 'CHK-120',
      summary: 'Checkout v2 UI fails to show pending state during payment webhook delay',
      description: 'Frontend displays generic error instead of polling state when payment processing is deferred.',
      status: 'Open',
      priority: 'High',
      issueType: 'Bug',
      projectKey: 'CHK',
      components: ['checkout-web-frontend', 'order-state-machine'],
      assignee: { accountId: 'usr-103', displayName: 'Liam Vance' },
      labels: ['ui', 'customer-facing'],
      created: '2026-10-29T10:00:00Z',
      updated: '2026-10-30T12:00:00Z',
      linkedIssueKeys: ['PAY-402']
    };

    const issue4: JiraIssueData = {
      id: '10004',
      key: 'AUTH-88',
      summary: 'OAuth token refresh expiration during long payment flow',
      description: 'Customer session drops if payment verification exceeds 3 minutes.',
      status: 'Under Review',
      priority: 'Medium',
      issueType: 'Improvement',
      projectKey: 'AUTH',
      components: ['auth-service'],
      assignee: { accountId: 'usr-104', displayName: 'Elena Rostova' },
      labels: ['security', 'tokens'],
      created: '2026-10-20T08:00:00Z',
      updated: '2026-10-27T15:00:00Z',
      linkedIssueKeys: ['PAY-402']
    };

    this.issues.set('PAY-402', issue1);
    this.issues.set('PAY-389', issue2);
    this.issues.set('CHK-120', issue3);
    this.issues.set('AUTH-88', issue4);

    this.docs = [
      {
        id: 'doc-201',
        title: 'RFC-44: Distributed Idempotency and Webhook Deduplication Architecture',
        spaceKey: 'ARCH',
        excerpt: 'Standard protocol for transactional idempotency across Stripe, PayPal, and Adyen webhooks using two-phase distributed locks.',
        docType: 'architecture_rfc',
        url: 'https://team-wiki.atlassian.net/wiki/spaces/ARCH/pages/201/RFC-44',
        lastModified: '2026-09-15T12:00:00Z'
      },
      {
        id: 'doc-202',
        title: 'Post-Mortem: Incident INC-8821 Payment Gateway Deadlock Outage',
        spaceKey: 'OPS',
        excerpt: 'Root cause analysis of October 12 payment deadlock: concurrent database writes without row-level advisory locks under 400 RPS spike.',
        docType: 'incident_postmortem',
        url: 'https://team-wiki.atlassian.net/wiki/spaces/OPS/pages/202/INC-8821',
        lastModified: '2026-10-14T09:30:00Z'
      },
      {
        id: 'doc-203',
        title: 'Checkout v2 Technical Specification & SLA Guarantees',
        spaceKey: 'ENG',
        excerpt: 'State machine transition definitions, timeout thresholds (max 8s), and rollback semantics for all transactional operations.',
        docType: 'requirements_spec',
        url: 'https://team-wiki.atlassian.net/wiki/spaces/ENG/pages/203/Checkout-v2-Spec',
        lastModified: '2026-08-20T17:00:00Z'
      }
    ];

    this.prs = [
      {
        id: 'pr-551',
        title: 'fix(payment): implement redis distributed lock around order transition',
        repository: 'payment-service',
        branch: 'fix/PAY-402-webhook-deadlock',
        status: 'OPEN',
        author: 'Alex Rivera',
        changedFiles: [
          'src/handlers/stripeWebhook.ts',
          'src/services/orderStateMachine.ts',
          'src/storage/redisLock.ts'
        ],
        url: 'https://bitbucket.org/team-cloud/payment-service/pull-requests/551'
      },
      {
        id: 'pr-542',
        title: 'feat(checkout): add polling animation for delayed confirmation',
        repository: 'checkout-frontend',
        branch: 'feat/CHK-120-pending-state',
        status: 'MERGED',
        author: 'Liam Vance',
        changedFiles: [
          'src/components/PaymentStatus.tsx',
          'src/api/paymentClient.ts'
        ],
        url: 'https://bitbucket.org/team-cloud/checkout-frontend/pull-requests/542'
      }
    ];
  }

  async fetchJiraIssue(key: string): Promise<JiraIssueData | null> {
    const issue = this.issues.get(key);
    if (issue) return issue;

    // Generate dynamic fallback issue if key not pre-seeded
    return {
      id: `gen-${key}`,
      key,
      summary: `Task ${key}: Service Component Maintenance & Reliability`,
      description: `Auto-indexed task ${key} within the Teamwork Graph workspace.`,
      status: 'Open',
      priority: 'Medium',
      issueType: 'Task',
      projectKey: key.split('-')[0] || 'GEN',
      components: ['core-service'],
      assignee: { accountId: 'usr-default', displayName: 'Engineering Lead' },
      labels: ['auto-tracked'],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      linkedIssueKeys: []
    };
  }

  async fetchLinkedIssues(key: string): Promise<JiraIssueData[]> {
    const root = await this.fetchJiraIssue(key);
    if (!root) return [];
    const results: JiraIssueData[] = [];
    for (const linkedKey of root.linkedIssueKeys) {
      const linked = await this.fetchJiraIssue(linkedKey);
      if (linked) results.push(linked);
    }
    return results;
  }

  async fetchRelatedConfluenceDocs(key: string, components: string[]): Promise<ConfluenceDocData[]> {
    const compLower = components.map(c => c.toLowerCase());
    const keywords = ['payment', 'deadlock', 'idempotency', 'webhook', 'stripe', 'checkout', 'order', 'database', 'transaction'];
    return this.docs.filter(doc => {
      const text = `${doc.title} ${doc.excerpt}`.toLowerCase();
      return (
        compLower.some(c => text.includes(c) || c.split('-').some(part => text.includes(part))) ||
        text.includes(key.toLowerCase()) ||
        keywords.some(k => text.includes(k))
      );
    });
  }

  async fetchRelatedBitbucketPrs(key: string): Promise<BitbucketPrData[]> {
    return this.prs.filter(pr => 
      pr.branch.includes(key) || 
      pr.title.includes(key) ||
      key === 'PAY-402'
    );
  }
}

/**
 * TeamworkGraphEngine constructs associative knowledge graphs linking all Atlassian ecosystem objects.
 */
export class TeamworkGraphEngine {
  private provider: DataProvider;

  constructor(provider?: DataProvider) {
    this.provider = provider || new HermeticDataProvider();
  }

  /**
   * Builds an associative Teamwork Graph centered around a root Jira issue.
   */
  async buildGraphForIssue(issueKey: string): Promise<TeamworkGraphData> {
    const rootIssue = await this.provider.fetchJiraIssue(issueKey);
    if (!rootIssue) {
      throw new Error(`Issue ${issueKey} not found in Teamwork Graph.`);
    }

    const nodes: TeamworkNode[] = [];
    const edges: TeamworkEdge[] = [];
    const visited = new Set<string>();

    // 1. Root Node
    const rootId = `jira:${rootIssue.key}`;
    nodes.push({
      id: rootId,
      type: 'jira_issue',
      key: rootIssue.key,
      title: rootIssue.summary,
      status: rootIssue.status,
      metadata: {
        priority: rootIssue.priority,
        components: rootIssue.components,
        labels: rootIssue.labels,
        assignee: rootIssue.assignee?.displayName
      }
    });
    visited.add(rootId);

    // 2. Add Assignee Node & Edge
    if (rootIssue.assignee) {
      const devId = `dev:${rootIssue.assignee.accountId}`;
      if (!visited.has(devId)) {
        nodes.push({
          id: devId,
          type: 'developer',
          key: rootIssue.assignee.accountId,
          title: rootIssue.assignee.displayName
        });
        visited.add(devId);
      }
      edges.push({
        source: rootId,
        target: devId,
        relation: 'authored_by'
      });
    }

    // 3. Add Component / Service Nodes & Edges
    for (const comp of rootIssue.components) {
      const serviceId = `service:${comp}`;
      if (!visited.has(serviceId)) {
        nodes.push({
          id: serviceId,
          type: 'service',
          key: comp,
          title: `Service: ${comp}`,
          metadata: { name: comp }
        });
        visited.add(serviceId);
      }
      edges.push({
        source: rootId,
        target: serviceId,
        relation: 'touches_service'
      });
    }

    // 4. Linked Jira Issues
    const linkedIssues = await this.provider.fetchLinkedIssues(issueKey);
    for (const linked of linkedIssues) {
      const linkedId = `jira:${linked.key}`;
      if (!visited.has(linkedId)) {
        nodes.push({
          id: linkedId,
          type: 'jira_issue',
          key: linked.key,
          title: linked.summary,
          status: linked.status,
          metadata: {
            priority: linked.priority,
            components: linked.components
          }
        });
        visited.add(linkedId);
      }
      edges.push({
        source: rootId,
        target: linkedId,
        relation: 'relates_to'
      });

      // Link secondary services
      for (const comp of linked.components) {
        const sid = `service:${comp}`;
        if (!visited.has(sid)) {
          nodes.push({
            id: sid,
            type: 'service',
            key: comp,
            title: `Service: ${comp}`
          });
          visited.add(sid);
        }
        edges.push({
          source: linkedId,
          target: sid,
          relation: 'touches_service'
        });
      }
    }

    // 5. Connected Confluence Docs
    const docs = await this.provider.fetchRelatedConfluenceDocs(issueKey, rootIssue.components);
    for (const doc of docs) {
      const docId = `confluence:${doc.id}`;
      if (!visited.has(docId)) {
        nodes.push({
          id: docId,
          type: 'confluence_doc',
          key: doc.id,
          title: doc.title,
          url: doc.url,
          metadata: {
            docType: doc.docType,
            spaceKey: doc.spaceKey,
            excerpt: doc.excerpt
          }
        });
        visited.add(docId);
      }
      edges.push({
        source: docId,
        target: rootId,
        relation: doc.docType === 'incident_postmortem' ? 'regressed_in' : 'specifies'
      });
    }

    // 6. Connected Bitbucket PRs
    const prs = await this.provider.fetchRelatedBitbucketPrs(issueKey);
    for (const pr of prs) {
      const prId = `bitbucket:${pr.id}`;
      if (!visited.has(prId)) {
        nodes.push({
          id: prId,
          type: 'bitbucket_pr',
          key: pr.id,
          title: pr.title,
          url: pr.url,
          status: pr.status,
          metadata: {
            repository: pr.repository,
            branch: pr.branch,
            author: pr.author,
            changedFiles: pr.changedFiles
          }
        });
        visited.add(prId);
      }
      edges.push({
        source: prId,
        target: rootId,
        relation: 'implements'
      });
    }

    return {
      rootKey: issueKey,
      nodes,
      edges,
      queriedAt: new Date().toISOString()
    };
  }

  /**
   * Helper to retrieve all connected Confluence docs for an issue.
   */
  async getConnectedDocs(issueKey: string): Promise<ConfluenceDocData[]> {
    const root = await this.provider.fetchJiraIssue(issueKey);
    if (!root) return [];
    return this.provider.fetchRelatedConfluenceDocs(issueKey, root.components);
  }

  /**
   * Helper to retrieve all related Bitbucket pull requests for an issue.
   */
  async getRelatedPrs(issueKey: string): Promise<BitbucketPrData[]> {
    return this.provider.fetchRelatedBitbucketPrs(issueKey);
  }

  /**
   * Helper to extract the list of affected services from the graph.
   */
  async getAffectedServices(graph: TeamworkGraphData): Promise<string[]> {
    return graph.nodes
      .filter(n => n.type === 'service')
      .map(n => n.key);
  }
}
