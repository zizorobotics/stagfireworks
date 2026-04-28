import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('venom_html.txt', 'utf8');
const $ = cheerio.load(html);

console.log('Tables:');
$('table').each((i, el) => {
    console.log(`Table ${i}:`, $(el).text().substring(0, 500));
});

console.log('\nDivs with specs or table-like info:');
$('.woocommerce-product-attributes, .fw-spec-row, #tab-additional_information').each((i, el) => {
    console.log(`Info ${i}:`, $(el).text().substring(0, 500));
});

console.log('\nProduct description:');
console.log($('.woocommerce-product-details__short-description').text().substring(0, 500));

console.log('\nJSON-LD:');
$('script[type="application/ld+json"]').each((i, el) => {
    const data = JSON.parse($(el).html());
    if (data['@type'] === 'Product') {
        console.log(JSON.stringify(data, null, 2).substring(0, 500));
    }
});
