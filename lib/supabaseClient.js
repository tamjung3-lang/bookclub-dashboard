import { createClient } from '@supabase/supabase-js';

// .env.local 파일에 저장한 Supabase 주소와 키를 불러옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase와 연결하는 객체를 만듭니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);