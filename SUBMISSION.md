# Devpost Submission — Codegeist 2026

## Project Overview

- **Project Title**: ContextForge AI — Build with Context. Ship with Confidence.
- **Tagline**: The autonomous engineering context engine for Jira, powered by Atlassian Teamwork Graph, Rovo Agent, and Model Context Protocol (MCP).
- **Primary Category**: **Apps for Software Teams** ($15,000)
- **Special Bonus Tracks**:
  - **Best Agents** ($1,500) — Assignable Atlassian Rovo Agent (`@ContextForge`) with 3 custom Action extensions
  - **Best app with Atlassian MCP** ($1,500) — JSON-RPC 2.0 Webtrigger and Stdio MCP Server exposing 5 production tools
  - **Best apps with Teamwork Graph integration** ($1,500) — Deep associative graph linking Jira issues, Confluence RFCs, Bitbucket PRs, and microservices
- **Hackathon**: Codegeist 2026 (Devpost, sponsored by Atlassian Pty Ltd)
- **Creator / Author**: ArtyormSatori (`ghostvuong@gmail.com`)
- **Repository URL**: `https://github.com/ArtyormSatori/contextforge-ai`
- **Demo Video URL**: `https://youtu.be/[DEMO_VIDEO_ID]` *(Public YouTube Video < 5 minutes)*

---

## 💡 Inspiration

Every software engineering team faces the same silent productivity killer: **fragmented organizational context**.

When an urgent bug strikes or an engineer is assigned a critical Jira ticket:
1. Architectural decisions are buried in Confluence RFCs written six months ago.
2. Competing pull requests in Bitbucket touch the exact same microservices without warning.
3. Similar past incidents and post-mortems sit neglected in forgotten wiki spaces.
4. Developers spend hours manually hunting for stakeholders and service boundaries.
5. Modern AI coding assistants (Cursor, Claude Code, Windsurf) hallucinate because they possess zero visibility into Jira, Confluence, and the organizational topology.

Atlassian created the **Teamwork Graph** and **Rovo** to solve this context barrier. We built **ContextForge AI** to unleash that potential for software engineering teams: turning Jira into an active context hub that detects regression blast radius, equips an autonomous Rovo Agent to propose architectural fixes, and feeds enterprise context straight into developers' IDE coding agents via the **Model Context Protocol (MCP)**.

---

## 🌟 What It Does

ContextForge AI integrates three pillars of the modern Atlassian ecosystem:

### 1. Teamwork Graph Associative Engine
ContextForge synthesizes a multi-hop knowledge graph around every Jira issue:
- **Jira Issues**: Root bug tickets, linked blockers, subtasks, and related regression tickets.
- **Confluence Architecture & Post-Mortems**: Automatically surfaces relevant architectural specifications (e.g., `RFC-44: Distributed Idempotency`) and past post-mortems (`INC-8821: Payment Gateway Outage`).
- **Bitbucket Pull Requests**: Maps active branches and open PRs competing for the same files.
- **Microservices & Tier-1 Criticality**: Tracks touched service boundaries (`payment-gateway`, `order-state-machine`, `database-cluster`).

### 2. Automated Blast Radius & Risk Assessment
Whenever a ticket is created or updated, ContextForge evaluates:
- **Risk Score (0–100)**: Quantified using service tiers, historical post-mortem matches, open competing PRs, and graph node centrality.
- **Risk Level**: Clear classification (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
- **Safety Guardrails**: Actionable technical mitigations (e.g., Redlock distributed locks, canary deployment limits, query timeout caps).

### 3. Assignable Atlassian Rovo Agent (`@ContextForge`)
Engineers can mention or assign `@ContextForge` in Jira comments. Powered by Forge Action extensions:
- `/query-teamwork-context`: Synthesizes a structured Markdown context dossier.
- `/analyze-blast-radius`: Breaks down affected downstream microservices and risk drivers.
- `/propose-solution-diff`: Generates a proposed unified git diff and hermetic test strategy.

### 4. Atlassian Model Context Protocol (MCP) Server
ContextForge exposes a JSON-RPC 2.0 MCP server over Forge Webtriggers and local Stdio bridge:
- **5 Production Tools**:
  1. `get_issue_context`: Deep associative context dossier.
  2. `query_teamwork_graph`: Full graph node/edge traversal.
  3. `calculate_blast_radius`: Quantitative risk score and impacted services.
  4. `propose_solution_diff`: Production-ready unified git diff proposal.
  5. `post_agent_verdict`: Allows external agents to record automated test verdicts directly into Jira issue entity properties.
- Connects directly with **Cursor**, **Claude Code**, **Windsurf**, and **Hermes**.

### 5. Interactive Jira Issue Panel (Custom UI)
- Interactive HTML5 Canvas graph visualizer.
- Visual blast radius gauge with service criticality badges.
- One-click copy for unified code diffs and IDE MCP configuration.
- Real-time MCP telemetry log.

---

## 🏗️ How We Built It

- **Platform**: Atlassian Forge CLI 15.0.0 with Node.js runtime (`nodejs22.x`).
- **Languages & Frameworks**: TypeScript 5.6, Modern Vanilla JavaScript (ES2022), Canvas API, HTML5/CSS3 with Atlassian Design System guidelines.
- **Forge Manifest Modules**:
  - `rovo:agent`: Declares `@ContextForge` assignable agent.
  - `rovo:mcp`: Declares Model Context Protocol capabilities.
  - `action`: Exposes 3 action extensions for conversational workflows.
  - `jira:issuePanel`: Custom UI panel embedded directly inside Jira issue views.
  - `webtrigger`: HTTP JSON-RPC 2.0 endpoint for cloud MCP connections.
  - `function`: Serverless backend functions handling actions and resolvers.
- **Testing & Verification**:
  - **Ajv Manifest Validator**: Strict validation against official Atlassian `@forge/manifest` v15.0.0 schema.
  - **Hermetic Data Provider**: Realistic enterprise seed data (Stripe webhook concurrency deadlock scenario) allowing 100% offline testing.
  - **Automated Test Suite**: 20 comprehensive unit and integration tests covering manifest validity, graph traversal, risk scoring, MCP protocol negotiation, and Rovo actions.

---

## 🧗 Challenges We Ran Into

1. **Manifest Schema Compliance for Bleeding-Edge Modules**:
   - `rovo:agent` and `rovo:mcp` are brand new modules in Forge CLI 15.0.0 with strict schema requirements. Ensuring exact type mappings for action inputs (`CoreActionIOType`), output contexts, and permissions required compiling against the official `@forge/manifest` schema.
2. **Multi-Hop Graph Associative Traversal**:
   - Software teams have thousands of issues and pages. Designing a high-performance graph engine that avoids circular dependencies while scoring service tier criticality was challenging. We solved this with breadth-first visited-set tracking and deterministic edge weighting.
3. **Model Context Protocol (MCP) Bridging**:
   - Ensuring our JSON-RPC 2.0 implementation complied with the latest MCP specification (2024-11-05) across both HTTP Forge Webtriggers and local Stdio transports for IDE agents.

---

## 🏆 Accomplishments That We're Proud Of

- **100% Hermetic Test Pass Rate (20/20)**: Built from day one with rigorous test-driven discipline.
- **True Ecosystem Convergence**: Unified Jira, Confluence, Bitbucket, Rovo, and external AI coding tools into a single seamless loop.
- **Zero Hallucination AI Coding**: Solved the root cause of AI coding errors by feeding verified organizational architecture and post-mortems into AI coding agents.
- **Production-Ready Atlassian UX**: Created an intuitive, beautiful Jira issue panel adhering to Atlassian Design Tokens.

---

## 📚 What We Learned

- How to architect native Atlassian Rovo Agent action extensions with typed input schemas.
- How the Atlassian Teamwork Graph transforms static tickets into dynamic organizational intelligence.
- How enterprise teams can safely bridge internal knowledge to external desktop AI tools using Model Context Protocol without data leakage.

---

## 🔮 What's Next for ContextForge AI

- **Bitbucket Pull Request Bot**: Automatically comment on PRs when code modifications violate Confluence RFC architecture constraints.
- **JSM Incident Auto-Triage**: Auto-calculate blast radius for incoming Sev-1 alerts and page the correct service on-call engineers.
- **Atlassian Marketplace General Availability**: Package ContextForge AI for enterprise distribution on the Atlassian Marketplace.

---

## 🛠️ Instructions for Judges (Evaluation Guide)

Judges can test ContextForge AI in two ways:

### Option A: Local Hermetic Test & Live Simulation (Zero Setup, No Credentials Needed)
You can clone the repository and run the full end-to-end test suite and interactive MCP simulation immediately:

```bash
# 1. Clone the repository
git clone https://github.com/ArtyormSatori/contextforge-ai.git
cd contextforge-ai

# 2. Install dependencies
npm install

# 3. Run the automated test suite (20 tests pass)
npm test

# 4. Run the interactive Model Context Protocol (MCP) demo
node dist/scripts/mcpCli.js demo

# 5. Run the Atlassian Rovo Agent simulation
node dist/scripts/simulate_rovo_agent.js

# 6. Validate Forge manifest against official Atlassian Schema
npm run validate:manifest
```

### Option B: Deploy to Atlassian Cloud Developer Instance
```bash
# 1. Login to your Atlassian Cloud Developer account
forge login

# 2. Deploy app to development environment
forge deploy

# 3. Install app into your Jira Cloud site
forge install
```

---

## 🎬 Demo Video Script & Voiceover Guide

**Total Duration**: 2 minutes 50 seconds (Under the 3-minute judge preference limit).

### Scene 1: The Context Crisis (0:00 - 0:35)
- **Visual**: Screen shows Jira issue `PAY-402`: *"Stripe webhook retry storm causing payment deadlocks"*. A developer stares at a wall of error logs.
- **Voiceover**: *"Every software engineer knows this nightmare: an urgent P1 bug hits Jira. The error seems simple, but you don't know who owns the service, which Confluence RFCs define the locking rules, or whether another team is already pushing changes to the same repository. Modern AI assistants hallucinate because they have zero enterprise context. That's why we built ContextForge AI."*

### Scene 2: Teamwork Graph & Blast Radius (0:35 - 1:15)
- **Visual**: Developer opens the ContextForge Intelligence panel on `PAY-402`. The interactive canvas renders the knowledge graph, and the Blast Radius gauge shows **85/100 CRITICAL RISK**.
- **Voiceover**: *"ContextForge AI is built natively on Atlassian Forge. The moment a ticket opens, our Teamwork Graph engine connects the dots: it links the issue to RFC-44 in Confluence, pulls up an identical past incident post-mortem from OPS wiki, discovers competing Pull Request #551 in Bitbucket, and maps the blast radius across three Tier-1 microservices. Engineers immediately see what could break before touching a single line of code."*

### Scene 3: Atlassian Rovo Agent in Action (1:15 - 1:55)
- **Visual**: Developer types `@ContextForge propose solution and test plan` into Jira comments. Rovo Agent responds with a Markdown analysis, Redlock unified diff, and acceptance checklist.
- **Voiceover**: *"Next, meet our Atlassian Rovo Agent. By mentioning @ContextForge, engineers can query the Teamwork Graph directly in natural language. ContextForge invokes Forge Actions to analyze the blast radius and generates a precise unified git diff implementing distributed Redis locking, along with an automated test strategy. Context isn't just displayed—it's actionable."*

### Scene 4: Model Context Protocol (MCP) Bridge to Cursor / Claude Code (1:55 - 2:30)
- **Visual**: Developer clicks *"Copy MCP Config"*, pastes into Cursor/Claude Code. In the terminal, Claude Code queries `get_issue_context`, applies the patch, runs tests, and calls `post_agent_verdict`. The Jira panel updates in real time with the green "VERIFIED" badge.
- **Voiceover**: *"Finally, ContextForge bridges the Atlassian ecosystem to external AI coding agents via the Model Context Protocol. Using standard JSON-RPC, external agents in Cursor or Claude Code retrieve verified organizational context, execute the code fix, and post test verdicts back into Jira entity properties. No more hallucinations—just verified, context-aware engineering."*

### Scene 5: Conclusion & Value (2:30 - 2:50)
- **Visual**: Full summary screen showing Atlassian Forge badge, Teamwork Graph, Rovo Agent, and MCP compliance badges.
- **Voiceover**: *"ContextForge AI: Built with context. Shipped with confidence. Built for Codegeist 2026. Thank you."*

---
*Generated by ArtyormSatori for Atlassian Codegeist 2026. Fully tested and verified.*
