'use client';

import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In / Sign Up</h1>
        <AuthForm />
      </div>
    </div>
  );
}
