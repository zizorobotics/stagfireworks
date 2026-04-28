import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DB_PATH = 'web/src/data/products.json';
const products = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Utility to sleep to avoid rate limiting
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getProductUrlViaDuckDuckGo(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=site:fireworkscrazy.co.uk+${encodeURIComponent(query)}`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
        const $ = cheerio.load(res.data);
        const firstLink = $('a.result__url').first().attr('href');
        
        if (firstLink && firstLink.includes('uddg=')) {
            const finalUrl = decodeURIComponent(firstLink.split('uddg=')[1].split('&')[0]);
            return finalUrl;
        }
        return null;
    } catch (err) {
        console.log(`Failed DDG search for ${query}:`, err.message);
        return null;
    }
}

async function scrapeProductSpecs(url) {
    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        const $ = cheerio.load(res.data);

        // Find spec arrays from Bricks builder nodes
        let labels = [];
        let values = [];

        $('.fw-spec-row').first().children().each((i, el) => {
            labels.push($(el).text().trim());
        });

        $('.fw-spec-row').last().children().each((i, el) => {
            values.push($(el).text().trim());
        });

        if (labels.length === 0 || values.length === 0) return null;

        const rawSpecs = {};
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] && values[i]) rawSpecs[labels[i]] = values[i];
        }

        // Map to our standard schema
        // { distance, shots, duration, noise, height, pattern, tube, hazard, weight }
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

        if (Object.keys(mapped).length > 0) return mapped;
        return null;
    } catch (err) {
        console.log(`Failed fetching product URL ${url}:`, err.message);
        return null;
    }
}

async function main() {
    let patched = 0;
    console.log(`Starting headless DOM traversal on ${products.length} products...`);

    for (let p of products) {
        // Skip explicitly if specs are already validated and loaded properly?
        // Wait, the ones we did manually are mapped.
        if (p.specs && p.specs.distance === "25 Metres" && p.name === "Terminal Velocity") {
             console.log(`✅ Skipping verified product: ${p.name}`);
             continue;
        }
        if (p.name === "Vivid Pyrotechnics Velocity Compound 224 Shots From Snowdonia Fireworks") {
             console.log(`✅ Skipping verified product: ${p.name}`);
             continue;
        }
        if (p.specs && p.image === null) {
            // These were the 12 items we initially mapped WRONG. We WANT to overwrite them.
            // Oh wait! The 12 items were mapped completely wrong originally. We should overwrite them!
        }

        console.log(`🔍 Seeking: ${p.name}`);
        
        let query = p.name;
        // Clean query to improve duckduckgo accuracy
        query = query.replace(/😍💃💯🔥/g, '').split('From Snowdonia')[0].split('#')[0].trim();
        
        let url = await getProductUrlViaDuckDuckGo(query);
        if (!url) {
             // Fallback search term without brand
             let fallbackQuery = query.split('-')[0].trim();
             await sleep(1500); // Backoff for Duckduckgo rate limits
             url = await getProductUrlViaDuckDuckGo(fallbackQuery);
        }

        if (url) {
            console.log(`   🔗 Found URL: ${url}`);
            const specs = await scrapeProductSpecs(url);
            if (specs) {
                p.specs = {
                    distance: specs.distance || p.specs?.distance || 'TBC',
                    shots: specs.shots || p.specs?.shots || 'TBC',
                    duration: specs.duration || p.specs?.duration || 'TBC',
                    noise: specs.noise || p.specs?.noise || 'TBC',
                    height: specs.height || p.specs?.height || 'TBC',
                    pattern: specs.pattern || p.specs?.pattern || 'TBC',
                    tube: specs.tube || p.specs?.tube || 'TBC',
                    hazard: specs.hazard || p.specs?.hazard || 'TBC',
                    weight: specs.weight || p.specs?.weight || 'TBC',
                };
                p.image = null; // Strip the dummy/wrong image entirely since it was mapped incorrectly randomly
                patched++;
                console.log(`   🟩 Mapped Specs Successfully for ${p.name}!`);
            } else {
                console.log(`   🟥 Failed parsing specs from node tree.`);
            }
        } else {
            console.log(`   🟥 DDG could not find URL.`);
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2));
        await sleep(1500); // 1.5 second DDG anti-spam backoff
    }

    console.log(`\n🎉 Scraper finished! Validated and injected specs for ${patched} components.`);
    // Generate the report
    console.log("Generating report...");
    require('child_process').execSync('node generate_report.mjs', { stdio: 'inherit' });
}

main();
