import axios from 'axios';
async function test() {
    try {
        const res = await axios.get('https://www.fireworkscrazy.co.uk/product/el-loco-by-vivid-pyrotechnics/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
        console.log('Success! Length:', res.data.length);
    } catch (e) {
        console.log('Failed:', e.message);
    }
}
test();
