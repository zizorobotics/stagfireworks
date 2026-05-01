import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxrjbhfcxuvrctpnhoxm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cmpiaGZjeHV2cmN0cG5ob3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTA1NTYsImV4cCI6MjA5MjE4NjU1Nn0.3V_Cpoji8_jtwpP3hRG0whdMf0xVy1_jGVa4gEGylc0'; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const requestedPrices = {
  "peking opera 3": 499,
  "bloodshot": 199,
  "delirious": 129,
  "scatterbrain": 55,
  "fire flash": 49,
  "jeopardy": 99,
  "vsr2": 79,
  "vs4": 79,
  "vsr4": 79,
  "gold fever": 189,
  "sky candy xl": 179,
  "wtf 512": 399,
  "zeigelstein": 289,
  "breakout": 49,
  "legends": 159,
  "loose cannon": 59,
  "sky vandal xl": 619,
  "sky vandal": 499,
  "reapers": 49,
  "asylum": 189,
  "face off": 179,
  "freak": 99,
  "laughing gas": 69,
  "delirium": 409,
  "f2 ultra pro": 99,
  "snake bite": 99,
  "kamuro rainbow xl": 189,
  "straight up crazy": 149,
  "wizard wands": 19,
  "el loco": 499,
  "velocity": 229,
  "terminal velocity": 299,
  "anti-venom": 79,
  "anti venom": 79,
  "venom": 79,
};

async function runUpdate() {
  const products = JSON.parse(fs.readFileSync('web/src/data/products.json', 'utf8'));

  let matched = {};

  products.forEach(p => {
    let lowerName = p.name.toLowerCase();
    
    // Ordered specifically to catch larger strings first (e.g. Anti-Venom vs Venom)
    for (const [key, price] of Object.entries(requestedPrices)) {
      if (lowerName.includes(key)) {
        // SET THE REAL PRICE
        p.price = price;
        matched[key] = (matched[key] || 0) + 1;
        break;
      }
    }
  });

  fs.writeFileSync('web/src/data/products.json', JSON.stringify(products, null, 2));
  console.log(`Matched objects:`, matched);
  console.log("Complete! products.json has been updated.");
}

runUpdate();
