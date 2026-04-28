import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxrjbhfcxuvrctpnhoxm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const matchedImages = {
  "qKavJwRdbyU": "00000107-PHOTO-2026-04-17-15-33-27.jpg", // Venom
  "FR5FLIymwzk": "00000103-PHOTO-2026-04-17-15-33-27.jpg", // Velocity
  "_rge47TRaxM": "00000109-PHOTO-2026-04-17-15-33-27.jpg", // Anti-Venom
  "-6JSneMNu4M": "00000112-PHOTO-2026-04-17-15-33-28.jpg", // Terminal Velocity
  "xIuMLf4vmgw": "00000117-PHOTO-2026-04-17-15-33-29.jpg", // Peking Opera
  "jO10sHvw8M4": "00000118-PHOTO-2026-04-17-15-33-29.jpg", // BloodShot
  "D8dg2NBXp5Y": "00000121-PHOTO-2026-04-17-15-33-29.jpg", // Delirious
  "bXmn7uav7V0": "00000124-PHOTO-2026-04-17-15-33-30.jpg", // Scatterbrain
  "4V-nrS4hOXk": "00000127-PHOTO-2026-04-17-15-33-30.jpg", // Fire Flash
  "REK0ckYxmDY": "00000134-PHOTO-2026-04-17-15-33-31.jpg", // VSR Rockets
  "-dYpZwJa0ho": "00000140-PHOTO-2026-04-17-15-33-32.jpg", // Gold Fever
  "PVVK3Pg3Pwo": "00000143-PHOTO-2026-04-17-15-33-33.jpg", // Sky Candy
  "jAfZgv-aD6s": "00000146-PHOTO-2026-04-17-15-33-33.jpg", // WTF 512
  "SHoLxRBgD9k": "00000148-PHOTO-2026-04-17-15-33-33.jpg", // Breakout
  "5Siow97zLvQ": "00000149-PHOTO-2026-04-17-15-33-33.jpg", // WTF Mini
  "XQ7pUc_XUJE": "00000151-PHOTO-2026-04-17-15-33-34.jpg", // Jeopardy
  "TTqGLVU4N3c": "00000155-PHOTO-2026-04-17-15-33-34.jpg"  // Cataclysm
};

async function run() {
  const images = fs.readdirSync('web/public/images').filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  const mappedObjValues = Object.values(matchedImages);
  
  // All images NOT statically mapped above
  const remainingImages = images.filter(i => !mappedObjValues.includes(i) && !i.includes('fireworks_vibrant'));

  const { data: products } = await supabase.from('products').select('*');

  let updatedCount = 0;
  for (const product of products) {
     let imgName = null;
     if (product.videoId && matchedImages[product.videoId]) {
         imgName = matchedImages[product.videoId];
     } else if (remainingImages.length > 0) {
         imgName = remainingImages.shift(); // just pull a random placeholder
     }

     if (imgName) {
         await supabase.from('products').update({ image: `/images/${imgName}` }).eq('id', product.id);
         updatedCount++;
     }
  }

  console.log(`Successfully mapped ${updatedCount} images directly into the Supabase database!`);
}

run();
