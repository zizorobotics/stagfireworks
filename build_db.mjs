import fs from 'fs';

const videoData = JSON.parse(fs.readFileSync('video_data.json', 'utf8'));

// Minimal manual matching based on the chat text
const matchedImages = {
  "qKavJwRdbyU": ["00000107-PHOTO-2026-04-17-15-33-27.jpg"], // Venom
  "FR5FLIymwzk": ["00000103-PHOTO-2026-04-17-15-33-27.jpg"], // Velocity
  "_rge47TRaxM": ["00000109-PHOTO-2026-04-17-15-33-27.jpg"], // Anti-Venom
  "-6JSneMNu4M": ["00000112-PHOTO-2026-04-17-15-33-28.jpg"], // Terminal Velocity
  "xIuMLf4vmgw": ["00000117-PHOTO-2026-04-17-15-33-29.jpg"], // Peking Opera
  "jO10sHvw8M4": ["00000118-PHOTO-2026-04-17-15-33-29.jpg"], // BloodShot
  "D8dg2NBXp5Y": ["00000121-PHOTO-2026-04-17-15-33-29.jpg"], // Delirious
  "bXmn7uav7V0": ["00000124-PHOTO-2026-04-17-15-33-30.jpg"], // Scatterbrain
  "4V-nrS4hOXk": ["00000127-PHOTO-2026-04-17-15-33-30.jpg"], // Fire Flash
  "REK0ckYxmDY": ["00000134-PHOTO-2026-04-17-15-33-31.jpg"], // VSR Rockets
  "-dYpZwJa0ho": ["00000140-PHOTO-2026-04-17-15-33-32.jpg"], // Gold Fever
  "PVVK3Pg3Pwo": ["00000143-PHOTO-2026-04-17-15-33-33.jpg"], // Sky Candy
  "jAfZgv-aD6s": ["00000146-PHOTO-2026-04-17-15-33-33.jpg"], // WTF 512
  "SHoLxRBgD9k": ["00000148-PHOTO-2026-04-17-15-33-33.jpg"], // Breakout Spinning Fountain
  "5Siow97zLvQ": ["00000149-PHOTO-2026-04-17-15-33-33.jpg"], // WTF Mini
  "XQ7pUc_XUJE": ["00000151-PHOTO-2026-04-17-15-33-34.jpg"], // Jeopardy
  "TTqGLVU4N3c": ["00000155-PHOTO-2026-04-17-15-33-34.jpg"]  // Cataclysm
};

// We will map all 39 videos as products. For those without explicit image matches,
// we will assign one of the remaining images randomly so it isn't blank, but mark them.

// Read all available images
const imagesDir = fs.readdirSync('fireworks_data').filter(f => f.endsWith('.jpg'));
const usedImages = new Set([].concat(...Object.values(matchedImages)));
const remainingImages = imagesDir.filter(img => !usedImages.has(img));

let products = videoData.map((v, idx) => {
  let matchedImgs = matchedImages[v.id] || null;
  let image = null;
  let linked_video = true;

  if (matchedImgs) {
    image = matchedImgs[0];
  } else {
    // assign a random remaining image if any
    image = remainingImages.length > 0 ? remainingImages.shift() : 'placeholder.jpg';
  }

  // Clean title for product name
  let name = v.title
    .replace(/from Vivid Pyrotechnics.*/i, '')
    .replace(/@.*?/g, '')
    .replace(/Vivid Pyrotechnics - /i, '')
    .split('|')[0]
    .replace(/by Vivid.*/i, '')
    .trim();

  return {
    id: v.id,
    name: name || 'Firework ' + (idx + 1),
    videoUrl: v.url,
    videoId: v.id,
    image: '/images/' + image,
    description: v.title, // using the full title as description placeholder
    linked_video: true
  };
});

// Add unlinked products
// Here we might just add some of the explicit unlinked ones like Wizard wands or 4" Pro rockets.
const unlinked = [
  {
    id: "unlinked-1",
    name: "Wizard Wands",
    videoUrl: "",
    videoId: null,
    image: "/images/00000156-PHOTO-2026-04-17-15-33-35.jpg",
    description: "Wizard wands from Bright Star fireworks",
    linked_video: false
  },
  {
    id: "unlinked-2",
    name: "2 Huge Stunning 4\" Pro Effect Rockets",
    videoUrl: "",
    videoId: null,
    image: "/images/00000135-PHOTO-2026-04-17-15-33-32.jpg",
    description: "For those who adore huge effects. Get ready for a double dose of fiery fun.",
    linked_video: false
  }
];

// Combine and write
const allProducts = [...products, ...unlinked];
fs.mkdirSync('web/src/data', { recursive: true });
fs.writeFileSync('web/src/data/products.json', JSON.stringify(allProducts, null, 2));

console.log('Created products.json with ' + allProducts.length + ' items');
