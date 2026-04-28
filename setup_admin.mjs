import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxrjbhfcxuvrctpnhoxm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false }});

async function createAdmin() {
    console.log("Setting up master admin user...");
    const { data: user, error } = await supabase.auth.admin.createUser({
        email: 'admin@stagfireworks.co.uk',
        password: 'HsA_s#29sPL',
        email_confirm: true
    });

    if (error) {
        console.error("Error creating user:", error);
    } else {
        console.log("Admin user created successfully:", user);
    }
}

createAdmin();
