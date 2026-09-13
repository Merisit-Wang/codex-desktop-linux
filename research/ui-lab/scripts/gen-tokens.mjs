#!/usr/bin/env node
// Resolve the upstream design-token CSS (lightningcss light/dark pattern +
// var() chains) into a plain tokens.css with concrete values per theme.
// Input:  ../upstream-ui/readable/css/*.css  (beautified upstream bundles)
// Output: src/tokens.css
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.resolve(here, "../../upstream-ui/readable/css");
const outFile = path.resolve(here, "../src/tokens.css");

// 1. Collect declarations from every :root-ish scope, in file order.
const decls = new Map(); // name -> raw value (later wins)
const blockRe = /([^{}]+)\{([^{}]*)\}/g;
for (const file of fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"))) {
  const css = fs.readFileSync(path.join(cssDir, file), "utf8");
  let m;
  while ((m = blockRe.exec(css))) {
    const selector = m[1].replace(/\s+/g, " ").trim();
    if (!selector.includes(":root")) continue;
    for (const d of m[2].matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
      decls.set(d[1], d[2].replace(/\s+/g, " ").trim());
    }
  }
}

// 2. Resolve per theme.
function resolveTheme(theme) {
  // lightningcss pattern, possibly nested:
  //   var(--lightningcss-light, L) var(--lightningcss-dark, D)
  // Replace the var matching the current theme with its fallback content,
  // drop the other. Balanced-paren scan handles nested var() fallbacks.
  const pick = (raw) => {
    let v = raw;
    for (let guard = 0; guard < 20; guard++) {
      const m = /var\(\s*--lightningcss-(light|dark)\s*,/.exec(v);
      if (!m) break;
      const start = m.index;
      const innerStart = start + m[0].length;
      let depth = 1;
      let i = v.indexOf("(", start);
      for (i = i + 1; i < v.length && depth > 0; i++) {
        if (v[i] === "(") depth++;
        else if (v[i] === ")") depth--;
      }
      const inner = v.slice(innerStart, i - 1).trim();
      const keep = m[1] === theme;
      v = v.slice(0, start) + (keep ? inner : "") + v.slice(i);
      v = v.replace(/\s{2,}/g, " ");
    }
    return v.trim();
  };
  const resolved = new Map();
  const raw = new Map([...decls].map(([k, v]) => [k, pick(v)]));
  const resolveVar = (name, depth) => {
    if (resolved.has(name)) return resolved.get(name);
    if (depth > 12 || !raw.has(name)) return undefined;
    let v = raw.get(name);
    v = v.replace(/var\((--[a-zA-Z0-9-]+)\s*(?:,\s*([^)]*))?\)/g, (_, ref, fb) => {
      const r = resolveVar(ref, depth + 1);
      return r !== undefined ? r : fb !== undefined ? fb.trim() : `var(${ref})`;
    });
    resolved.set(name, v);
    return v;
  };
  for (const name of raw.keys()) resolveVar(name, 0);
  return resolved;
}

const light = resolveTheme("light");
const dark = resolveTheme("dark");

// 3. Emit tokens that differ per theme or are commonly referenced.
const interesting = /^--(gray|blue|green|red|orange|yellow|purple|alpha|app-color|font|radius|shadow|text)-/;
const names = [...light.keys()].filter((n) => interesting.test(n)).sort();

const emit = (map) =>
  names.map((n) => `  ${n}: ${map.get(n)};`).join("\n");

const out = `/* Generated from upstream app css bundles — personal study only.
 * Concrete per-theme values resolved from the lightningcss light/dark
 * pattern and var() chains. ${names.length} tokens.
 */
:root {
${emit(light)}
}

[data-theme="dark"] {
${emit(dark)}
}
`;
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, out);
console.log(`tokens.css: ${names.length} tokens`);
const unresolved = names.filter((n) => light.get(n).includes("var(--"));
console.log(`unresolved refs kept as var(): ${unresolved.length}`);
if (unresolved.length) console.log(unresolved.slice(0, 10).join("\n"));
