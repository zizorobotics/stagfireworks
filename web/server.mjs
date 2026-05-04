import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8080;
const PUBLIC_DIR = './';
const FIREWORKS_DIR = '../../fireworks_data/new_fireworks';

const mimeTypes = {
  '.html': 'text/html',
  '.json': 'application/json',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('gallery.html'));
  } else if (req.url === '/images_list.json') {
    const files = fs.readdirSync(FIREWORKS_DIR).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files));
  } else if (req.url.startsWith('/new_fireworks/')) {
    const file = req.url.replace('/new_fireworks/', '');
    const p = path.join(FIREWORKS_DIR, decodeURIComponent(file));
    if (fs.existsSync(p)) {
      const ext = path.extname(p).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(p));
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
