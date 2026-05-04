import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const destDir = './public/images/products';

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(destDir, filename), buffer);
    console.log(`Downloaded: ${filename} (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`Failed: ${err.message}`);
    return false;
  }
}

async function main() {
  const wizardWands = products.find(p => p.name.toLowerCase().includes('wizard wands'));
  if (!wizardWands) return;

  // Try multiple sources
  const urls = [
    'https://fireworkscrazy.co.uk/wp-content/uploads/2024/10/wizard-wands.jpg',
    'https://fireworkscrazy.co.uk/wp-content/uploads/2024/10/wizard-wands.png',
    'https://www.epicfireworks.com/content/images/thumbs/wizard-wands.jpg',
    'https://cdn.shopify.com/s/files/1/0123/4567/products/wizard-wands.jpg',
    'https://www.galacticfireworks.co.uk/cdn/shop/files/magicwands.jpg',
    'https://www.galacticfireworks.co.uk/cdn/shop/products/magicwands.jpg',
    'https://leedsfireworks.com/wp-content/uploads/2024/10/wizard-wands-vivid.jpg',
  ];
  
  for (const url of urls) {
    console.log(`Trying: ${url}`);
    const ok = await downloadImage(url, 'wizard_wands.jpg');
    if (ok) {
      wizardWands.image = '/images/products/wizard_wands.jpg';
      if (!wizardWands.tags) wizardWands.tags = [];
      if (!wizardWands.tags.includes('NEW IN')) wizardWands.tags.push('NEW IN');
      fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
      console.log('✅ Wizard Wands image set');
      return;
    }
  }
  
  console.log('Could not find Wizard Wands image, will use Puppeteer');
}

main();
