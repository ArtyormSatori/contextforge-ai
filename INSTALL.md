# Installation & Testing Guide: ContextForge AI

This document provides step-by-step instructions for judges, evaluators, and developers to install, verify, and run **ContextForge AI** on Atlassian Cloud.

---

## Part 1: Automated Verification (Local Machine)

You can verify the entire test suite and simulate Rovo Agent and MCP interactions on any machine with Node.js 20+ installed.

### 1. Clone & Install
```bash
git clone https://github.com/ArtyormSatori/codegeist-2026-contextforge.git
cd codegeist-2026-contextforge
npm install
```

### 2. Run Comprehensive Verification
```bash
npm run verify
```
This builds TypeScript sources with `tsc` and executes all 20 hermetic tests across:
- **Manifest validation**: Strict Ajv validation against the official `@forge/manifest` JSON schema.
- **Teamwork Graph Engine**: Node and edge generation, associative linking across Jira, Confluence, and Bitbucket.
- **Blast Radius Analyzer**: Risk scoring (0–100), tier classification (Tier 1 Core, Tier 2 Supporting, Tier 3 Peripheral), and mitigation heuristics.
- **Context Dossier Synthesizer**: Markdown synthesis, stakeholder discovery, and verification checkpoints.
- **Solution Proposer**: Confluence RFC compliant unified diff and hermetic test matrix generation.
- **Rovo Agent Actions**: Dispatching and handling of `query-teamwork-context`, `analyze-blast-radius`, and `propose-solution-diff`.
- **Model Context Protocol (MCP)**: JSON-RPC 2.0 handshake, tool discovery, and tool execution.
- **Forge Resolvers & Webtrigger**: Jira issue panel bridges and HTTP webtrigger handlers.

### 3. Run Live Simulations
```bash
# Simulate external coding agent (Claude Code / Cursor) using MCP tools
npx tsx scripts/simulate_mcp_client.ts

# Simulate Atlassian Rovo Agent conversational actions
npx tsx scripts/simulate_rovo_agent.ts
```

---

## Part 2: Deploying to Atlassian Cloud

To install ContextForge AI into a live Atlassian Cloud Developer tenant (Jira Software + Confluence):

### Prerequisites
1. An Atlassian Cloud site with developer access (free at [developer.atlassian.com/cloud/](https://developer.atlassian.com/cloud/)).
2. Node.js 22.x or later.
3. Atlassian Forge CLI:
   ```bash
   npm install -g @forge/cli
   ```

### Step 1: Forge Login
```bash
forge login
```
Follow the prompt to enter your Atlassian account email and API token (generate one at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)).

### Step 2: Register Application
If you want to register a distinct instance of ContextForge AI on your own Atlassian developer tenant:
```bash
forge register --name "ContextForge AI"
```
This will automatically generate a fresh App ARI in `manifest.yml`.

### Step 3: Deploy to Cloud
```bash
forge deploy
```
Forge will bundle the TypeScript code, validate the manifest schema, and deploy the serverless functions to Atlassian Cloud.

### Step 4: Install to Jira Tenant
```bash
forge install
```
Select `Jira` and choose your Atlassian site domain (e.g. `your-tenant.atlassian.net`). Forge will request the required permissions declared in `manifest.yml`:
- `read:jira-work`
- `write:jira-work`
- `read:confluence-content.all`
- `storage:app`

---

## Part 3: Using the App

### 1. Jira Issue Panel View
1. Open any issue in your Jira site (or create one titled `PAY-402: Stripe webhook retry storm causing payment deadlocks`).
2. Look at the issue details sidebar or glances: click **ContextForge Intelligence**.
3. View the real-time Risk Gauge (Score 100 / Critical), affected microservices by Tier, connected Confluence RFCs, and suggested mitigations.

### 2. Atlassian Rovo Agent
1. Open Atlassian Rovo Chat or Jira issue comments.
2. Direct message or mention `@ContextForge AI`:
   - *"Analyze the blast radius of this Jira ticket"*
   - *"Find related Confluence specs and Bitbucket PRs"*
   - *"Propose code diff and test verification plan"*
3. ContextForge will execute the corresponding Forge action and reply with the complete technical dossier.

### 3. Model Context Protocol (MCP) Integration
1. Run `forge webtrigger` to retrieve the live URL of `mcp-jsonrpc-endpoint`.
2. Configure your external AI coding agent (e.g. Claude Code or Cursor) to point to the URL:
   ```json
   {
     "mcpServers": {
       "contextforge": {
         "url": "<YOUR_FORGE_WEBTRIGGER_URL>",
         "transport": "http"
       }
     }
   }
   ```
3. Your local coding agent can now query `get_issue_context` and `calculate_blast_radius` directly from inside the terminal or editor.
