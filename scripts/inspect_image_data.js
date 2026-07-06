const fs = require("fs/promises");
const path = require("path");

async function checkImage(filename) {
  const filePath = path.join(process.cwd(), "public", "imagens", "VITRINE", "SemLimites", filename);
  try {
    const buffer = await fs.readFile(filePath);
    console.log(`File: ${filename}`);
    console.log(`  - Size: ${buffer.length} bytes`);
    console.log(`  - First 10 bytes:`, buffer.slice(0, 10));
    
    // Check headers
    const hex = buffer.slice(0, 4).toString("hex");
    if (hex === "89504e47") {
      console.log(`  - Format check: PNG (Valid)`);
    } else if (hex.startsWith("ffd8")) {
      console.log(`  - Format check: JPEG (Valid)`);
    } else if (buffer.slice(0, 4).toString() === "RIFF" && buffer.slice(8, 12).toString() === "WEBP") {
      console.log(`  - Format check: WEBP (Valid)`);
    } else {
      console.log(`  - Format check: Unknown/Corrupt! Hex: ${hex}`);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
}

async function main() {
  const images = ["008.jpeg", "011.png", "012.jpeg", "017.jpeg", "018.jpeg"];
  for (const img of images) {
    await checkImage(img);
  }
}

main();
