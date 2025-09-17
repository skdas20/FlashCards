import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// eslint-disable-next-line no-console
console.debug('Supabase config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast during development with a clear message so the developer can fix .env.local
  // Avoid throwing in production runtime where server envs might be loaded differently.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
        'Set these values in .env.local using your Supabase project URL and anon key, then restart the dev server.'
    );
  }
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

// Test connection
if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  supabase.auth.getSession().then(({ data, error }) => {
    // eslint-disable-next-line no-console
    console.debug('Supabase auth session test:', { data: data?.session?.user?.id || 'no user', error });
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Supabase connection test failed:', err);
  });
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
