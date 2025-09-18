// config/supabaseClient.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ quiet: true });
console.log(process.env.SUPABASE_URL);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
