// Downloads every hero `smallmap` image from the MLBB API into public/heroes/.
// Run with:  node scripts/download-heroes.mjs
//
// Why this exists: at runtime the app should NOT depend on mlbb.rone.dev or
// akmweb.youngjoygame.com — broadcasters use this overlay live and venue Wi-Fi
// is unreliable. We download once, ship the assets in dist/, and the production
// build is fully self-contained.

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "heroes");
const MANIFEST = join(ROOT, "public", "heroes.json");
const API = "https://mlbb.rone.dev/api/heroes?size=150&index=1&order=desc&lang=en";

function slug(name) {
  return name.toLowerCase().replace(/[\s'.&]+/g, "_").replace(/_+$/, "");
}

async function downloadOne(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Fetching hero list…");
  const apiRes = await fetch(API);
  if (!apiRes.ok) throw new Error(`Hero list HTTP ${apiRes.status}`);
  const json = await apiRes.json();
  const records = json.data.records;
  console.log(`Got ${records.length} heroes from API.`);

  const manifest = [];
  let ok = 0, fail = 0, totalBytes = 0;

  // Download in small concurrent batches so we're nice to the CDN.
  const BATCH = 8;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (r) => {
        const heroId = r.data.hero_id;
        const name = r.data.hero.data.name;
        const smallmap = r.data.hero.data.smallmap;
        const head = r.data.hero.data.head;

        const filename = `${heroId}-${slug(name)}.png`;
        const dest = join(OUT_DIR, filename);
        try {
          const bytes = await downloadOne(smallmap, dest);
          ok++;
          totalBytes += bytes;
          manifest.push({
            heroId,
            name,
            id: slug(name),
            smallmap: `/heroes/${filename}`,
            head, // keep remote head URL as a secondary source
          });
          process.stdout.write(`  ✓ ${filename} (${bytes} bytes)\n`);
        } catch (err) {
          fail++;
          console.error(`  ✗ ${name} (${heroId}): ${err.message}`);
        }
      })
    );
  }

  manifest.sort((a, b) => a.name.localeCompare(b.name));
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log("");
  console.log(`Done. ${ok} ok, ${fail} failed, ${(totalBytes / 1024).toFixed(1)} KB total.`);
  console.log(`Manifest written to public/heroes.json (${manifest.length} entries).`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
