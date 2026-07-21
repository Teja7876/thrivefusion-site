import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';

const GuestGuardInner = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/admin'; // Redirect authenticated users away
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GuestGuardInner>{children}</GuestGuardInner>
    </AuthProvider>
  );
}
