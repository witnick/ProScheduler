import { createClient } from '@supabase/supabase-js'

export const supabaseConfig= {
    supabaseUrl : process.env.SUPABASE_URL!,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!
};
// console.log(supabaseConfig);
// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
