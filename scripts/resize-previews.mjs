/**
 * Resize all demo preview images to exactly 1200×750 (16:10 aspect ratio).
 * Only processes the root-level <folderName>.webp/.jpg/.png preview files
 * inside each demos subfolder — NOT the inner assets/ directories.
 *
 * Resize strategy: fit "cover" + crop top so the full 1200×750 frame is filled.
 */
import sharp from "sharp";
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEMOS_DIR_PRIMARY = join(__dirname, "../public/demos");
const DEMOS_DIR = existsSync(DEMOS_DIR_PRIMARY) ? DEMOS_DIR_PRIMARY : join(__dirname, "../public/assets/demos");
const TARGET_W = 1200;
const TARGET_H = 750;
const PREVIEW_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

async function main() {
  const folders = readdirSync(DEMOS_DIR).filter((name) => {
    const p = join(DEMOS_DIR, name);
    return statSync(p).isDirectory();
  });

  for (const folder of folders) {
    const folderPath = join(DEMOS_DIR, folder);
    const files = readdirSync(folderPath).filter((f) => {
      const ext = extname(f).toLowerCase();
      const stem = basename(f, ext);
      return PREVIEW_EXTS.has(ext) && stem === folder;
    });

    for (const file of files) {
      const filePath = join(folderPath, file);
      const inputBuffer = readFileSync(filePath);
      const meta = await sharp(inputBuffer).metadata();
      const originalW = meta.width || 0;
      const originalH = meta.height || 0;

      if (originalW === TARGET_W && originalH === TARGET_H) {
        console.log(`  ✓ ${folder}/${file} already ${TARGET_W}×${TARGET_H} — skipping`);
        continue;
      }

      console.log(`  Resizing ${folder}/${file}  [${originalW}×${originalH}] → [${TARGET_W}×${TARGET_H}]`);

      const ext = extname(file).toLowerCase().replace(".", "");
      const resized = sharp(inputBuffer).resize(TARGET_W, TARGET_H, {
        fit: "cover",
        position: "top",
      });

      let outputBuffer;
      if (ext === "webp") {
        outputBuffer = await resized.webp({ quality: 82 }).toBuffer();
      } else if (ext === "jpg" || ext === "jpeg") {
        outputBuffer = await resized.jpeg({ quality: 82 }).toBuffer();
      } else if (ext === "png") {
        outputBuffer = await resized.png({ compressionLevel: 8 }).toBuffer();
      } else if (ext === "avif") {
        outputBuffer = await resized.avif({ quality: 72 }).toBuffer();
      } else {
        outputBuffer = await resized.toBuffer();
      }

      writeFileSync(filePath, outputBuffer);
      console.log(`    ✓ Saved (${(outputBuffer.length / 1024).toFixed(0)} KB)`);
    }
  }

  console.log("\nAll done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
