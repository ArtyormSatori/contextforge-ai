/**
 * ContextForge AI - Forge Application Main Entry Point
 * Exports all handlers declared in manifest.yml
 */

import { RovoActionHandler } from './rovo/agentActions';
import { ContextForgeMcpServer } from './mcp/server';
import { panelResolver } from './resolvers/issuePanel';
import { handleIssueEvent } from './triggers/issueEvents';

const rovoHandler = new RovoActionHandler();
const mcpServer = new ContextForgeMcpServer();

/**
 * Handler for Atlassian Rovo Agent action extensions
 */
export async function actionHandler(payload: any): Promise<any> {
  console.log('[ContextForge] Invoked actionHandler:', JSON.stringify(payload));
  
  // Forge passes actionKey and action inputs/parameters
  const actionKey = payload.actionKey || payload.key || 'query-teamwork-context';
  const parameters = payload.parameters || payload.inputs || payload;

  const result = await rovoHandler.handleAction({
    actionKey,
    parameters,
    context: payload.context
  });

  return result;
}

/**
 * Handler for Jira Issue Panel Resolvers
 */
export { panelResolver };

/**
 * Handler for Jira Project Page Dashboard Resolvers
 */
export const projectPageResolver = panelResolver;

/**
 * Handler for Forge Webtrigger exposing Atlassian MCP JSON-RPC 2.0 over HTTP
 */
export async function mcpWebtriggerHandler(request: any): Promise<any> {
  console.log('[ContextForge] Webtrigger MCP Request received:', request.method);

  if (request.method !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Only POST method is supported for MCP JSON-RPC 2.0' }
      })
    };
  }

  let rpcBody: any;
  try {
    rpcBody = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  } catch (err: any) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32700, message: 'Parse error: Invalid JSON was received by the server' }
      })
    };
  }

  const rpcResponse = await mcpServer.handleRequest(rpcBody);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ['*'],
      'Access-Control-Allow-Methods': ['POST, OPTIONS'],
      'Access-Control-Allow-Headers': ['Content-Type, Authorization']
    },
    body: JSON.stringify(rpcResponse)
  };
}

/**
 * Handler for Jira background issue events
 */
export async function issueEventHandler(event: any): Promise<void> {
  await handleIssueEvent(event);
}
