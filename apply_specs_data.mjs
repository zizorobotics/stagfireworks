import fs from 'fs';

const productsPath = 'web/src/data/products.json';
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const specsMapping = {
  "LOOSE CANNON": { distance: "25 Metres", shots: "268", duration: "158 Secs", noise: "5", height: "30 Metres", pattern: "Mixed", tube: "25/30mm", hazard: "1.3", weight: "3774g" },
  "REAPERS 5 PACK ROCKETS 68g": { distance: "8 Metres", shots: "100", duration: "120 Secs", noise: "3", height: "20 Metres", pattern: "Straight", tube: "20mm", hazard: "1.4", weight: "499g" },
  "SKY VANDAL Compound Firework": { distance: "8 Metres", shots: "100", duration: "120 Secs", noise: "0", height: "20 Metres", pattern: "Straight", tube: "20mm", hazard: "1.4", weight: "499g" },
  "Sky Vandal XL Vivid Pyrotechnics": { distance: "8 Metres", shots: "100", duration: "120 Secs", noise: "Shhh!", height: "20 Metres", pattern: "Straight", tube: "20mm", hazard: "1.4", weight: "499g" },
  "Snake Bite": { distance: "25 Metres", shots: "164", duration: "45 Secs", noise: "4", height: "30 Metres", pattern: "Mixed", tube: "25mm", hazard: "1.3", weight: "TBC" },
  "FACE OFF ROUND 1": { distance: "25 Metres", shots: "64", duration: "50 Secs", noise: "5", height: "25 Metres", pattern: "Mixed", tube: "30mm", hazard: "1.3", weight: "981g" },
  "Face off Round 2": { distance: "25 Metres", shots: "64", duration: "50 Secs", noise: "5", height: "25 Metres", pattern: "Mixed", tube: "30mm", hazard: "1.3", weight: "981g" },
  "ASYLUM Barrage Pack": { distance: "25 Metres", shots: "164", duration: "45 Secs", noise: "4", height: "30 Metres", pattern: "Mixed", tube: "25mm", hazard: "1.3", weight: "TBC" },
  "SCREAMING BANSHEE": { distance: "25 Metres", shots: "100", duration: "20 Secs", noise: "5", height: "25 Metres", pattern: "Mixed", tube: "25/30mm", hazard: "1.3", weight: "1000g" },
  "Professor X": { distance: "8 Metres", shots: "224", duration: "56 Secs", noise: "4", height: "20 Metres", pattern: "Straight", tube: "20mm", hazard: "1.3", weight: "1904g" },
  "Velocity Mini": { distance: "8 Metres", shots: "224", duration: "56 Secs", noise: "4", height: "20 Metres", pattern: "Straight", tube: "20mm", hazard: "1.3", weight: "1904g" },
  "Zeigelstein": { distance: "25 Metres", shots: "268", duration: "158 Secs", noise: "5", height: "30 Metres", pattern: "Mixed", tube: "25/30mm", hazard: "1.3", weight: "3774g" }
};

let patched = 0;
products.forEach(p => {
  if (specsMapping[p.name]) {
    p.specs = specsMapping[p.name];
    p.image = null; // Scrub image to trigger placeholder logic
    patched++;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`Parsed mapped specs and scrubbed dummy images for ${patched} components!`);
