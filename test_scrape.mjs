import axios from 'axios';
import fs from 'fs';

async function test_scrape_product() {
  try {
    const url = 'https://fireworkscrazy.co.uk/product/venom/';
    const html = await axios.get(url);
    fs.writeFileSync('venom_html.txt', html.data);
    console.log('Saved venom_html.txt');
  } catch (err) {
    console.log('Error fetching Venom:', err.message);
  }
}

test_scrape_product();
