// DEPLOY_TRIGGER_AUTO_UPDATE_V1
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabaseServer } from '@/lib/supabaseServer';
import { dictionaries, Language } from '@/lib/i18n';
import HomeClient from '@/components/landing/HomeClient';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('relay_session')?.value;
  const langCookie = cookieStore.get('relay-lang')?.value as Language | undefined;

  let initialUser = null;
  let initialLang: Language = langCookie || 'en';

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Fast DB check for profile data
      const { data: userData } = await supabaseServer
        .from('accounts')
        .select('full_name, email, avatar_url, company, plan')
        .eq('id', decoded.id)
        .single();

      if (userData) {
        initialUser = {
          id: decoded.id,
          email: userData.email || decoded.email,
          name: userData.full_name || decoded.name,
          full_name: userData.full_name || decoded.name,
          company: userData.company,
          avatar_url: userData.avatar_url,
          plan: (userData.plan || 'free').toUpperCase()
        };
      }
    } catch (err) {
      // Invalid token, treat as guest
    }
  }

  return (
    <HomeClient
      initialUser={initialUser}
      initialLang={initialLang}
    />
  );
}
