import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
    console.log('Checking account for bcvbvcbcvbcv4@gmail.com...');
    const { data: user, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', 'bcvbvcbcvbcv4@gmail.com')
        .single();

    if (error) {
        console.error('Error fetching user:', error);
    } else {
        console.log('User found:', JSON.stringify(user, null, 2));
    }
}

checkUser();
