import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DB_PATH = 'web/src/data/products.json';
const products = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Only process items without specs or those we haven't done yet.
// Wait, we can test with just one first to ensure duckduckgo scraping works.
async function getProductUrl(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=site:fireworkscrazy.co.uk+${encodeURIComponent(query)}`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        const $ = cheerio.load(res.data);
        const firstLink = $('a.result__url').first().attr('href');
        return firstLink;
    } catch {
        return null;
    }
}

async function scrapeDuckDuckGo() {
    const link = await getProductUrl("EL LOCO");
    console.log("DuckDuckGo found:", link);
}

scrapeDuckDuckGo();
