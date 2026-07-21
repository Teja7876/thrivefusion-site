import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';

const AdminLayoutInner = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex flex-1 items-center justify-between py-4">
          <h1 className="text-xl font-semibold">ThriveFusion Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as {user.displayName}</span>
            <Button variant="outline" size="sm" onClick={() => {
              signOut().then(() => window.location.href = '/');
            }}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
