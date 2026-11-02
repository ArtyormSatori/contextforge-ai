/**
 * ContextForge AI - Atlassian MCP Tool Definitions
 * Defines the tools exposed via Model Context Protocol to AI coding agents (Claude, Cursor, Windsurf, Hermes).
 */

import { McpTool } from '../types';

export const CONTEXTFORGE_MCP_TOOLS: McpTool[] = [
  {
    name: 'get_issue_context',
    description: 'Retrieves full associative Teamwork Graph context for a Jira issue including linked Confluence specs, Bitbucket PRs, and team owners.',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'The Jira issue key, e.g., "PAY-402" or "PROJ-101".'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'query_teamwork_graph',
    description: 'Executes an associative graph query returning all connected nodes and typed edges across the Atlassian ecosystem.',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'The root Jira issue key to center the graph traversal on.'
        },
        maxDepth: {
          type: 'integer',
          description: 'Maximum traversal depth for transitive relationships (default 2).'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'calculate_blast_radius',
    description: 'Evaluates risk score (0-100), affected microservices, and potential regression risks for a planned change.',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'The Jira issue key to analyze.'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'propose_solution_diff',
    description: 'Generates an architectural unified code diff proposal and comprehensive test verification plan.',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'The Jira issue key requiring a solution proposal.'
        }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'post_agent_verdict',
    description: 'Records an external coding agent verification verdict or test execution report back into Jira issue properties.',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'The Jira issue key.'
        },
        agentName: {
          type: 'string',
          description: 'Name of the calling AI agent (e.g., "Claude Code", "Hermes Agent", "Cursor").'
        },
        verdict: {
          type: 'string',
          description: 'Verification verdict: "VERIFIED", "NEEDS_WORK", or "BLOCKED".'
        },
        summary: {
          type: 'string',
          description: 'Detailed summary of automated checks performed.'
        }
      },
      required: ['issueKey', 'agentName', 'verdict', 'summary']
    }
  }
];
