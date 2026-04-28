import fs from 'fs';
const cssPath = './src/index.css';
let content = fs.readFileSync(cssPath);

// The corrupted UTF-16LE content was appended at the end.
// Let's just truncate the file up to the end of .order-summary-scroll::-webkit-scrollbar { display: none; }
const validEndString = ".order-summary-scroll::-webkit-scrollbar {\n  display: none;\n}\n";

// Convert buffer to string to find the valid part
let contentStr = content.toString('utf-8');
const validIndex = contentStr.indexOf(validEndString);

if (validIndex !== -1) {
    const cleanContent = contentStr.substring(0, validIndex + validEndString.length);
    fs.writeFileSync(cssPath, cleanContent, 'utf-8');
    
    // Now safely append the mobile CSS using standard UTF-8
    const mobileCSS = `
/* Mobile Optimizations */
@media (max-width: 768px) {
  .navbar {
    padding: 0.6rem 1rem;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .nav-brand {
    font-size: 1.2rem;
  }
  
  .hero-title {
    font-size: clamp(3rem, 12vw, 10rem);
    line-height: 1;
  }
  
  .hero-subtitle {
    font-size: clamp(2rem, 10vw, 7rem);
    margin-bottom: 1rem;
  }
  
  .hero-desc {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  
  .hero-scroll-wrapper {
    height: 150vh;
  }
  
  .hero {
    padding: 8rem 1rem 2rem 1rem;
  }
  
  .firework-animation-container canvas {
    width: 100vw;
    height: auto;
    object-fit: contain;
  }
}
`;
    fs.appendFileSync(cssPath, mobileCSS, 'utf-8');
    console.log("Fixed index.css encoding and appended mobile CSS properly.");
} else {
    console.log("Could not find the valid end string.");
}
