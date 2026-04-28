import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  const html = await axios.get('https://fireworkscrazy.co.uk/?s=velocity&post_type=product');
  const $ = cheerio.load(html.data);
  const link = $('a.woocommerce-LoopProduct-link').first().attr('href');
  console.log('Product link:', link);
  if (link) {
    const productHtml = await axios.get(link);
    const $p = cheerio.load(productHtml.data);
    
    // Attempt to discover the specs table.
    // Usually it's in a table, like `.woocommerce-product-attributes` or similar
    console.log('Table html:');
    console.log($p('table.woocommerce-product-attributes').html() || 'No .woocommerce-product-attributes table');
    console.log('\nOther tables:');
    $p('table').each((i, el) => {
        console.log($p(el).html().substring(0, 500));
    });
  }
}

test();
