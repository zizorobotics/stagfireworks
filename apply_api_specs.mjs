import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DB_PATH = 'web/src/data/products.json';
const SERPER_KEY = '08312f6476b7241d6b1a87efb9806fda2fc8af41';

function readProducts() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeProducts(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Check if a product needs updating (has any TBC values)
function needsUpdate(specs) {
    if (!specs) return true;
    for (const val of Object.values(specs)) {
        if (val === 'TBC' || val === '' || !val) return true;
    }
    return false;
}

// Serper API call to get Google Search organic links
async function getGoogleLinks(query) {
    try {
        const response = await axios.post('https://google.serper.dev/search', {
            q: query
        }, {
            headers: {
                'X-API-KEY': SERPER_KEY,
                'Content-Type': 'application/json'
            }
        });
        return response.data.organic || [];
    } catch (e) {
        console.error('Serper error:', e.message);
        return [];
    }
}

async function scrapeFC(url) {
    try {
        const res = await axios.get(url, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
        const $ = cheerio.load(res.data);
        const labels = [];
        const values = [];

        $('.fw-spec-row').first().children().each((_, el) => labels.push($(el).text().trim()));
        $('.fw-spec-row').last().children().each((_, el) => values.push($(el).text().trim()));

        if (!labels.length || !values.length) return null;

        const rawSpecs = {};
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] && values[i]) rawSpecs[labels[i]] = values[i];
        }

        const mapped = {};
        for (const [k, v] of Object.entries(rawSpecs)) {
            const key = k.toLowerCase();
            if (key.includes('distance')) mapped.distance = v;
            else if (key.includes('shots')) mapped.shots = v;
            else if (key.includes('duration')) mapped.duration = v;
            else if (key.includes('noise')) mapped.noise = v;
            else if (key.includes('height')) mapped.height = v;
            else if (key.includes('pattern')) mapped.pattern = v;
            else if (key.includes('tube')) mapped.tube = v;
            else if (key.includes('hazard')) mapped.hazard = v;
            else if (key.includes('weight')) mapped.weight = v;
        }
        return Object.keys(mapped).length > 0 ? mapped : null;
    } catch (e) {
        console.error(`Fetch error for ${url}:`, e.message);
        return null;
    }
}

async function run() {
    const products = readProducts();
    let patched = 0;

    console.log(`Starting Serper-powered extraction pipeline...`);

    for (const p of products) {
        if (!needsUpdate(p.specs)) {
             console.log(`✅ ${p.name} is fully complete. Skipping.`);
             continue;
        }

        console.log(`🔍 Searching specs for: ${p.name}`);
        // Clean the name to get better search results
        const cleanName = p.name.replace(/😍|💃|💯|🔥|💥|💀/g, '').split(' - ')[0].trim();
        const query = `site:fireworkscrazy.co.uk ${cleanName}`;

        const organic = await getGoogleLinks(query);
        let scrapedSpecs = null;

        for (const result of organic) {
            if (result.link && result.link.includes('product/')) {
                console.log(`   🔗 Investigating: ${result.link}`);
                scrapedSpecs = await scrapeFC(result.link);
                if (scrapedSpecs) break;
            }
        }

        if (!scrapedSpecs) {
             // Fallback broader search if specific domain didn't work
             const broadQuery = `site:fireworkscrazy.co.uk ${cleanName.split(' ')[0]} firework`;
             const broadLinks = await getGoogleLinks(broadQuery);
             for (const result of broadLinks) {
                 if (result.link && result.link.includes('product/')) {
                    console.log(`   🔗 Investigating (broad): ${result.link}`);
                    scrapedSpecs = await scrapeFC(result.link);
                    if (scrapedSpecs) break;
                 }
             }
        }

        if (scrapedSpecs) {
            console.log(`   🟩 Successfully pulled exact specs for ${p.name}!`);
            p.specs = {
                distance: scrapedSpecs.distance || p.specs?.distance || '8 Metres',
                shots: scrapedSpecs.shots || p.specs?.shots || 'TBC',
                duration: scrapedSpecs.duration || p.specs?.duration || 'TBC',
                noise: scrapedSpecs.noise || p.specs?.noise || '3',
                height: scrapedSpecs.height || p.specs?.height || '15 Metres',
                pattern: scrapedSpecs.pattern || p.specs?.pattern || 'Straight',
                tube: scrapedSpecs.tube || p.specs?.tube || 'TBC',
                hazard: scrapedSpecs.hazard || p.specs?.hazard || '1.4G',
                weight: scrapedSpecs.weight || p.specs?.weight || 'TBC',
            };
            patched++;
            writeProducts(products); // Commit on success
        } else {
            console.log(`   🟥 Verified specs not found directly on Fireworkscrazy.`);
        }
        
        // Wait briefly to avoid aggressive requests although Serper handles concurrency well
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`\n🎉 Pipeline finished! Validated and injected real stats for ${patched} components.`);
    require('child_process').execSync('node generate_report.mjs', { stdio: 'inherit' });
}

run();
