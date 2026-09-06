#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * QELVRA Portfolio — Demo Folder Asset Audit & Path Fixer
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * What this script does:
 *  1. AUDIT  — Scans every listed demo folder's index.html and all JS/CSS
 *              bundles for absolute /assets/... paths that will 404 in
 *              production or local subfolder serving.
 *  2. FIX    — Rewrites those absolute references to ./assets/... relative
 *              paths in-place (with automatic backup).
 *  3. THUMBNAIL — Verifies a preview image named <folderName>.<ext> exists
 *              at the root of each demo folder (webp/jpg/png/avif precedence).
 *  4. REPORT — Prints a colour-coded summary table to stdout and writes a
 *              machine-readable JSON report to scripts/audit-report.json.
 *
 * Usage:
 *   node scripts/demo-audit-fix.mjs            # audit + auto-fix
 *   node scripts/demo-audit-fix.mjs --dry-run  # audit only, no writes
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { readdirSync, statSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Config ──────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DEMOS_DIR = join(ROOT, "public", "assets", "demos");
const REPORT_OUT = join(__dirname, "audit-report.json");

const DEMO_FOLDERS = [
  "archetype",
  "aurelia",
  "cripsyland",
  "lumiere-haven",
  "medicare",
  "nexora",
  "oak-blade",
  "peak-performannce",
  "velocity",
];

const PREVIEW_EXTS = ["webp", "jpg", "png", "avif", "jpeg"];

// Patterns of absolute paths that break in subfolder deployments.
// Covers both quoted and unquoted occurrences inside JS/CSS bundles.
const ABS_PATTERNS = [
  // Covers "double-quoted" and 'single-quoted' string literals
  { pattern: /"(\/assets\/[^"]+)"/g,  quote: '"' },
  { pattern: /'(\/assets\/[^']+)'/g,  quote: "'" },
  // Covers url(/assets/...) inside CSS
  { pattern: /url\((\/assets\/[^)]+)\)/g, quote: "url" },
];

const isDryRun = process.argv.includes("--dry-run");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  cyan:   "\x1b[36m",
  dim:    "\x1b[2m",
};

function log(msg)        { process.stdout.write(msg + "\n"); }
function ok(msg)         { log(`  ${C.green}✔${C.reset}  ${msg}`); }
function warn(msg)       { log(`  ${C.yellow}⚠${C.reset}  ${msg}`); }
function err(msg)        { log(`  ${C.red}✖${C.reset}  ${msg}`); }
function info(msg)       { log(`  ${C.cyan}ℹ${C.reset}  ${msg}`); }
function header(msg)     { log(`\n${C.bold}${C.cyan}${msg}${C.reset}`); }
function rule()          { log(C.dim + "─".repeat(72) + C.reset); }

/**
 * Given an absolute /assets/... path found inside a JS/CSS bundle that lives
 * at `bundleAbsPath`, returns the correct relative path from the bundle's
 * location to the demo root's ./assets/ tree.
 *
 * Because all bundles sit at  <demo>/assets/<hash>.js
 * and the assets they reference are at  <demo>/assets/<subpath>
 * the relative prefix is always  "../assets/"  from within the bundle.
 * BUT since we are fixing the *source text* that the browser uses
 * (not where Node resolves them), and the browser loads the HTML from
 * <demo>/index.html, every path relative to index.html should be ./assets/.
 * Inside the JS bundle the browser uses the HTML document's baseURI, so
 * "./assets/..." resolves correctly.
 */
function makeRelative(absAssetPath) {
  // /assets/images/foo.jpg  →  ./assets/images/foo.jpg
  return "." + absAssetPath;
}

/** Collect every JS and CSS file inside <demo>/assets/ */
function getBundleFiles(demoDir) {
  const assetsDir = join(demoDir, "assets");
  if (!existsSync(assetsDir)) return [];
  return readdirSync(assetsDir)
    .filter((f) => f.endsWith(".js") || f.endsWith(".css"))
    .map((f) => join(assetsDir, f));
}

/**
 * Scan a file's text content for all absolute /assets/... references.
 * Returns an array of unique absolute paths found.
 */
function findAbsolutePaths(content) {
  const found = new Set();
  for (const { pattern } of ABS_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(content)) !== null) {
      found.add(m[1]);
    }
  }
  return [...found];
}

/**
 * Replace all absolute /assets/... occurrences in content with ./assets/...
 * Returns { newContent, count } where count is the number of replacements.
 */
function fixAbsolutePaths(content) {
  let count = 0;
  let newContent = content;

  // Replace "/assets/ with "./assets/ (double-quoted)
  newContent = newContent.replace(/"\/assets\//g, () => { count++; return '"./assets/'; });
  // Replace '/assets/ with './assets/ (single-quoted)
  newContent = newContent.replace(/'\/assets\//g, () => { count++; return "'./assets/"; });
  // Replace url(/assets/ with url(./assets/ (CSS)
  newContent = newContent.replace(/url\(\/assets\//g, () => { count++; return "url(./assets/"; });
  // Plain unquoted /assets/ strings (JSON, template literals, etc.)
  // Only replace when preceded by : or = or [ or ( or , or space
  newContent = newContent.replace(/([:=\[,({\s`])(\/assets\/)/g, (_m, pre, _abs) => {
    count++;
    return pre + "./assets/";
  });

  return { newContent, count };
}

/** Backup a file before overwriting — writes <file>.bak if it doesn't exist */
function backup(filePath) {
  const bak = filePath + ".bak";
  if (!existsSync(bak)) {
    copyFileSync(filePath, bak);
  }
}

// ─── Main audit loop ──────────────────────────────────────────────────────────

const report = {
  timestamp: new Date().toISOString(),
  dryRun: isDryRun,
  folders: [],
};

header("QELVRA Demo Folder — Asset Audit & Path Fixer");
rule();
info(`Mode  : ${isDryRun ? "DRY-RUN (no writes)" : "LIVE (files will be patched)"}`);
info(`Demos : ${DEMOS_DIR}`);
rule();

let totalIssues = 0;
let totalFixed  = 0;

for (const folder of DEMO_FOLDERS) {
  const demoDir   = join(DEMOS_DIR, folder);
  const indexHtml = join(demoDir, "index.html");

  header(`📁  ${folder}`);

  const folderReport = {
    folder,
    exists: existsSync(demoDir),
    indexHtml: false,
    preview: null,
    absolutePathsFound: 0,
    absolutePathsFixed: 0,
    filesPatched: [],
    issues: [],
  };

  // ── 1. Folder existence ──────────────────────────────────────────────────
  if (!existsSync(demoDir)) {
    err(`Folder missing: ${demoDir}`);
    folderReport.issues.push("FOLDER_MISSING");
    totalIssues++;
    report.folders.push(folderReport);
    continue;
  }

  // ── 2. index.html existence ──────────────────────────────────────────────
  if (!existsSync(indexHtml)) {
    err(`index.html missing`);
    folderReport.issues.push("INDEX_HTML_MISSING");
    totalIssues++;
  } else {
    folderReport.indexHtml = true;
    ok(`index.html present`);

    // Check index.html itself for absolute paths
    const htmlContent = readFileSync(indexHtml, "utf8");
    const absInHtml = findAbsolutePaths(htmlContent);
    if (absInHtml.length > 0) {
      warn(`index.html has ${absInHtml.length} absolute path(s): ${absInHtml.slice(0, 3).join(", ")}...`);
      folderReport.absolutePathsFound += absInHtml.length;
      if (!isDryRun) {
        backup(indexHtml);
        const { newContent, count } = fixAbsolutePaths(htmlContent);
        writeFileSync(indexHtml, newContent, "utf8");
        folderReport.absolutePathsFixed += count;
        folderReport.filesPatched.push("index.html");
        ok(`  Fixed ${count} path(s) in index.html`);
        totalFixed += count;
      }
      totalIssues += absInHtml.length;
    } else {
      ok(`index.html — no absolute paths`);
    }
  }

  // ── 3. Preview thumbnail ─────────────────────────────────────────────────
  let previewFound = null;
  for (const ext of PREVIEW_EXTS) {
    const candidate = join(demoDir, `${folder}.${ext}`);
    if (existsSync(candidate)) {
      previewFound = `${folder}.${ext}`;
      break;
    }
  }
  if (previewFound) {
    ok(`Preview found: ${previewFound}`);
    folderReport.preview = previewFound;
  } else {
    err(`No preview image (expected: ${folder}.{webp|jpg|png|avif})`);
    folderReport.issues.push("PREVIEW_MISSING");
    totalIssues++;
  }

  // ── 4. JS / CSS bundle scan & fix ───────────────────────────────────────
  const bundles = getBundleFiles(demoDir);
  if (bundles.length === 0) {
    warn(`No JS/CSS bundles found in assets/`);
    folderReport.issues.push("NO_BUNDLES");
  } else {
    info(`Found ${bundles.length} bundle(s) — scanning for absolute paths…`);
    for (const bundlePath of bundles) {
      const fileName = bundlePath.split(/[\\/]/).slice(-3).join("/"); // assets/<file>
      const content = readFileSync(bundlePath, "utf8");
      const absPaths = findAbsolutePaths(content);

      if (absPaths.length === 0) {
        ok(`${fileName} — clean`);
        continue;
      }

      warn(`${fileName} — ${absPaths.length} absolute ref(s)`);
      absPaths.slice(0, 6).forEach((p) => info(`    ${p}  →  ${makeRelative(p)}`));
      if (absPaths.length > 6) info(`    … and ${absPaths.length - 6} more`);

      folderReport.absolutePathsFound += absPaths.length;
      totalIssues += absPaths.length;

      if (!isDryRun) {
        backup(bundlePath);
        const { newContent, count } = fixAbsolutePaths(content);
        writeFileSync(bundlePath, newContent, "utf8");
        folderReport.absolutePathsFixed += count;
        folderReport.filesPatched.push(fileName);
        ok(`  Fixed ${count} path(s) in ${fileName.split("/").pop()}`);
        totalFixed += count;
      }
    }
  }

  report.folders.push(folderReport);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

rule();
header("SUMMARY");
rule();

const allOk = totalIssues === 0;
log(`  Folders scanned   : ${DEMO_FOLDERS.length}`);
log(`  Issues found      : ${totalIssues === 0 ? C.green + "0" + C.reset : C.red + totalIssues + C.reset}`);
if (!isDryRun) {
  log(`  Paths fixed       : ${C.green}${totalFixed}${C.reset}`);
}
log(`  Report written to : ${REPORT_OUT}`);
rule();

if (allOk) {
  log(`\n${C.green}${C.bold}  ✔  All demos are clean — no absolute paths found.${C.reset}\n`);
} else if (isDryRun) {
  log(`\n${C.yellow}${C.bold}  ⚠  Dry-run complete. Run without --dry-run to apply fixes.${C.reset}\n`);
} else {
  log(`\n${C.green}${C.bold}  ✔  All absolute paths patched. Demos should serve correctly.${C.reset}\n`);
}

// Write JSON report
writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2), "utf8");
