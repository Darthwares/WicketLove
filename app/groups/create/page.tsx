'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/components/providers/auth-provider';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { nanoid } from 'nanoid';

export default function CreateGroup() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photoURL: '',
    isPrivate: false,
    autoBalance: true,
    captainRotation: true,
  });

  const generateInviteCode = () => nanoid(8).toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      const groupData = {
        ...formData,
        adminIds: [user.id],
        memberIds: [user.id],
        inviteCode,
        inviteLink: `${window.location.origin}/groups/join?code=${inviteCode}`,
        settings: {
          isPrivate: formData.isPrivate,
          autoBalance: formData.autoBalance,
          captainRotation: formData.captainRotation,
        },
        createdAt: new Date(),
        createdBy: user.id,
      };

      const docRef = await addDoc(collection(db, 'groups'), groupData);
      router.push(`/groups/${docRef.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
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
            <h1 className="text-xl font-semibold">Create New Group</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    placeholder="Weekend Warriors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your cricket group..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Group Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {formData.photoURL ? (
                        <img src={formData.photoURL} alt="Group" className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Upload Photo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Group Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="private">Private Group</Label>
                      <p className="text-sm text-gray-500">Only invited members can join</p>
                    </div>
                    <Switch
                      id="private"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBalance">Auto-Balance Teams</Label>
                      <p className="text-sm text-gray-500">Automatically create balanced teams</p>
                    </div>
                    <Switch
                      id="autoBalance"
                      checked={formData.autoBalance}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoBalance: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="captainRotation">Captain Rotation</Label>
                      <p className="text-sm text-gray-500">Rotate captains automatically</p>
                    </div>
                    <Switch
                      id="captainRotation"
                      checked={formData.captainRotation}
                      onCheckedChange={(checked) => setFormData({ ...formData, captainRotation: checked })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Create Group'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}