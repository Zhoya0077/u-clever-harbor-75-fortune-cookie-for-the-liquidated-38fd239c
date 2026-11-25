// Fortune Cookie for the Liquidated Trader — make.fun entry.
// Writes one fortune-cookie line to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output) and prints it to stdout.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "A great fortune awaits you \u2014 it is just currently locked in a margin account you no longer own.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, ENTRY + "\n", "utf8");
console.log(ENTRY);

// Self-checking gate: the written file must be exactly the entry,
// one line, 1-160 chars, at most 20 words, and not only whitespace.
const written = readFileSync(outFile, "utf8");
const body = written.replace(/\n$/, "");
const words = body.trim().split(/\s+/).filter(Boolean);
const problems: string[] = [];
if (body !== ENTRY) problems.push("file does not match the entry");
if (body.trim().length === 0) problems.push("entry is blank");
if (body.length < 1 || body.length > 160)
  problems.push(`entry is ${body.length} chars (must be 1-160)`);
if (body.includes("\n")) problems.push("entry is not one line");
if (words.length > 20) problems.push(`entry is ${words.length} words (max 20)`);
if (problems.length > 0) {
  console.error("SELF-CHECK FAILED: " + problems.join("; "));
  process.exit(1);
}
console.error(
  `self-check ok: ${body.length} chars, ${words.length} words, one line`,
);
