import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function UserProfile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (authLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Should be handled by layout/guard
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Update in Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      
      <CardContent>
        {message.text && (
          <div className={`p-3 mb-6 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" value={user.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Account Role</label>
            <Input type="text" value={user.role} disabled className="bg-muted capitalize" />
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-border mt-6">
            <Button type="submit" disabled={saving || displayName === user.displayName}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button type="button" variant="destructive" onClick={() => {
              signOut().then(() => window.location.href = '/');
            }}>
              Log Out
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
