import fs from 'fs';
import puppeteer from 'puppeteer';

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

async function scrapeDetails(page, name) {
  try {
    const searchUrl = `https://www.fireworkscrazy.co.uk/?s=${encodeURIComponent(name)}&post_type=product`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const firstProductHref = await page.evaluate(() => {
      const el = document.querySelector('.product a.woocommerce-LoopProduct-link') || document.querySelector('.product a');
      return el ? el.href : null;
    });

    if (!firstProductHref) return null;

    await page.goto(firstProductHref, { waitUntil: 'domcontentloaded', timeout: 10000 });

    const details = await page.evaluate(() => {
      const image = document.querySelector('.woocommerce-product-gallery__image a')?.href 
                 || document.querySelector('.wp-post-image')?.src 
                 || document.querySelector('img')?.src;
      
      let brand = '';
      const tags = document.querySelectorAll('.posted_in a');
      tags.forEach(el => {
        const text = el.innerText.trim();
        if (!text.toLowerCase().includes('firework')) {
          brand = text;
        }
      });
      if (!brand) {
        brand = document.querySelector('.brand-link')?.innerText?.trim() || '';
      }

      let video = document.querySelector('.video-container iframe')?.src;
      if (!video) {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const yt = iframes.find(el => el.src?.includes('youtube.com'));
        if (yt) video = yt.src;
      }

      return { image, brand, video };
    });

    return { ...details, productUrl: firstProductHref };
  } catch (err) {
    console.error(`Error scraping ${name}: ${err.message}`);
    return null;
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  let missing = products.filter(p => !p.image);
  console.log(`Found ${missing.length} products missing images.`);

  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    
    let searchName = p.name;
    const n = p.name.toLowerCase();
    if (n.includes('peking opera')) searchName = 'Peking Opera';
    else if (n.includes('bloodshot')) searchName = 'Bloodshot';
    else if (n.includes('delirious')) searchName = 'Delirious';
    else if (n.includes('scatterbrain')) searchName = 'Scatterbrain';
    else if (n.includes('fire flash')) searchName = 'Fireflash';
    else if (n.includes('jeopardy')) searchName = 'Jeopardy';
    else if (n.includes('vsr2')) searchName = 'VSR2';
    else if (n.includes('gold fever')) searchName = 'Gold Fever';
    else if (n.includes('sky candy')) searchName = 'Sky Candy';
    else if (n.includes('wtf 512')) searchName = 'WTF 512';
    else if (n.includes('zeigelstein') || n.includes('ziegelstein')) searchName = 'Ziegelstein';
    else if (n.includes('breakout')) searchName = 'Breakout';
    else if (n.includes('wtf mini')) searchName = 'WTF';
    else if (n.includes('professor x')) searchName = 'Professor X';
    else if (n.includes('loose cannon')) searchName = 'Loose Cannon';
    else if (n.includes('sky vandal')) searchName = 'Sky Vandal';
    else if (n.includes('reapers')) searchName = 'Reapers';
    else if (n.includes('cataclysm')) searchName = 'Cataclysm';
    else if (n.includes('snake bite')) searchName = 'Snake Bite';
    else if (n.includes('face off')) searchName = 'Face Off';
    else if (n.includes('asylum')) searchName = 'Asylum';
    else if (n.includes('screaming banshee')) searchName = 'Screaming Banshee';
    else if (n.includes('screaming demons')) searchName = 'Screaming Demons';
    else if (n.includes('f2 ultra pro')) searchName = 'Ultra Pro';
    else if (n.includes('freak')) searchName = 'Freak';
    else if (n.includes('phoenix')) searchName = 'Phoenix';
    else if (n.includes('kamuro rainbow')) searchName = 'Kamuro Rainbow';
    else if (n.includes('laughing gas')) searchName = 'Laughing Gas';
    else if (n.includes('delirium')) searchName = 'Delirium';
    else if (n.includes('straight up crazy')) searchName = 'Straight Up Crazy';
    else if (n.includes('vibe')) searchName = 'Vibe';
    else if (n.includes('wizard wands')) searchName = 'Wizard Wands';
    else if (n.includes('anti-venom')) searchName = 'Anti Venom';
    else if (n.includes('venom')) searchName = 'Venom Vivid'; // "Venom" might match too many things
    else if (n.includes('terminal velocity')) searchName = 'Terminal Velocity';
    else if (n.includes('velocity')) searchName = 'Velocity Compound';
    else searchName = p.name.split('-')[0].replace(/[^\w\s]/gi, ' ').trim().split(' ').slice(0, 3).join(' ');

    console.log(`\n[${i+1}/${missing.length}] Searching for: ${searchName} (Original: ${p.name})`);
    
    const details = await scrapeDetails(page, searchName);
    if (details && details.image) {
      console.log(`Found! Brand: ${details.brand}, Image: ${details.image.substring(0,50)}...`);
      p.image = details.image;
      if (details.brand && !p.brand) p.brand = details.brand;
      if (details.video) p.video = details.video;
      p.url = details.productUrl;
      
      if (!p.tags) p.tags = [];
      if (!p.tags.includes('NEW IN')) p.tags.push('NEW IN');
    } else {
      console.log(`Not found.`);
    }
    
    fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
  }
  
  await browser.close();
  console.log('Saved to products.json');
}

main();
