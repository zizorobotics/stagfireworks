import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxrjbhfcxuvrctpnhoxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cmpiaGZjeHV2cmN0cG5ob3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTA1NTYsImV4cCI6MjA5MjE4NjU1Nn0.3V_Cpoji8_jtwpP3hRG0whdMf0xVy1_jGVa4gEGylc0';

export const supabase = createClient(supabaseUrl, supabaseKey);
