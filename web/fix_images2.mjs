import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const srcDir = '../fireworks_data/new_fireworks';
const destDir = './public/images/products';

// Fix 1: Scatterbrain has Asylum image, swap it back
const scatterbrain = products.find(p => p.name.toLowerCase().includes('scatterbrain'));
if (scatterbrain) {
  scatterbrain.image = '/images/products/scatterbrain.jpeg';
  console.log('Fixed Scatterbrain image');
}

// Fix 2: ASYLUM Barrage Pack - give it the proper Asylum box image (the single box)
const asylum = products.find(p => p.name.toLowerCase().includes('asylum') && p.name.toLowerCase().includes('barrage'));
if (asylum) {
  // Copy the single box image
  const asylumBoxFile = 'WhatsApp Image 2026-05-02 at 16.36.47 (1).jpeg';
  fs.copyFileSync(path.join(srcDir, asylumBoxFile), path.join(destDir, 'asylum_pack.jpeg'));
  asylum.image = '/images/products/asylum_pack.jpeg';
  console.log('Fixed Asylum Barrage Pack image');
}

// Fix 3: Legends Assortment - use the combo image
const legendsName = products.find(p => p.name.toLowerCase().includes('legends') || (p.name.toLowerCase().includes('legend') && p.name.toLowerCase().includes('assortment')));
// If there's no separate Legends product, let's check
if (!legendsName) {
  console.log('No Legends Assortment product found in catalog');
} else {
  const legendsFile = 'WhatsApp Image 2026-05-02 at 16.36.44.jpeg';
  fs.copyFileSync(path.join(srcDir, legendsFile), path.join(destDir, 'legends_assortment.jpeg'));
  legendsName.image = '/images/products/legends_assortment.jpeg';
  console.log('Fixed Legends Assortment image: ' + legendsName.name);
}

// Fix 4: VSR4 rockets - use the VSR4 image for any product about VS4/VSR4
const vsr4File = 'WhatsApp Image 2026-05-02 at 16.36.36.jpeg';
// Check for "VS4", "VSR 4", "VSR4" products
const vsr4Product = products.find(p => {
  const n = p.name.toLowerCase();
  return (n.includes('vs4') || n.includes('vsr 4') || n.includes('vsr4')) && !n.includes('vsr2');
});
if (vsr4Product) {
  fs.copyFileSync(path.join(srcDir, vsr4File), path.join(destDir, 'vsr4.jpeg'));
  vsr4Product.image = '/images/products/vsr4.jpeg';
  console.log('Fixed VSR4 image: ' + vsr4Product.name);
} else {
  console.log('No VSR4/VS4 product found');
}

// Fix 5: Wizard Wands and Vibe still have no images - search online
const wizardWands = products.find(p => p.name.toLowerCase().includes('wizard wands'));
const vibe = products.find(p => p.name.toLowerCase().includes('vibe'));

// For now, use the Asylum selection image (the opened pack showing all sub-fireworks) for Wizard Wands
// Actually better to skip and leave null so a placeholder shows

console.log('\nProducts still missing images:');
products.filter(p => !p.image).forEach(p => console.log('  - ' + p.name));

fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
console.log('\nSaved!');
