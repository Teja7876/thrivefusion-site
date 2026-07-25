import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';

const AdminLayoutInner = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>;
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="max-w-md w-full rounded-2xl bg-card p-8 shadow-lg text-center border border-border">
          <h2 className="text-2xl font-bold text-destructive mb-2">Admin Authorization Required</h2>
          <p className="text-muted-foreground mb-6">
            Your account ({user.email}) does not have administrative privileges to manage blogs or access the dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/profile'}>
              Go to Profile
            </Button>
            <Button variant="destructive" onClick={() => logout().then(() => window.location.href = '/')}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
        <div className="flex flex-1 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <a href="/admin" className="text-xl font-bold text-primary">ThriveFusion Admin</a>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Administrator</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Logged in as {user.displayName}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
              Profile
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              logout().then(() => window.location.href = '/');
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
