#!/usr/bin/env node
// Validate every ```mermaid block of a Markdown file with the official Mermaid parser.
//
// Usage:  MERMAID_JS=/path/to/mermaid.min.js node scripts/validate-mermaid.mjs docs/AGILE_SRS.md
//
// MERMAID_JS defaults to ./node_modules/mermaid/dist/mermaid.min.js. The parser runs in
// headless Chromium (Playwright), because Mermaid needs a DOM. Exit code 1 on any error.
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const file = process.argv[2];
if (!file) {
  console.error("usage: validate-mermaid.mjs <markdown-file>");
  process.exit(2);
}
const mermaidJs = path.resolve(process.env.MERMAID_JS || "node_modules/mermaid/dist/mermaid.min.js");
if (!existsSync(mermaidJs)) {
  console.error(`mermaid bundle not found: ${mermaidJs} (set MERMAID_JS)`);
  process.exit(2);
}

const text = readFileSync(file, "utf8");
const blocks = [];
const pattern = /```mermaid\n([\s\S]*?)\n```/g;
for (let m; (m = pattern.exec(text)); ) {
  blocks.push({ line: text.slice(0, m.index).split("\n").length, code: m[1] });
}

const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<html><body></body></html>");
await page.addScriptTag({ path: mermaidJs });
await page.evaluate(() => window.mermaid.initialize({ startOnLoad: false }));

let failed = 0;
for (const [i, block] of blocks.entries()) {
  const error = await page.evaluate(async (code) => {
    try {
      await window.mermaid.parse(code);
      return null;
    } catch (e) {
      return String(e && e.message ? e.message : e);
    }
  }, block.code);
  if (error) {
    failed += 1;
    console.error(`[FAIL] block ${i + 1} (line ${block.line}): ${error.split("\n").slice(0, 4).join(" | ")}`);
  }
}
await browser.close();
console.log(`${blocks.length - failed}/${blocks.length} mermaid blocks valid`);
process.exit(failed ? 1 : 0);
