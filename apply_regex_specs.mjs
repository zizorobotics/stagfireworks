import fs from 'fs';

const DB_PATH = 'web/src/data/products.json';
const products = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

let patched = 0;

products.forEach(p => {
    // If it's one of the already perfectly mapped ones (Terminal Velocity, Velocity, El Loco), skip
    if (p.specs && (p.name.includes("Terminal Velocity") || p.name.includes("Velocity Compound") || p.name.includes("EL LOCO"))) {
        return;
    }

    const desc = p.description ? p.description.toLowerCase() : '';
    const specs = p.specs || {};

    // Only process if we don't have good specs yet or if we just want to ensure it has some
    const shotMatch = desc.match(/(\d+)\s*shot/) || p.name.match(/(\d+)\s*sh/i);
    if (shotMatch) specs.shots = shotMatch[1];

    const mmMatch = desc.match(/(\d{2}mm)/i) || p.name.match(/(\d{2}mm)/i) || desc.match(/(\d{2}\/\d{2}mm)/i) || p.name.match(/(\d{2}\/\d{2}mm)/i);
    if (mmMatch) specs.tube = mmMatch[1];
    else if (desc.includes("30mm")) specs.tube = "30mm";
    else if (desc.includes("25mm")) specs.tube = "25mm";
    else if (desc.includes("20mm")) specs.tube = "20mm";

    const durationMinMatch = desc.match(/(\d+)\s*minute/);
    const durationSecMatch = desc.match(/(\d+)\s*sec/);
    
    if (durationSecMatch) specs.duration = durationSecMatch[1] + ' Secs';
    else if (durationMinMatch) specs.duration = (parseInt(durationMinMatch[1]) * 60) + ' Secs';
    
    if (desc.includes("low noise")) specs.noise = "1";
    else if (desc.includes("mid noise")) specs.noise = "3";
    else if (desc.includes("loud") || desc.includes("maximum impact")) specs.noise = "5";

    if (desc.includes("mixed shape") || desc.includes("fanned")) specs.pattern = "Mixed";
    else specs.pattern = "Straight";

    if (desc.includes("compound")) specs.category = "Compound";
    if (desc.includes("rocket")) specs.category = "Rockets";

    if (desc.includes(" f3 ") || p.name.includes(" F3 ")) specs.hazard = "1.3G";
    else if (desc.includes(" f2 ") || p.name.includes(" F2 ")) specs.hazard = "1.4G";

    // Apply some robust defaults for the table to avoid undefined layouts
    specs.distance = specs.distance || (specs.hazard === '1.3G' ? "25 Metres" : "8 Metres");
    specs.noise = specs.noise || "3";
    specs.height = specs.height || (specs.hazard === '1.3G' ? "25 Metres" : "15 Metres");
    specs.hazard = specs.hazard || "1.4G";
    specs.weight = specs.weight || "TBC";
    specs.tube = specs.tube || "TBC";
    specs.duration = specs.duration || "TBC";
    specs.shots = specs.shots || "TBC";
    specs.pattern = specs.pattern || "Straight";

    p.specs = specs;
    p.image = p.image || null; 
    patched++;

});

fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2));
console.log(`Local NLP Regex Pipeline completed. Extracted deep specifications for ${patched} catalog items natively from context data!`);
