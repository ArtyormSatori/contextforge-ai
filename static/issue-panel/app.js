/**
 * ContextForge AI - Issue Panel Interactive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[ContextForge] Issue Panel loaded.');

  // Render Teamwork Graph Canvas
  const canvas = document.getElementById('graphCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    drawGraph(ctx, canvas.width, canvas.height);
  }

  // Copy Diff button
  const copyDiffBtn = document.getElementById('btn-copy-diff');
  if (copyDiffBtn) {
    copyDiffBtn.addEventListener('click', () => {
      const diffCode = document.getElementById('diffCode').innerText;
      navigator.clipboard.writeText(diffCode).then(() => {
        const orig = copyDiffBtn.innerText;
        copyDiffBtn.innerText = 'Copied to Clipboard!';
        setTimeout(() => copyDiffBtn.innerText = orig, 2000);
      });
    });
  }

  // Copy MCP Config button
  const copyMcpBtn = document.getElementById('btn-copy-mcp');
  if (copyMcpBtn) {
    copyMcpBtn.addEventListener('click', () => {
      const mcpConfig = {
        mcpServers: {
          "contextforge-atlassian": {
            command: "node",
            args: ["/home/adminis/hackathon-builds/codegeist-2026/dist/scripts/mcpCli.js", "stdio"],
            env: {}
          }
        }
      };
      navigator.clipboard.writeText(JSON.stringify(mcpConfig, null, 2)).then(() => {
        const orig = copyMcpBtn.innerText;
        copyMcpBtn.innerText = 'MCP Config Copied!';
        setTimeout(() => copyMcpBtn.innerText = orig, 2000);
      });
    });
  }

  // Refresh Graph button
  const refreshGraphBtn = document.getElementById('btn-refresh-graph');
  if (refreshGraphBtn && canvas) {
    refreshGraphBtn.addEventListener('click', () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGraph(ctx, canvas.width, canvas.height);
    });
  }
});

function drawGraph(ctx, width, height) {
  const nodes = [
    { id: 'PAY-402', label: 'PAY-402', type: 'jira', x: width * 0.5, y: height * 0.5, r: 20 },
    { id: 'RFC-44', label: 'RFC-44 (Idempotency)', type: 'confluence', x: width * 0.22, y: height * 0.28, r: 16 },
    { id: 'INC-8821', label: 'INC-8821 (Post-Mortem)', type: 'confluence', x: width * 0.24, y: height * 0.72, r: 16 },
    { id: 'PR-551', label: 'PR #551 (Fix)', type: 'bitbucket', x: width * 0.78, y: height * 0.3, r: 16 },
    { id: 'PR-542', label: 'PR #542 (Checkout)', type: 'bitbucket', x: width * 0.78, y: height * 0.7, r: 16 },
    { id: 'SVC-1', label: 'payment-gateway', type: 'service', x: width * 0.5, y: height * 0.16, r: 15 },
    { id: 'SVC-2', label: 'order-state-machine', type: 'service', x: width * 0.5, y: height * 0.86, r: 15 }
  ];

  const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 0, to: 5 },
    { from: 0, to: 6 },
    { from: 3, to: 5 },
    { from: 4, to: 6 }
  ];

  // Draw Edges
  ctx.lineWidth = 1.5;
  edges.forEach(e => {
    const src = nodes[e.from];
    const tgt = nodes[e.to];
    ctx.strokeStyle = '#dfe1e6';
    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(tgt.x, tgt.y);
    ctx.stroke();
  });

  // Draw Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);

    if (n.type === 'jira') ctx.fillStyle = '#0052cc';
    else if (n.type === 'confluence') ctx.fillStyle = '#00b8d9';
    else if (n.type === 'bitbucket') ctx.fillStyle = '#6554c0';
    else if (n.type === 'service') ctx.fillStyle = '#de350b';

    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Node labels
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#172b4d';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + n.r + 13);
  });
}
