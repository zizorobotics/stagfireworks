import fs from 'fs';

const products = JSON.parse(fs.readFileSync('web/src/data/products.json', 'utf8'));

let withVideo = [];
let withoutVideo = [];
let withSpecs = [];
let withBrandingImage = [];
let missingBrandingImage = []; // the ones we set to null

products.forEach(p => {
  if (p.linked_video) withVideo.push(p.name);
  else withoutVideo.push(p.name);

  if (p.specs) withSpecs.push(p.name);

  if (p.image) withBrandingImage.push(p.name);
  else missingBrandingImage.push(p.name);
});

let report = `# Fireworks Asset Status Report\n\n`;

report += `## Summary Dashboard\n`;
report += `- **Total Catalog Items:** ${products.length}\n`;
report += `- **With YouTube Videos:** ${withVideo.length}\n`;
report += `- **Without YouTube Videos:** ${withoutVideo.length}\n`;
report += `- **With Loaded Specifications:** ${withSpecs.length}\n`;
report += `- **With Branding Images:** ${withBrandingImage.length}\n`;
report += `- **Missing/Pending Images:** ${missingBrandingImage.length}\n\n`;

report += `## 🎬 Media Integration (YouTube)\n\n`;
report += `### Products WITH Videos\n`;
withVideo.forEach(name => report += `- ${name}\n`);
report += `\n### Products WITHOUT Videos\n`;
withoutVideo.forEach(name => report += `- ${name}\n`);

report += `\n## 📊 Data Integration (Specifications)\n\n`;
report += `### Products WITH Parsed Specifications\n`;
withSpecs.forEach(name => report += `- ${name}\n`);

report += `\n## 📸 Visual Assets (Branding Images)\n\n`;
report += `> [!WARNING]\n> The following products are currently set to "Awaiting Image" placeholders because their original specification images were stripped per the UX requirement.\n\n`;
report += `### Products MISSING Branding Images\n`;
missingBrandingImage.forEach(name => report += `- ${name}\n`);

report += `\n### Products WITH Authentic Imagery\n`;
withBrandingImage.forEach(name => report += `- ${name}\n`);

fs.writeFileSync('report.md', report);
console.log('Report generated at report.md');
