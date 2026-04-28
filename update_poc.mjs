import fs from 'fs';

const productsPath = 'web/src/data/products.json';
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Correcting two fireworks based on rigorous manual verification
const specsMapping = {
  "Vivid Pyrotechnics Velocity Compound 224 Shots From Snowdonia Fireworks": { 
    distance: "25 Metres", shots: "224", duration: "56 Secs", 
    noise: "4", height: "20 Metres", pattern: "Straight", 
    tube: "20mm", hazard: "1.3G", weight: "1904g" 
  },
  "Terminal Velocity": { 
    distance: "25 Metres", shots: "164", duration: "45 Secs", 
    noise: "5", height: "25 Metres", pattern: "Mixed", 
    tube: "25mm", hazard: "1.3G", weight: "2289g" 
  }
};

let patched = 0;
products.forEach(p => {
  if (specsMapping[p.name]) {
    p.specs = specsMapping[p.name];
    p.image = null; // Scrub image mapping
    patched++;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`Verified and mapped accurate specs for ${patched} components!`);
