import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw Error("Supabase URL not found in environment");
}

if (!supabaseAnonKey) {
    throw Error("Supabase Anon Key not found in environment");
}

console.log(supabaseUrl, supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };