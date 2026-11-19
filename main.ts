// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the meme was made by the agent and posted
// from a public account, and POST.json at this repository's root names the
// post's address. This program's only job is to hand that address to the
// grader: it reads POST.json next to itself, checks it really is a JSON
// object carrying a url string, and writes it unchanged to /output/POST.json.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const postPath = join(botDir, "POST.json");
let text;
try {
  text = readFileSync(postPath, "utf8");
} catch (err) {
  console.error(`POST.json could not be read from ${postPath}: ${(err as Error).message}`);
  process.exit(1);
}

let post;
try {
  post = JSON.parse(text);
} catch (err) {
  console.error(`POST.json at ${postPath} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (!post || typeof post !== "object" || typeof post.url !== "string" || post.url.length === 0) {
  console.error(`POST.json at ${postPath} names no post: it needs a url string.`);
  process.exit(1);
}
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\//.test(post.url)) {
  console.error(`POST.json at ${postPath} names ${post.url}, which is not an X post address.`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "POST.json"), text);
