import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "../public/images");

const targets = [
  { input: "hamzaelboukri-Photoroom.png", output: "hamzaelboukri-Photoroom.webp", quality: 88 },
  { input: "hero-3-Photoroom.png", output: "hero-3-Photoroom.webp", quality: 85 },
];

for (const { input, output, quality } of targets) {
  const inputPath = join(imagesDir, input);
  const outputPath = join(imagesDir, output);
  if (!existsSync(inputPath)) {
    console.warn(`Skipping ${input} (not found)`);
    continue;
  }
  const info = await sharp(inputPath).webp({ quality }).toFile(outputPath);
  const inputSize = (await import("node:fs")).statSync(inputPath).size;
  const savings = (((inputSize - info.size) / inputSize) * 100).toFixed(1);
  console.log(`✓ ${output} — ${(info.size / 1024).toFixed(0)} KB (saved ${savings}%)`);
}
