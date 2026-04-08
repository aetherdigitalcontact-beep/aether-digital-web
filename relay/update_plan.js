import { supabaseServer } from './src/lib/supabaseServer.js';
import dotenv from 'dotenv';
dotenv.config();

async function updateSuperuser() {
    console.log('Updating superuser plan...');
    const { data, error } = await supabaseServer
        .from('accounts')
        .update({ plan: 'enterprise' })
        .eq('email', 'quiel.g538@gmail.com')
        .select();

    if (error) {
        console.error('Error updating plan:', error);
    } else {
        console.log('Successfully updated superuser:', data);
    }
}

updateSuperuser();
