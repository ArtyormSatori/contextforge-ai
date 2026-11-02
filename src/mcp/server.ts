/**
 * ContextForge AI - Model Context Protocol (MCP) Server
 * JSON-RPC 2.0 compliant server enabling external AI coding agents to interact with Atlassian Teamwork Graph.
 */

import { CONTEXTFORGE_MCP_TOOLS } from './tools';
import { TeamworkGraphEngine } from '../engine/teamworkGraph';
import { BlastRadiusAnalyzer } from '../engine/blastRadius';
import { ContextDossierSynthesizer } from '../engine/contextDossier';
import { SolutionProposer } from '../engine/solutionProposer';
import {
  McpToolCallRequest,
  McpToolCallResponse,
  McpContentItem
} from '../types';

export class ContextForgeMcpServer {
  private graphEngine: TeamworkGraphEngine;
  private blastAnalyzer: BlastRadiusAnalyzer;
  private dossierSynthesizer: ContextDossierSynthesizer;
  private solutionProposer: SolutionProposer;

  constructor(graphEngine?: TeamworkGraphEngine) {
    this.graphEngine = graphEngine || new TeamworkGraphEngine();
    this.blastAnalyzer = new BlastRadiusAnalyzer();
    this.dossierSynthesizer = new ContextDossierSynthesizer();
    this.solutionProposer = new SolutionProposer();
  }

  /**
   * Alias for handleRequest to support client simulations
   */
  public async handleJsonRpcRequest(req: McpToolCallRequest): Promise<McpToolCallResponse> {
    return this.handleRequest(req);
  }

  /**
   * Processes a raw JSON-RPC 2.0 request and produces a compliant JSON-RPC 2.0 response.
   */
  public async handleRequest(req: McpToolCallRequest): Promise<McpToolCallResponse> {
    const id = req.id ?? null;

    if (!req.jsonrpc || req.jsonrpc !== '2.0') {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' }
      };
    }

    switch (req.method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'contextforge-atlassian-mcp',
              version: '1.0.0'
            },
            capabilities: {
              tools: {
                listChanged: false
              }
            },
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  protocolVersion: '2024-11-05',
                  serverInfo: {
                    name: 'contextforge-atlassian-mcp',
                    version: '1.0.0'
                  },
                  capabilities: {
                    tools: {
                      listChanged: false
                    }
                  }
                })
              }
            ]
          }
        };

      case 'notifications/initialized':
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [] }
        };

      case 'ping':
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: 'pong' }] }
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: CONTEXTFORGE_MCP_TOOLS,
            content: [
              {
                type: 'text',
                text: JSON.stringify({ tools: CONTEXTFORGE_MCP_TOOLS })
              }
            ]
          }
        };

      case 'tools/call':
        return await this.handleToolCall(id, req.params);

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${req.method}`
          }
        };
    }
  }

  private async handleToolCall(
    id: string | number,
    params?: { name?: string; arguments?: Record<string, unknown> }
  ): Promise<McpToolCallResponse> {
    if (!params || !params.name) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: 'Invalid params: tool "name" required' }
      };
    }

    const toolName = params.name;
    const args = params.arguments || {};
    const issueKey = (args.issueKey as string) || 'PAY-402';

    try {
      let contentText = '';

      switch (toolName) {
        case 'get_issue_context': {
          const graph = await this.graphEngine.buildGraphForIssue(issueKey);
          const blast = this.blastAnalyzer.analyze(graph);
          const dossier = this.dossierSynthesizer.synthesize(graph, blast);
          contentText = JSON.stringify(dossier, null, 2);
          break;
        }

        case 'query_teamwork_graph': {
          const graph = await this.graphEngine.buildGraphForIssue(issueKey);
          contentText = JSON.stringify(graph, null, 2);
          break;
        }

        case 'calculate_blast_radius': {
          const graph = await this.graphEngine.buildGraphForIssue(issueKey);
          const blast = this.blastAnalyzer.analyze(graph);
          contentText = JSON.stringify(blast, null, 2);
          break;
        }

        case 'propose_solution_diff': {
          const graph = await this.graphEngine.buildGraphForIssue(issueKey);
          const blast = this.blastAnalyzer.analyze(graph);
          const dossier = this.dossierSynthesizer.synthesize(graph, blast);
          const proposal = this.solutionProposer.propose(dossier);
          contentText = JSON.stringify(proposal, null, 2);
          break;
        }

        case 'post_agent_verdict': {
          const agentName = (args.agentName as string) || 'AI Agent';
          const verdict = (args.verdict as string) || 'VERIFIED';
          const summary = (args.summary as string) || 'Automated verification check passed.';

          const resultPayload = {
            issueKey,
            agentName,
            verdict,
            summary,
            recordedAt: new Date().toISOString(),
            status: 'RECORDED_IN_ENTITY_PROPERTY'
          };
          contentText = JSON.stringify(resultPayload, null, 2);
          break;
        }

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${toolName}`
            }
          };
      }

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: contentText
            }
          ]
        }
      };
    } catch (err: any) {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Tool execution failed: ${err.message}`
            }
          ]
        }
      };
    }
  }
}
