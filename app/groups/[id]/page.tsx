'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Share2, Copy, QrCode, Settings, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/providers/auth-provider';
import { doc, getDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { openWhatsAppShare, generateGroupInviteMessage } from '@/lib/utils/whatsapp';
import QRCode from 'qrcode';

export default function GroupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!params.id || !user) return;

    const fetchGroupData = async () => {
      const groupDoc = await getDoc(doc(db, 'groups', params.id));
      if (!groupDoc.exists()) {
        setLoading(false);
        return;
      }

      const groupData = { id: groupDoc.id, ...groupDoc.data() };
      setGroup(groupData);

      const membersQuery = query(
        collection(db, 'users'),
        where('__name__', 'in', groupData.memberIds)
      );
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);

      const matchesQuery = query(
        collection(db, 'matches'),
        where('groupId', '==', params.id)
      );
      const matchesSnapshot = await getDocs(matchesQuery);
      const matchesData = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      const qr = await QRCode.toDataURL(groupData.inviteLink);
      setQrCode(qr);

      setLoading(false);
    };

    fetchGroupData();
  }, [params.id, user]);

  const handleCopyInvite = () => {
    if (group) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareGroup = () => {
    if (group) {
      const message = generateGroupInviteMessage(group);
      openWhatsAppShare(message);
    }
  };

  const isAdmin = group?.adminIds?.includes(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Group not found</p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={group.photoURL} />
                  <AvatarFallback>{group.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">{group.name}</h1>
                  <p className="text-sm text-gray-500">{members.length} members</p>
                </div>
              </div>
            </div>
            {isAdmin && (
              <Button onClick={() => router.push(`/groups/${group.id}/settings`)} variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {group.description && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">{group.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push(`/matches/create?group=${group.id}`)}
              className="h-24 bg-green-600 hover:bg-green-700"
            >
              <div className="text-center">
                <Plus className="h-6 w-6 mb-1 mx-auto" />
                <span>Create Match</span>
              </div>
            </Button>
            <Button 
              onClick={handleShareGroup}
              variant="outline"
              className="h-24"
            >
              <div className="text-center">
                <Share2 className="h-6 w-6 mb-1 mx-auto" />
                <span>Share Group</span>
              </div>
            </Button>
            <Button 
              onClick={handleCopyInvite}
              variant="outline"
              className="h-24"
            >
              <div className="text-center">
                <Copy className="h-6 w-6 mb-1 mx-auto" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                <p className="text-xs mt-1 font-mono">{group.inviteCode}</p>
              </div>
            </Button>
          </div>

          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invite">Invite</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4">
              {matches.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No matches yet</p>
                    <Button onClick={() => router.push(`/matches/create?group=${group.id}`)}>
                      Create First Match
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                matches.map(match => (
                  <Card 
                    key={match.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/matches/${match.id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{match.title || `${match.format} Match`}</h3>
                          <p className="text-gray-600">{format(new Date(match.date), 'EEEE, dd MMM yyyy')}</p>
                          <p className="text-sm text-gray-500">{match.venue}</p>
                        </div>
                        <Badge variant={match.status === 'upcoming' ? 'default' : 'secondary'}>
                          {match.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>{Object.values(match.rsvps || {}).filter((s: any) => s === 'going').length} going</span>
                        <span>{Object.values(match.rsvps || {}).filter((s: any) => s === 'maybe').length} maybe</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="grid gap-3">
                {members.map(member => (
                  <Card key={member.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.photoURL} />
                            <AvatarFallback>{member.displayName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.displayName}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {member.role}
                              </Badge>
                              <span>Rating: {member.rating}</span>
                            </div>
                          </div>
                        </div>
                        {group.adminIds.includes(member.id) && (
                          <Badge>Admin</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="invite" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Share this code:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg text-lg font-mono text-center">
                        {group.inviteCode}
                      </code>
                      <Button onClick={handleCopyInvite} variant="outline">
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Or scan this QR code:</p>
                    {qrCode && (
                      <img src={qrCode} alt="Group QR Code" className="mx-auto" />
                    )}
                  </div>

                  <Button onClick={handleShareGroup} className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}