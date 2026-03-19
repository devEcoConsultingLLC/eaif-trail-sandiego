import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ypqxplnatfnrcooufpax.supabase.co"
const supabaseAnonKey = "sb_publishable_7XraCmzjuLKGXFr3thRAGQ_v3ezdeUZ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
