import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase Server-side credentials missing. API Engine will not function.');
}

export const supabaseServer = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            fetch: (url, options = {}) => {
                return fetch(url, { ...options, cache: 'no-store' });
            }
        }
    }
);
