import fs from 'fs';
import * as cheerio from 'cheerio';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

async function scrapeDetails(name) {
  try {
    const url = `https://www.fireworkscrazy.co.uk/?s=${encodeURIComponent(name)}&post_type=product`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Find the first product link
    const firstProduct = $('.product a.woocommerce-LoopProduct-link').first().attr('href') || $('.product a').first().attr('href');
    if (!firstProduct) return null;

    // Go to product page
    const prodRes = await fetch(firstProduct);
    const prodHtml = await prodRes.text();
    const $p = cheerio.load(prodHtml);

    const image = $p('.woocommerce-product-gallery__image a').attr('href') || $p('.wp-post-image').attr('src') || $p('img').first().attr('src');
    
    // Look for brand in tags or categories
    let brand = '';
    $p('.posted_in a').each((i, el) => {
      const text = $p(el).text().trim();
      if (!text.toLowerCase().includes('firework')) {
        brand = text;
      }
    });
    if (!brand) brand = $p('.brand-link').text().trim();

    let video = $p('.video-container iframe').attr('src');
    if (!video) {
      const iframes = $p('iframe').toArray();
      for (const el of iframes) {
        if ($p(el).attr('src')?.includes('youtube.com')) {
          video = $p(el).attr('src');
          break;
        }
      }
    }

    return { image, brand, video };
  } catch (err) {
    console.error(`Error scraping ${name}: ${err.message}`);
    return null;
  }
}

async function main() {
  const missing = products.filter(p => !p.image);
  console.log(`Found ${missing.length} products missing images.`);

  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    // Clean up name for search (e.g. "EL LOCO 😍💃💯🔥 268sh..." -> "EL LOCO")
    // Keep first 2 words if it's long, or just the word before the dash
    let searchName = p.name.split('-')[0].replace(/[^\w\s]/gi, ' ').trim().split(' ').slice(0, 3).join(' ');
    console.log(`\nSearching for: ${searchName} (Original: ${p.name})`);
    
    const details = await scrapeDetails(searchName);
    if (details && details.image) {
      console.log(`Found! Brand: ${details.brand}, Image: ${details.image.substring(0,50)}...`);
      p.image = details.image;
      if (details.brand) p.brand = details.brand;
      if (details.video) p.video = details.video;
      
      // Tag as NEW IN
      if (!p.tags) p.tags = [];
      if (!p.tags.includes('NEW IN')) p.tags.push('NEW IN');
      
    } else {
      console.log(`Not found.`);
    }
  }
  
  fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
  console.log('Saved to products.json');
}

main();
