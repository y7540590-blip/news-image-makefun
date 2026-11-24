// Entry point for the news-image-20261124 submission.
//
// The finished front-page image lives next to this file as entry.png.
// All this program has to do is deliver those exact bytes to the
// output location the runner asks for: the directory named by the
// MAKEFUN_OUTPUT_DIR environment variable, or /output when the
// variable is not set. The image must land there as entry.png,
// unchanged, on every run.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve the source image from this module's own location so the
// program works no matter which directory it is launched from.
const moduleDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(moduleDir, 'entry.png');

// Read the whole image into memory; at well under a megabyte it is
// cheap to hold, and having the bytes lets us check the copy later.
// Fail loudly and clearly if the image is not where it should be,
// rather than dying with a raw filesystem error.
let imageBytes;
try {
  imageBytes = readFileSync(sourcePath);
} catch {
  console.error(`Cannot find the entry image at ${sourcePath}.`);
  console.error('entry.png must sit in the same directory as main.ts.');
  process.exit(1);
}

// Pick the destination directory and make sure it exists before
// writing into it.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });
const targetPath = resolve(outputDir, 'entry.png');

writeFileSync(targetPath, imageBytes);

// Sanity check: re-read what landed on disk and compare it against
// the source bytes one for one, not just by length, so a truncated
// or corrupted write can never slip through quietly.
const written = readFileSync(targetPath);
if (!written.equals(imageBytes)) {
  throw new Error(
    `entry.png copy does not match the source: wrote ${written.length} of ${imageBytes.length} bytes`,
  );
}

console.log(`entry.png delivered to ${targetPath} (${imageBytes.length} bytes)`);
