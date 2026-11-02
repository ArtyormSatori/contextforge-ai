# ContextForge AI — Build with Context. Ship with Confidence.

[![Atlassian Forge](https://img.shields.io/badge/Atlassian-Forge%20CLI%2015.0-blue.svg)](https://developer.atlassian.com/platform/forge/)
[![Atlassian Rovo](https://img.shields.io/badge/Atlassian-Rovo%20Agent-purple.svg)](https://www.atlassian.com/software/rovo)
[![Model Context Protocol](https://img.shields.io/badge/MCP-2024--11--05-brightgreen.svg)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-20%2F20%20Passing-success.svg)](./tests)

**ContextForge AI** is an intelligent engineering copilot and context engine built natively on **Atlassian Forge** for **Codegeist 2026**.

It unifies **Atlassian Teamwork Graph**, an assignable **Atlassian Rovo Agent** (`@ContextForge`), and a native **Model Context Protocol (MCP)** server to empower software engineering teams to prevent production outages, map blast radius, and bridge enterprise knowledge directly into external AI coding tools like **Cursor**, **Claude Code**, and **Hermes**.

---

## 🎯 Target Categories & Prizes
- **Primary Category**: **Apps for Software Teams** ($15,000)
- **Special Bonus Track 1**: **Best Agents** ($1,500) — Atlassian Rovo Agent extension (`rovo:agent` + `action`)
- **Special Bonus Track 2**: **Best app with Atlassian MCP** ($1,500) — JSON-RPC 2.0 Webtrigger (`rovo:mcp` + `webtrigger`)
- **Special Bonus Track 3**: **Best apps with Teamwork Graph integration** ($1,500) — Multi-hop graph engine linking Jira, Confluence, Bitbucket, and Service Catalog

---

## 🚀 Key Features

1. **Teamwork Graph Context Engine**:
   - Synthesizes connected Jira issues, Confluence Architecture RFCs, Bitbucket PRs, incident post-mortems, and service dependencies into a unified associative graph.
2. **Blast Radius & Risk Assessment**:
   - Calculates risk scores (0–100) and risk tiers (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
   - Identifies Tier-1 core microservices at risk of cascading failure.
   - Recommends actionable safety guardrails (distributed locks, canary limits, circuit breakers).
3. **Assignable Atlassian Rovo Agent (`@ContextForge`)**:
   - Engineers can assign or chat with `@ContextForge` directly on Jira issues.
   - Invokes 3 Forge Action extensions: `query-teamwork-context`, `analyze-blast-radius`, and `propose-solution-diff`.
4. **Atlassian Model Context Protocol (MCP) Server**:
   - Exposes 5 production tools via standard JSON-RPC 2.0.
   - External IDE agents (`Claude Code`, `Cursor`, `Windsurf`) can query Jira context and submit automated verification verdicts.
5. **Interactive Jira Issue Panel**:
   - Modern Custom UI dashboard with an interactive Canvas-rendered knowledge graph, live blast radius gauge, and proposed code diff preview.

---

## 🛠️ Architecture & Tech Stack

```
                        ┌──────────────────────────────────────────────┐
                        │              ATLASSIAN CLOUD                 │
                        │                                              │
                        │  Jira Issues ── Confluence RFCs ── Bitbucket │
                        └──────────────────────┬───────────────────────┘
                                               │
                                 Atlassian Teamwork Graph
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │             CONTEXTFORGE AI                  │
                        │             (Atlassian Forge)                │
                        │                                              │
                        │  ┌─────────────────┐  ┌───────────────────┐  │
                        │  │  Graph Engine   │  │ Blast Radius Eval │  │
                        │  └────────┬────────┘  └─────────┬─────────┘  │
                        │           └──────────┬──────────┘            │
                        │                      ▼                       │
                        │  ┌────────────────────────────────────────┐  │
                        │  │       Context Dossier Synthesizer      │  │
                        │  └───────────────────┬────────────────────┘  │
                        └──────────────────────┼───────────────────────┘
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             ▼                                 ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│   Jira Issue Panel UI   │       │   Atlassian Rovo Agent  │       │  Atlassian MCP Server   │
│   (Custom UI / Canvas)  │       │      (@ContextForge)    │       │     (JSON-RPC 2.0)      │
└─────────────────────────┘       └─────────────────────────┘       └────────────┬────────────┘
                                                                                 │
                                                                                 ▼
                                                                    ┌─────────────────────────┐
                                                                    │   External AI Agents    │
                                                                    │ Cursor, Claude, Hermes  │
                                                                    └─────────────────────────┘
```

---

## 🧪 Testing & Verification

ContextForge AI includes a 100% hermetic test suite that runs without cloud credentials:

```bash
# Install dependencies
npm install

# Run TypeScript compilation and 20 automated tests
npm test

# Run interactive MCP Live Simulation
node dist/scripts/mcpCli.js demo

# Run Rovo Agent Action Simulation
node dist/scripts/simulate_rovo_agent.js

# Validate Atlassian Forge manifest against official schema
npm run validate:manifest
```

---

## 📦 Cloud Deployment (Atlassian Forge)

```bash
# Login to Atlassian Forge
forge login

# Register and deploy to development environment
forge deploy

# Install into your Atlassian Cloud Jira instance
forge install
```

---

## 📄 License
Apache-2.0 © 2026 ArtyormSatori <ghostvuong@gmail.com>
