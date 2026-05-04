import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const srcDir = '../fireworks_data/new_fireworks';
const destDir = './public/images/products';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Correct mapping: filename -> product name keyword (lowercase match against product name)
const imageMap = {
  'WhatsApp Image 2026-05-02 at 16.36.30.jpeg': 'straight up crazy',
  'WhatsApp Image 2026-05-02 at 16.36.32.jpeg': 'breakout',
  'WhatsApp Image 2026-05-02 at 16.36.33.jpeg': 'jeopardy',
  'WhatsApp Image 2026-05-02 at 16.36.35.jpeg': 'scatterbrain',
  'WhatsApp Image 2026-05-02 at 16.36.36.jpeg': 'vsr4', // this is actually VS4/VSR4 rockets
  'WhatsApp Image 2026-05-02 at 16.36.37.jpeg': 'laughing gas',
  'WhatsApp Image 2026-05-02 at 16.36.41.jpeg': 'vsr3', // VSR3 rockets - no product for this, skip or map to "2 Huge Stunning 4" Pro Effect Rockets"
  'WhatsApp Image 2026-05-02 at 16.36.42 (1).jpeg': 'terminal velocity',
  'WhatsApp Image 2026-05-02 at 16.36.42.jpeg': 'delirium',
  'WhatsApp Image 2026-05-02 at 16.36.43.jpeg': 'f2 ultra pro',
  'WhatsApp Image 2026-05-02 at 16.36.44.jpeg': 'legends assortment', // Velocity Mini + WTF Mini + Professor X + Legends Assortment
  'WhatsApp Image 2026-05-02 at 16.36.45.jpeg': 'screaming demons',
  'WhatsApp Image 2026-05-02 at 16.36.47 (1).jpeg': 'asylum',  // The Asylum box
  'WhatsApp Image 2026-05-02 at 16.36.47 (2).jpeg': 'asylum_selection', // Asylum selection opened view
  'WhatsApp Image 2026-05-02 at 16.36.47 (3).jpeg': 'face off round 1',
  'WhatsApp Image 2026-05-02 at 16.36.47.jpeg': 'screaming banshee',
  'WhatsApp Image 2026-05-02 at 16.36.49 (1).jpeg': 'snake bite',
  'WhatsApp Image 2026-05-02 at 16.36.49 (2).jpeg': 'cataclysm',
  'WhatsApp Image 2026-05-02 at 16.36.49 (3).jpeg': 'sky vandal xl',
  'WhatsApp Image 2026-05-02 at 16.36.49.jpeg': 'face off round 2',
  'WhatsApp Image 2026-05-02 at 16.36.50 (1).jpeg': 'reapers',
  'WhatsApp Image 2026-05-02 at 16.36.50.jpeg': 'sky vandal',  // Sky Vandal (not XL)
  'WhatsApp Image 2026-05-02 at 16.36.51 (1).jpeg': 'velocity mini',
  'WhatsApp Image 2026-05-02 at 16.36.51.jpeg': 'loose cannon',
  'WhatsApp Image 2026-05-02 at 16.36.53 (1).jpeg': 'professor x',
  'WhatsApp Image 2026-05-02 at 16.36.53 (2).jpeg': 'kamuro rainbow',
  'WhatsApp Image 2026-05-02 at 16.36.53 (3).jpeg': 'ziegelstein',
  'WhatsApp Image 2026-05-02 at 16.36.53 (4).jpeg': 'phoenix',
  'WhatsApp Image 2026-05-02 at 16.36.53.jpeg': 'wtf mini',
  'WhatsApp Image 2026-05-02 at 16.36.54 (1).jpeg': 'delirious',
  'WhatsApp Image 2026-05-02 at 16.36.54 (2).jpeg': 'el loco',
  'WhatsApp Image 2026-05-02 at 16.36.54 (3).jpeg': 'sky candy xl',
  'WhatsApp Image 2026-05-02 at 16.36.54 (4).jpeg': 'gold fever',
  'WhatsApp Image 2026-05-02 at 16.36.54 (5).jpeg': 'vsr2',
  'WhatsApp Image 2026-05-02 at 16.36.54 (6).jpeg': 'fire flash',  // Fireflash rockets
  'WhatsApp Image 2026-05-02 at 16.36.54 (7).jpeg': 'velocity compound',  // Velocity (big)
  'WhatsApp Image 2026-05-02 at 16.36.54.jpeg': 'wtf 512',
  'WhatsApp Image 2026-05-02 at 16.36.55 (1).jpeg': 'bloodshot',
  'WhatsApp Image 2026-05-02 at 16.36.55 (2).jpeg': 'peking opera',
  'WhatsApp Image 2026-05-02 at 16.36.55 (3).jpeg': 'venom',  // Venom
  'WhatsApp Image 2026-05-02 at 16.36.55 (4).jpeg': 'anti-venom',  // Anti-Venom (blue)
  'WhatsApp Image 2026-05-02 at 16.36.55.jpeg': 'freak',
};

// First, clear ALL existing images that were wrongly assigned
for (const p of products) {
  // Clear images that are local product images (wrongly mapped)
  if (p.image && (p.image.startsWith('/images/products/new_fw_') || p.image.startsWith('/images/products/whatsapp'))) {
    p.image = null;
  }
  // Also clear scraped URLs that might be wrong
  if (p.image && p.image.includes('fireworkscrazy.co.uk')) {
    p.image = null;
  }
}

let matched = 0;
let unmatched = [];

for (const [filename, keyword] of Object.entries(imageMap)) {
  // Find the matching product
  let product = null;
  
  for (const p of products) {
    const name = p.name.toLowerCase();
    
    if (keyword === 'vsr3') {
      // VSR3 - map to "2 Huge Stunning 4" Pro Effect Rockets"
      if (name.includes('2 huge stunning') || name.includes('pro effect rocket')) {
        product = p;
        break;
      }
    } else if (keyword === 'asylum_selection') {
      // Second Asylum image - skip, we already have one
      continue;
    } else if (keyword === 'vsr4') {
      // Map to the VSR4 product if it exists, otherwise skip
      // Looking for "VS4" or "VSR 4" or "VSR4" but NOT "VSR2"
      if ((name.includes('vs4') || name.includes('vsr 4') || name.includes('vsr4')) && !name.includes('vsr2')) {
        product = p;
        break;
      }
    } else if (keyword === 'velocity compound') {
      // Map to the big Velocity (not Velocity Mini, not Terminal Velocity)
      if (name.includes('velocity') && !name.includes('mini') && !name.includes('terminal')) {
        product = p;
        break;
      }
    } else if (keyword === 'sky vandal xl') {
      if (name.includes('sky vandal') && name.includes('xl')) {
        product = p;
        break;
      }
    } else if (keyword === 'sky vandal') {
      // Regular Sky Vandal - NOT the XL
      if (name.includes('sky vandal') && !name.includes('xl')) {
        product = p;
        break;
      }
    } else if (keyword === 'face off round 1') {
      if (name.includes('face off') && name.includes('round 1')) {
        product = p;
        break;
      }
    } else if (keyword === 'face off round 2') {
      if (name.includes('face off') && (name.includes('round 2') || name.includes('round-2'))) {
        product = p;
        break;
      }
    } else if (keyword === 'asylum') {
      if (name.includes('asylum') && !name.includes('selection')) {
        // Try the barrage pack first
        product = p;
        break;
      }
    } else if (keyword === 'legends assortment') {
      // This is a combo image showing Velocity Mini, WTF Mini, Professor X, and Legends Assortment
      // Map to Legends Assortment since that's the main product shown
      if (name.includes('legends') || (name.includes('legend') && name.includes('assortment'))) {
        product = p;
        break;
      }
    } else if (keyword === 'ziegelstein') {
      if (name.includes('zeigelstein') || name.includes('ziegelstein')) {
        product = p;
        break;
      }
    } else if (keyword === 'fire flash') {
      if (name.includes('fire flash') || name.includes('fireflash')) {
        product = p;
        break;
      }
    } else if (keyword === 'wtf 512') {
      if (name.includes('wtf 512') || name.includes('w.t.f')) {
        if (!name.includes('mini')) {
          product = p;
          break;
        }
      }
    } else if (keyword === 'wtf mini') {
      if (name.includes('wtf mini') || name.includes('w.t.f') && name.includes('mini')) {
        product = p;
        break;
      }
    } else if (keyword === 'venom') {
      if (name.includes('venom') && !name.includes('anti')) {
        product = p;
        break;
      }
    } else if (keyword === 'anti-venom') {
      if (name.includes('anti') && name.includes('venom')) {
        product = p;
        break;
      }
    } else {
      if (name.includes(keyword)) {
        product = p;
        break;
      }
    }
  }
  
  if (product) {
    // Copy file to public dir with a clean name
    const cleanName = keyword.replace(/[^a-z0-9]/g, '_') + '.jpeg';
    const destPath = path.join(destDir, cleanName);
    fs.copyFileSync(path.join(srcDir, filename), destPath);
    
    product.image = `/images/products/${cleanName}`;
    if (!product.tags) product.tags = [];
    if (!product.tags.includes('NEW IN')) product.tags.push('NEW IN');
    
    matched++;
    console.log(`✅ ${filename} → ${product.name} (${cleanName})`);
  } else {
    if (keyword !== 'asylum_selection') {
      unmatched.push({ filename, keyword });
      console.log(`❌ No product found for: ${keyword} (${filename})`);
    }
  }
}

// Also assign the Asylum selection image to ASYLUM Barrage Pack if it exists
const asylumSelection = 'WhatsApp Image 2026-05-02 at 16.36.47 (2).jpeg';
const asylumPack = products.find(p => p.name.toLowerCase().includes('asylum') && !p.image);
if (asylumPack) {
  const cleanName = 'asylum_barrage_pack.jpeg';
  fs.copyFileSync(path.join(srcDir, asylumSelection), path.join(destDir, cleanName));
  asylumPack.image = `/images/products/${cleanName}`;
  if (!asylumPack.tags) asylumPack.tags = [];
  if (!asylumPack.tags.includes('NEW IN')) asylumPack.tags.push('NEW IN');
  matched++;
  console.log(`✅ ${asylumSelection} → ${asylumPack.name} (asylum_barrage_pack.jpeg)`);
}

console.log(`\n--- Results ---`);
console.log(`Matched: ${matched}`);
console.log(`Unmatched: ${unmatched.length}`);
unmatched.forEach(u => console.log(`  - ${u.keyword}: ${u.filename}`));

// Show remaining products without images
const stillMissing = products.filter(p => !p.image);
console.log(`\nProducts still missing images: ${stillMissing.length}`);
stillMissing.forEach(p => console.log(`  - ${p.name}`));

fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
console.log('\nSaved to products.json');
