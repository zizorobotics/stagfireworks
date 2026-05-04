import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

// Copy all images to public/images/products
const srcDir = '../fireworks_data/new_fireworks';
const destDir = './public/images/products';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let files = fs.readdirSync(srcDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
// Sort files alphabetically so they are chronological
files.sort((a, b) => a.localeCompare(b));

let missingProducts = products.filter(p => !p.image);
console.log(`Missing products: ${missingProducts.length}, available images: ${files.length}`);

// For each missing product, pop an image from files array and assign it
let count = 0;
for (const p of missingProducts) {
    if (files.length === 0) break;
    const file = files.shift(); // take the first file
    
    const newFileName = 'new_fw_' + Math.random().toString(36).substr(2, 5) + '_' + file.replace(/ /g, '_').toLowerCase();
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newFileName));
    
    p.image = `/images/products/${newFileName}`;
    if (!p.tags) p.tags = [];
    if (!p.tags.includes('NEW IN')) p.tags.push('NEW IN');
    
    count++;
}

console.log(`Updated ${count} products.`);
fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
