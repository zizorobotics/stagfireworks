import fs from 'fs';

const cssPath = './src/index.css';
let content = fs.readFileSync(cssPath, 'utf8');

// The desktop rules
const desktopRules = `
.giant-sale-badge {
  position: absolute;
  top: 1rem;
  left: 3rem;
  z-index: 10;
}
.giant-sale-text-up {
  display: block; 
  font-size: 2rem; 
  color: #ffff00; 
  font-weight: 900; 
  margin-left: 0.5rem; 
  margin-bottom: -1rem; 
  position: relative; 
  z-index: 2; 
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
}
.giant-sale-text-50 {
  font-size: clamp(5rem, 10vw, 8rem); 
  font-weight: 900; 
  color: var(--accent-magenta); 
  -webkit-text-stroke: 3px #ffff00; 
  line-height: 1; 
  display: inline-block; 
  position: relative;
}
.giant-sale-text-off {
  display: block; 
  font-size: 2rem; 
  color: #ffff00; 
  font-weight: 900; 
  margin-left: 1rem; 
  margin-top: -1rem; 
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
}
`;

// Remove the desktop rules from wherever they are
content = content.replace(desktopRules.trim(), '');
content = content.replace('.giant-sale-badge {\\n  position: absolute;\\n  top: 1rem;\\n  left: 3rem;\\n  z-index: 10;\\n}\\n.giant-sale-text-up {\\n  display: block; \\n  font-size: 2rem; \\n  color: #ffff00; \\n  font-weight: 900; \\n  margin-left: 0.5rem; \\n  margin-bottom: -1rem; \\n  position: relative; \\n  z-index: 2; \\n  text-shadow: 0 0 10px rgba(0,0,0,0.5);\\n}\\n.giant-sale-text-50 {\\n  font-size: clamp(5rem, 10vw, 8rem); \\n  font-weight: 900; \\n  color: var(--accent-magenta); \\n  -webkit-text-stroke: 3px #ffff00; \\n  line-height: 1; \\n  display: inline-block; \\n  position: relative;\\n}\\n.giant-sale-text-off {\\n  display: block; \\n  font-size: 2rem; \\n  color: #ffff00; \\n  font-weight: 900; \\n  margin-left: 1rem; \\n  margin-top: -1rem; \\n  text-shadow: 0 0 10px rgba(0,0,0,0.5);\\n}\\n', '');

// Also manually remove it by splitting if replace didn't work perfectly
const lines = content.split('\\n');
const cleanLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('.giant-sale-badge {') && lines[i+1] && lines[i+1].includes('position: absolute;')) {
        skip = true;
    }
    if (skip && lines[i] === '}') {
        skip = false;
        continue;
    }
    if (!skip && !lines[i].startsWith('.giant-sale-text-')) {
        cleanLines.push(lines[i]);
    } else if (lines[i].startsWith('.giant-sale-text-')) {
        // Skip the text rule blocks
        skip = true;
    }
}

// Ensure clean content
content = content.substring(0, content.indexOf('.giant-sale-badge {\\n  position: absolute;'));
if (content === '') {
  // Fallback if indexOf failed
  content = fs.readFileSync(cssPath, 'utf8');
  content = content.split('.giant-sale-badge {\\n  position: absolute;')[0];
}

// Now insert the desktop rules right before the media query
const mediaQueryIndex = content.indexOf('/* Mobile Optimizations */\\n@media');
if (mediaQueryIndex !== -1) {
    const finalContent = content.substring(0, mediaQueryIndex) + desktopRules + '\\n\\n' + content.substring(mediaQueryIndex);
    fs.writeFileSync(cssPath, finalContent, 'utf8');
    console.log("Successfully reordered CSS rules!");
} else {
    console.log("Could not find media query.");
}
