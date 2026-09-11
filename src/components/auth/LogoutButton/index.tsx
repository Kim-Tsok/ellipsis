'use client';

import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@/lib/auth/constants/auth';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = AUTH_ROUTES.LOGIN;
        },
      },
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost" // Or another passing variant
      className={`flex items-center gap-2 ${className || ''}`}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </>
      )}
    </Button>
  );
};
