import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const outputDir = path.join(rootDir, ".output");
const publicDir = path.join(rootDir, "public");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. If .output exists, ensure dist has everything from .output/public and .output
if (fs.existsSync(outputDir)) {
  const outputPublic = path.join(outputDir, "public");
  if (fs.existsSync(outputPublic)) {
    copyDirRecursive(outputPublic, distDir);
  }
}

// 3. Ensure static files from public/ are present in dist/
if (fs.existsSync(publicDir)) {
  copyDirRecursive(publicDir, distDir);
}

// 4. Ensure index.html exists in dist
const distIndexHtml = path.join(distDir, "index.html");
if (!fs.existsSync(distIndexHtml)) {
  const assetsDir = path.join(distDir, "assets");
  let cssFile = "";
  let jsFile = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const cssMatch = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
    const jsMatch = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));

    if (cssMatch) cssFile = `/assets/${cssMatch}`;
    if (jsMatch) jsFile = `/assets/${jsMatch}`;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>A Batalha — Diário de 30 dias de táticas de samurai e Palavra</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="${jsFile}"></script>` : ""}
  </body>
</html>
`;

  fs.writeFileSync(distIndexHtml, htmlContent, "utf-8");
  console.log("Generated dist/index.html");
}

// 5. Verify dist output
const distEntries = fs.readdirSync(distDir);
console.log(
  `[build:artifacts] dist/ contains ${distEntries.length} items:`,
  distEntries.join(", "),
);
