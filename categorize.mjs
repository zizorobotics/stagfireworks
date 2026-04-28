import fs from 'fs';

const data = JSON.parse(fs.readFileSync('web/src/data/products.json', 'utf8'));

const updated = data.map(product => {
  const text = (product.name + ' ' + product.description).toLowerCase();
  
  let cat = "Compounds & Barrages"; // Default
  if (text.includes("rocket")) cat = "Rockets";
  else if (text.includes("fountain") || text.includes("mine")) cat = "Fountains & Mines";
  else if (text.includes("low noise") || text.includes("anti-venom")) cat = "Low Noise";
  else if (text.includes("wizard") || text.includes("sparkler") || text.includes("selection")) cat = "Selection Boxes";

  return { ...product, category: cat };
});

fs.writeFileSync('web/src/data/products.json', JSON.stringify(updated, null, 2));
console.log("Categories applied to products.");
