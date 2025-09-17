'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Flashcard Frenzy
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/history" className="hover:underline">
                History
              </Link>
              <span>{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
