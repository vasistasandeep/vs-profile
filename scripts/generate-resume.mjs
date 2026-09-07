// scripts/generate-resume.mjs
//
// Build-time resume generator. Renders scripts/resume.data.mjs into a clean,
// ATS-friendly, print-optimized HTML document and prints it to
// public/Vasista_Sandeep_Resume.pdf via Puppeteer (headless Chrome).
//
// Usage:  npm run generate:resume
//
// This is a dev/build tool only — Puppeteer is a devDependency and is never
// shipped to the browser bundle. A light layout with emerald accents is used
// intentionally: it prints legibly, saves ink, and parses cleanly in ATS
// systems (dark full-bleed backgrounds are an anti-pattern for resume PDFs).

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, statSync } from "node:fs";

import { resume } from "./resume.data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "..", "public", "Vasista_Sandeep_Resume.pdf");

/** Minimal HTML-escape for text interpolated into the template. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderBullets(bullets) {
  return bullets
    .map(
      (b) =>
        `<li><span class="lead">${esc(b.lead)}</span> ${esc(b.text)}</li>`,
    )
    .join("\n");
}

function renderExperience(experience) {
  return experience
    .map((job) => {
      const metaRight = esc(job.dates || "");
      const roleLine = job.role ? `<div class="role">${esc(job.role)}</div>` : "";
      return `
        <div class="job">
          <div class="job-head">
            <div class="company">${esc(job.company)}</div>
            <div class="dates">${metaRight}</div>
          </div>
          ${roleLine}
          <ul class="bullets">${renderBullets(job.bullets)}</ul>
        </div>`;
    })
    .join("\n");
}

function buildHtml(r) {
  const competencies = r.competencies
    .map(
      (c) =>
        `<div class="comp-row"><span class="comp-label">${esc(
          c.label,
        )}:</span> ${esc(c.items)}</div>`,
    )
    .join("\n");

  const credentials = r.credentials
    .map((c) => `<li>${esc(c)}</li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 14mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Segoe UI", Inter, Arial, sans-serif;
    color: #0f172a;
    font-size: 10.2px;
    line-height: 1.42;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .name { font-size: 22px; font-weight: 700; letter-spacing: -0.2px; color: #0a0f1a; }
  .title { font-size: 11.5px; font-weight: 600; color: #047857; margin-top: 2px; }
  .contact { font-size: 9.6px; color: #475569; margin-top: 6px; }
  .contact a { color: #475569; text-decoration: none; }
  .contact .sep { color: #cbd5e1; padding: 0 6px; }
  .rule { height: 2px; background: linear-gradient(90deg,#10b981,#22d3ee); border: 0; margin: 10px 0 12px; }
  .section { margin-top: 12px; }
  .section-title {
    font-size: 10px; font-weight: 700; letter-spacing: 1.4px;
    text-transform: uppercase; color: #0a0f1a;
    border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 7px;
  }
  .summary { color: #1e293b; }
  .comp-row { margin-bottom: 4px; }
  .comp-label { font-weight: 700; color: #0a0f1a; }
  .job { margin-bottom: 10px; }
  .job-head { display: flex; justify-content: space-between; align-items: baseline; }
  .company { font-size: 11.5px; font-weight: 700; color: #0a0f1a; }
  .dates { font-size: 9.4px; color: #64748b; white-space: nowrap; }
  .role { font-size: 10.4px; font-weight: 600; color: #047857; margin: 1px 0 4px; }
  ul.bullets { margin: 4px 0 0; padding-left: 15px; }
  ul.bullets li { margin-bottom: 4px; }
  .lead { font-weight: 700; color: #0a0f1a; }
  ul.creds { margin: 0; padding-left: 15px; columns: 2; column-gap: 22px; }
  ul.creds li { margin-bottom: 3px; break-inside: avoid; }
</style>
</head>
<body>
  <header>
    <div class="name">${esc(r.name)}</div>
    <div class="title">${esc(r.title)}</div>
    <div class="contact">
      ${esc(r.location)}
      <span class="sep">|</span>
      <a href="mailto:${esc(r.email)}">${esc(r.email)}</a>
      <span class="sep">|</span>
      <a href="${esc(r.linkedInUrl)}">${esc(r.linkedIn)}</a>
      <span class="sep">|</span>
      <a href="${esc(r.websiteUrl)}">${esc(r.website)}</a>
    </div>
  </header>
  <hr class="rule" />

  <section class="section">
    <div class="section-title">Executive Summary</div>
    <div class="summary">${esc(r.summary)}</div>
  </section>

  <section class="section">
    <div class="section-title">Core Competencies</div>
    ${competencies}
  </section>

  <section class="section">
    <div class="section-title">Professional Experience</div>
    ${renderExperience(r.experience)}
  </section>

  <section class="section">
    <div class="section-title">Education &amp; Credentials</div>
    <ul class="creds">${credentials}</ul>
  </section>
</body>
</html>`;
}

async function main() {
  // Import Puppeteer lazily so a missing dependency yields a clear message.
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    console.error(
      "\n[generate-resume] Puppeteer is not installed.\n" +
        "Run:  npm install --save-dev puppeteer\n",
    );
    process.exit(1);
  }

  const html = buildHtml(resume);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: OUT_PATH,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }

  if (!existsSync(OUT_PATH) || statSync(OUT_PATH).size === 0) {
    console.error("[generate-resume] PDF was not written or is empty.");
    process.exit(1);
  }
  const kb = (statSync(OUT_PATH).size / 1024).toFixed(1);
  console.log(`[generate-resume] Wrote ${OUT_PATH} (${kb} KB).`);
}

main().catch((err) => {
  console.error("[generate-resume] Failed:", err);
  process.exit(1);
});
