# ContextForge AI — Video Demo Script

**Target Duration**: 2 minutes 45 seconds (Strictly under 3 minutes per Codegeist 2026 guidelines)  
**Format**: Screen capture walkthrough + professional technical voiceover + UI callouts  
**Target Category**: Apps for Software Teams (Codegeist 2026)  
**Target Bonuses**: Best Agents (Rovo), Best app with Atlassian MCP, Best apps with Teamwork Graph

---

## Scene Breakdown & Directions

### Scene 1: The Context Crisis (0:00 – 0:30)
- **Visual**:
  - Open Jira board showing issue `PAY-402: Stripe webhook retry storm causing payment deadlocks in Checkout v2`.
  - Zoom into the ticket description: minimal text, no architectural links.
  - Quick browser tab switching to an isolated Confluence space with RFC-44, an old post-mortem INC-8821, and a Bitbucket PR with active merge conflicts.
- **Voiceover**:
  > "Every software developer knows this feeling: you pick up an urgent production bug like PAY-402—a webhook retry storm causing payment deadlocks.
  > But what architecture spec governs this? Has this happened before? What other pull requests are touching the payment state machine right now?
  > In fast-moving teams, this critical context is fragmented across Jira, Confluence, and Bitbucket. Developers either spend hours digging, or ship fixes that cause catastrophic regression cascades."

---

### Scene 2: Introducing ContextForge AI & Teamwork Graph (0:30 – 1:05)
- **Visual**:
  - On the right-hand panel of Jira issue PAY-402, click on **ContextForge Intelligence**.
  - Show the dynamic panel loading:
    - **Risk Gauge**: 100/100 `CRITICAL` risk badge.
    - **Affected Service Tiers**: Tier-1 Core (`payment-gateway`, `order-state-machine`, `database-cluster`), Tier-2 Supporting (`redis-cache`).
    - **Connected Confluence Specs**: `RFC-44: Distributed Idempotency` and `Post-Mortem: Incident INC-8821`.
    - **Active Pull Requests**: `pr-551: fix(payment): implement redis distributed lock`.
- **Voiceover**:
  > "Meet ContextForge AI—built natively on Atlassian Forge to unite your software engineering lifecycle.
  > Powered by Atlassian's Teamwork Graph, ContextForge traverses the multi-hop relationships between your Jira tickets, Confluence RFCs, and Bitbucket repositories.
  > In milliseconds, it computes an objective Blast Radius score—flagging that PAY-402 touches Tier-1 payment microservices, correlates directly with an outage from last month, and has active pull request collisions."

---

### Scene 3: The Assignable Atlassian Rovo Agent in Action (1:05 – 1:45)
- **Visual**:
  - Switch to Atlassian Rovo Chat interface or comment section.
  - Mention `@ContextForge AI: Analyze the blast radius and propose a verified fix`.
  - Show ContextForge Rovo Agent executing actions (`query-teamwork-context`, `analyze-blast-radius`, `propose-solution-diff`).
  - Rovo Agent responds with a clean Markdown dossier:
    - Summarizing RFC-44 architectural constraints.
    - Providing a unified Git diff using Redis distributed locking with fallback TTL.
    - Providing a hermetic test plan covering 500 concurrent webhooks and chaos network drops.
- **Voiceover**:
  > "ContextForge AI is an assignable Rovo Agent. You can assign tickets directly to ContextForge, or chat with it inside Jira.
  > Watch as it invokes specialized Forge actions: querying the Teamwork Graph, calculating blast radius, and synthesizing a solution proposal.
  > It doesn't just guess code—it enforces the exact architectural rules defined in Confluence RFC-44, referencing past post-mortems to ensure history never repeats itself."

---

### Scene 4: Supercharging IDE Coding Agents via Atlassian MCP (1:45 – 2:25)
- **Visual**:
  - Split screen: Terminal running Claude Code / Cursor on the left; Jira issue on the right.
  - Run terminal command connecting to ContextForge MCP endpoint:
    `npx tsx scripts/simulate_mcp_client.ts`
  - Show Claude Code discovering 5 MCP tools: `get_issue_context`, `query_teamwork_graph`, `calculate_blast_radius`, `propose_solution_diff`, `post_agent_verdict`.
  - Claude Code executes the tools, retrieves the full Atlassian context, writes the fix, and posts an `APPROVED_WITH_CAUTION` verdict back into Jira issue properties.
- **Voiceover**:
  > "Modern software engineering happens in IDEs and AI coding tools like Claude Code and Cursor.
  > ContextForge AI bridges this world through the Atlassian Model Context Protocol.
  > Over a compliant JSON-RPC 2.0 interface, external coding agents discover live Teamwork Graph tools, retrieve deep issue context without leaving the editor, and submit automated verification verdicts right back to Jira."

---

### Scene 5: Shipping with Confidence & Conclusion (2:25 – 2:45)
- **Visual**:
  - Show the Jira issue updated with verified status, passing test checks, and zero regressions.
  - Display the project architecture summary and GitHub repository.
  - Final splash screen with ContextForge AI logo, Atlassian Forge badge, and Codegeist 2026 slogan.
- **Voiceover**:
  > "By uniting the Teamwork Graph, assignable Rovo Agents, and the Model Context Protocol, ContextForge AI turns fragmented data into collective intelligence.
  > Build with context. Ship with confidence.
  > Thank you!"

---

## Voiceover Generation Scripts

All voiceover scripts have been prepared and tested. Voice clips can be generated via high-fidelity neural TTS engines using `text_to_speech` tool or directly rendered alongside screen recordings for the final YouTube submission.
