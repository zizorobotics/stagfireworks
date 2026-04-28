import axios from 'axios';
import * as cheerio from 'cheerio';

async function testShop() {
    const url = 'https://www.fireworksshop.uk.com/search?q=venom&type=product';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        $('a.grid-view-item__link').each((i, el) => {
            console.log('Found:', $(el).attr('href'));
        });
    } catch(err) {
        console.log(err.message);
    }
}
testShop();
