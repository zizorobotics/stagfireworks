import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('venom_html.txt', 'utf8');
const $ = cheerio.load(html);

// Find the labels
const labels = [];
$('.brxe-container.fw-spec-row').first().children().each((i, el) => {
    labels.push($(el).text().trim());
});
console.log("Labels:", labels);

// Find the values
const values = [];
$('.brxe-container.fw-spec-row').last().children().each((i, el) => {
    values.push($(el).text().trim());
});
console.log("Values:", values);

const specs = {};
for (let i = 0; i < labels.length; i++) {
    specs[labels[i]] = values[i] || '';
}
console.log("Specs:", specs);
