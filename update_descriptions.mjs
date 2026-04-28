import fs from 'fs';

const productsPath = 'web/src/data/products.json';
const chatTxt = fs.readFileSync('chat_whatsapp_context.txt', 'utf8');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

products.forEach(p => {
  if (!p.image) return;
  const imgName = p.image.split('/').pop().trim();
  
  // Find the image string in the chat text
  const attachStr = `<attached: ${imgName}>`;
  const idx = chatTxt.indexOf(attachStr);
  
  if (idx !== -1) {
    // Find the start of the message. Messages start with `[` like `[17/04/2026, 15:33:26]`
    const startIdx = chatTxt.lastIndexOf('[', idx);
    let desc = chatTxt.substring(startIdx, idx).trim();
    
    // Strip the sender prefix `[17/04/2026, 15:33:26] Phone extras naz: `
    desc = desc.replace(/^\[.*?\][^:]+:\s*/, '').trim();
    
    // Strip literal prefix 'Description:' if present (case insensitive)
    desc = desc.replace(/^Description:\s*/i, '').trim();

    // Remove strange right-to-left markers or zero width spaces if any
    desc = desc.replace(/[\u200E\u200F]/g, '');

    if (desc && desc.length > 20) {
      console.log(`Updated description for ${p.name} (Image: ${imgName})`);
      p.description = desc;
    }
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('Done mapping descriptions via exact image hashes!');
