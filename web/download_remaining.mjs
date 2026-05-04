import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const destDir = './public/images/products';

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(destDir, filename), buffer);
    console.log(`Downloaded: ${filename} (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

async function main() {
  // Wizard Wands
  const wizardWands = products.find(p => p.name.toLowerCase().includes('wizard wands'));
  if (wizardWands) {
    const ok = await downloadImage(
      'https://galacticfireworks.co.uk/cdn/shop/files/magicwands.jpg',
      'wizard_wands.jpg'
    );
    if (ok) {
      wizardWands.image = '/images/products/wizard_wands.jpg';
      if (!wizardWands.tags) wizardWands.tags = [];
      if (!wizardWands.tags.includes('NEW IN')) wizardWands.tags.push('NEW IN');
      console.log('✅ Wizard Wands image set');
    }
  }
  
  // Vibe
  const vibe = products.find(p => p.name.toLowerCase().includes('vibe'));
  if (vibe) {
    const ok = await downloadImage(
      'https://fireworkscrazy.co.uk/wp-content/uploads/2025/11/vivid-vibe-hanabi-sml.jpg',
      'vibe.jpg'
    );
    if (ok) {
      vibe.image = '/images/products/vibe.jpg';
      if (!vibe.tags) vibe.tags = [];
      if (!vibe.tags.includes('NEW IN')) vibe.tags.push('NEW IN');
      console.log('✅ Vibe image set');
    }
  }

  // Final check
  const missing = products.filter(p => !p.image);
  console.log(`\nProducts still missing images: ${missing.length}`);
  missing.forEach(p => console.log('  - ' + p.name));

  fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
  console.log('Saved!');
}

main();
