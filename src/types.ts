/**
 * ContextForge AI - Type Definitions
 * Supporting Teamwork Graph, Atlassian Rovo Agent, and Model Context Protocol (MCP)
 */

export type EntityType = 'jira_issue' | 'confluence_doc' | 'bitbucket_pr' | 'service' | 'developer';

export type RelationType = 
  | 'blocks' 
  | 'depends_on' 
  | 'specifies' 
  | 'implements' 
  | 'authored_by' 
  | 'reviewed_by' 
  | 'regressed_in' 
  | 'touches_service'
  | 'relates_to';

export interface TeamworkNode {
  id: string;
  type: EntityType;
  key: string;
  title: string;
  url?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface TeamworkEdge {
  source: string;
  target: string;
  relation: RelationType;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface TeamworkGraphData {
  rootKey: string;
  nodes: TeamworkNode[];
  edges: TeamworkEdge[];
  queriedAt: string;
}

export interface JiraIssueData {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: string;
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  issueType: string;
  projectKey: string;
  components: string[];
  assignee?: {
    accountId: string;
    displayName: string;
  };
  labels: string[];
  created: string;
  updated: string;
  linkedIssueKeys: string[];
}

export interface ConfluenceDocData {
  id: string;
  title: string;
  spaceKey: string;
  excerpt: string;
  docType: 'architecture_rfc' | 'requirements_spec' | 'incident_postmortem' | 'runbook';
  url: string;
  lastModified: string;
}

export interface BitbucketPrData {
  id: string;
  title: string;
  repository: string;
  branch: string;
  status: 'OPEN' | 'MERGED' | 'DECLINED';
  author: string;
  changedFiles: string[];
  url: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AffectedService {
  name: string;
  tier: 1 | 2 | 3;
  criticality: 'CORE' | 'SUPPORTING' | 'PERIPHERAL';
  reason: string;
}

export interface BlastRadiusResult {
  rootKey: string;
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  affectedServices: AffectedService[];
  transitiveIssueCount: number;
  openConflictingPrCount: number;
  historicalIncidentMatchCount: number;
  riskFactors: string[];
  mitigations: string[];
  calculatedAt: string;
}

export interface ContextDossier {
  issueKey: string;
  title: string;
  summary: string;
  blastRadius: BlastRadiusResult;
  connectedSpecs: ConfluenceDocData[];
  relatedPrs: BitbucketPrData[];
  keyStakeholders: string[];
  suggestedCheckpoints: string[];
  synthesizedAt: string;
  markdownSummary: string;
}

export interface CodeDiffProposal {
  issueKey: string;
  summary: string;
  affectedFiles: string[];
  proposedDiff: string;
  testStrategy: string[];
  verificationCriteria: string[];
}

// Rovo Action Types
export interface RovoActionInvocation {
  actionKey: string;
  parameters: Record<string, unknown>;
  context?: {
    issueId?: string;
    issueKey?: string;
    projectKey?: string;
  };
}

export interface RovoActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  markdown?: string;
}

// Model Context Protocol (MCP) Types
export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface McpToolCallRequest {
  jsonrpc: string;
  id?: string | number;
  method: string;
  params?: any;
}

export interface McpContentItem {
  type: 'text';
  text: string;
}

export interface McpToolCallResponse {
  jsonrpc: string;
  id?: string | number;
  result?: {
    content?: McpContentItem[];
    tools?: McpTool[];
    protocolVersion?: string;
    serverInfo?: Record<string, unknown>;
    capabilities?: Record<string, unknown>;
    isError?: boolean;
    [key: string]: any;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}
