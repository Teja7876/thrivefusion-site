import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthGuardInner = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuardInner>{children}</AuthGuardInner>
    </AuthProvider>
  );
}
