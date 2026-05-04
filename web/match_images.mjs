import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const ocrResults = JSON.parse(fs.readFileSync('./ocr_results.json', 'utf8'));

// Copy all images to public/images/products
const srcDir = '../fireworks_data/new_fireworks';
const destDir = './public/images/products';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// We will map OCR text to products
let updatedCount = 0;

for (const ocr of ocrResults) {
  const text = ocr.text.toLowerCase().replace(/[\n\r]/g, ' ');
  const file = ocr.file;
  
  // Find the best matching product
  let bestMatch = null;
  let bestScore = 0;
  
  for (const p of products) {
    if (p.image) continue; // Already matched
    
    // Simple word match score
    const words = p.name.toLowerCase().split(/[ \-]/).filter(w => w.length > 2);
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) {
        score += w.length;
      }
    }
    
    // Also check brand words
    if (p.brand) {
        const brandWords = p.brand.toLowerCase().split(/[ \-]/).filter(w => w.length > 2);
        for(const bw of brandWords) {
            if(text.includes(bw)) score += bw.length;
        }
    }

    if (score > bestScore && score > 3) {
      bestScore = score;
      bestMatch = p;
    }
  }
  
  if (bestMatch) {
    console.log(`Matched ${file} to ${bestMatch.name} (Score: ${bestScore})`);
    
    // Copy file
    const newFileName = file.replace(/ /g, '_').toLowerCase();
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newFileName));
    
    // Update product
    bestMatch.image = `/images/products/${newFileName}`;
    if (!bestMatch.tags) bestMatch.tags = [];
    if (!bestMatch.tags.includes('NEW IN')) bestMatch.tags.push('NEW IN');
    
    updatedCount++;
  } else {
    console.log(`No match for ${file}. Text was: ${text.substring(0,50)}`);
  }
}

console.log(`Updated ${updatedCount} products.`);
fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
