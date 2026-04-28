import fs from 'fs';

const chatText = fs.readFileSync('chat_whatsapp_context.txt', 'utf-8');

// Regex to find youtube links
const ytRegex = /https:\/\/youtu\.be\/[a-zA-Z0-9_\-]+(\?si=[a-zA-Z0-9_\-]+)?/g;
let urls = [];
let match;
while ((match = ytRegex.exec(chatText)) !== null) {
  urls.push(match[0]);
}

// Remove duplicates
urls = [...new Set(urls)];

async function fetchTitle(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const titleMatch = text.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1] : null;
    if (title) {
      title = title.replace(' - YouTube', '').trim();
    }
    return title || 'Unknown Title';
  } catch (err) {
    return 'Unknown Title';
  }
}

async function main() {
  console.log(`Found ${urls.length} unique youtube URLs. Fetching titles...`);
  
  const videoData = [];
  
  // Fetch in parallel chunks of 5
  for (let i = 0; i < urls.length; i += 5) {
    const chunkUrls = urls.slice(i, i + 5);
    const chunkPromises = chunkUrls.map(async (url) => {
      const title = await fetchTitle(url);
      console.log(`Fetched: ${title}`);
      return { url, title, id: url.split('.be/')[1].split('?')[0] };
    });
    const results = await Promise.all(chunkPromises);
    videoData.push(...results);
  }
  
  // Basic parsing of products from text
  // The text interleaves youtube videos and product descriptions and photos.
  // We will output the list of extracted videos to video_data.json
  
  fs.writeFileSync('video_data.json', JSON.stringify(videoData, null, 2));
  console.log('Saved to video_data.json');
}

main();
