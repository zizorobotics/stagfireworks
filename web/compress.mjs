import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/animation/new_withtext';
const outputDir = './public/animation/compressed_webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} images to compress. Starting...`);

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));
    
    // Resize down by 50% maybe? If they are 1920x1080, we can make them 1280x720 or 960x540 for the scroll animation
    // But let's just compress them to webp first with quality 40 to see the size drop.
    await sharp(inputPath)
      .resize(1280) // Scale to 720p width
      .webp({ quality: 30, effort: 6 })
      .toFile(outputPath);
      
    process.stdout.write(`.`);
  }
  console.log('\nDone compressing!');
}

processImages();
