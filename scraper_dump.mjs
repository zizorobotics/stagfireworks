import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('search_html.txt', 'utf8');
const $ = cheerio.load(html);

const links = new Set();
$('a').each((i, el) => {
  const href = $(el).attr('href');
  if (href && href.includes('product')) {
    links.add(href);
  }
});

console.log([...links].slice(0, 10).join('\n'));
