'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // eslint-disable-next-line no-console
    console.debug('Auth form submission:', { email, password: password ? '***' : '', isSignUp });

    try {
      if (isSignUp) {
        // eslint-disable-next-line no-console
        console.debug('Calling supabase.auth.signUp with:', { email, password: '***' });
        const res = await supabase.auth.signUp({ email, password });
        // Dev debug: log raw response so we can inspect server error payloads
        // eslint-disable-next-line no-console
        console.debug('supabase signUp response', res);
        const { error } = res;
        if (error) throw error;
      } else {
        // eslint-disable-next-line no-console
        console.debug('Calling supabase.auth.signInWithPassword with:', { email, password: '***' });
        const res = await supabase.auth.signInWithPassword({ email, password });
        // Dev debug: log raw response so we can inspect server error payloads
        // eslint-disable-next-line no-console
        console.debug('supabase signIn response', res);
        const { error } = res;
        if (error) throw error;
      }
      router.push('/');
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Auth error caught:', error);
      
      // Network errors (e.g. DNS failure) can surface as a generic TypeError: Failed to fetch.
      // Provide a clearer, actionable message for developers.
      if (error instanceof TypeError && /failed to fetch/i.test(error.message)) {
        setError(
          'Network request failed. Check your NEXT_PUBLIC_SUPABASE_URL in .env.local and ensure your dev server has DNS/network access to the Supabase project domain.'
        );
      } else {
        // Show the exact error message from Supabase
        const errorMessage = error.message ?? String(error);
        // eslint-disable-next-line no-console
        console.error('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p className="text-center mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 ml-2 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
