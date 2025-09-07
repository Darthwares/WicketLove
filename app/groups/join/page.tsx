'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/auth-provider';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function JoinGroup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode) return;

    setLoading(true);
    setError('');

    try {
      const groupsQuery = query(
        collection(db, 'groups'),
        where('inviteCode', '==', inviteCode.toUpperCase())
      );
      const querySnapshot = await getDocs(groupsQuery);

      if (querySnapshot.empty) {
        setError('Invalid invite code. Please check and try again.');
        setLoading(false);
        return;
      }

      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();

      if (groupData.memberIds.includes(user.id)) {
        router.push(`/groups/${groupDoc.id}`);
        return;
      }

      await updateDoc(doc(db, 'groups', groupDoc.id), {
        memberIds: arrayUnion(user.id),
      });

      router.push(`/groups/${groupDoc.id}`);
    } catch (error) {
      console.error('Error joining group:', error);
      setError('Failed to join group. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Join Group</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enter Invite Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Invite Code</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="code"
                      placeholder="Enter 8-character code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className="pl-10 uppercase"
                      maxLength={8}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Ask your group admin for the invite code
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || inviteCode.length < 8}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Join Group'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Don't have a group yet?</p>
            <Button
              onClick={() => router.push('/groups/create')}
              variant="outline"
              className="w-full"
            >
              Create New Group
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}