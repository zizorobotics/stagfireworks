import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxrjbhfcxuvrctpnhoxm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    console.log("Starting Migration to Supabase...");
    const productsPath = 'web/src/data/products.json';
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    let successCount = 0;
    
    // Clear out any existing if needed (optional)
    const { error: deleteErr } = await supabase.from('products').delete().neq('id', '0');
    if (deleteErr) console.log("Delete err (if any):", deleteErr.message);

    for (let p of products) {
        // Map data safely
        const { error } = await supabase.from('products').insert([
            {
                id: p.id,
                name: p.name,
                videoUrl: p.videoUrl,
                videoId: p.videoId,
                image: p.image,
                description: p.description,
                linked_video: p.linked_video,
                category: p.category,
                specs: p.specs
            }
        ]);
        
        if (error) {
            console.error(`Failed to push ${p.name}:`, error.message);
        } else {
            successCount++;
            console.log(`✅ Pushed ${p.name}`);
        }
    }
    
    console.log(`Migration Complete! Successfully pushed ${successCount} items to Supabase.`);
}

runMigration();
