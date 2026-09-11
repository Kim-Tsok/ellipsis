'use client';

import { signOut } from '@/lib/auth/auth-client';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { useRouter } from 'next/navigation';

export default function AppPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12">
      <h1 className="font-instrument-serif text-3xl text-[#1a1a1a] mb-6">
        Welcome to Ellipsis
      </h1>
      <ButtonPrimary onClick={handleLogout} className="mt-6">
        Logout
      </ButtonPrimary>
    </div>
  );
}
