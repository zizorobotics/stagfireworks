import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

const dir = '../fireworks_data/new_fireworks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

async function processImages() {
  console.log(`Processing ${files.length} images...`);
  const worker = await Tesseract.createWorker('eng');
  
  const results = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      console.log(`OCR on ${file}...`);
      const { data: { text } } = await worker.recognize(fullPath);
      results.push({ file, text });
      console.log(`Extracted text length: ${text.length}`);
    } catch (err) {
      console.error(`Failed OCR on ${file}: ${err.message}`);
    }
  }
  
  await worker.terminate();
  fs.writeFileSync('ocr_results.json', JSON.stringify(results, null, 2));
  console.log('Saved to ocr_results.json');
}

processImages();
