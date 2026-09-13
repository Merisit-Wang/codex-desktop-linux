#!/usr/bin/env node
// CDP helper: evaluate an expression (read from file) in the running app.
// Usage: node cdp.mjs <expr-file> [ws-url]
import fs from "node:fs";

const expr = fs.readFileSync(process.argv[2], "utf8");
const wsUrl = process.argv[3] || process.env.CDP_WS;
if (!wsUrl) { console.error("no ws url"); process.exit(1); }

const ws = new WebSocket(wsUrl);
let id = 0;
const send = (m, p) => new Promise((res, rej) => {
  const mid = ++id;
  const h = (ev) => {
    const d = JSON.parse(ev.data);
    if (d.id === mid) { ws.removeEventListener("message", h); res(d.result); }
  };
  ws.addEventListener("message", h);
  ws.send(JSON.stringify({ id: mid, method: m, params: p }));
});
ws.onopen = async () => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  console.log(r?.result?.value ?? JSON.stringify(r).slice(0, 1000));
  ws.close();
  process.exit(0);
};
setTimeout(() => { console.error("timeout"); process.exit(1); }, 20000);
