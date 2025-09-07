'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Check, X, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/providers/auth-provider';
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { openWhatsAppShare, generateMatchShareMessage } from '@/lib/utils/whatsapp';
import { balanceTeams } from '@/lib/utils/team-balance';

export default function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [match, setMatch] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [teams, setTeams] = useState<{ red: any[], blue: any[] }>({ red: [], blue: [] });
  const [matchId, setMatchId] = useState<string>('');

  useEffect(() => {
    params.then(p => setMatchId(p.id));
  }, [params]);

  useEffect(() => {
    if (!matchId || !user) return;

    const unsubscribe = onSnapshot(doc(db, 'matches', matchId), async (docSnap) => {
      if (docSnap.exists()) {
        const matchData = { id: docSnap.id, ...docSnap.data() } as any;
        setMatch(matchData);

        const groupDoc = await getDoc(doc(db, 'groups', matchData.groupId));
        if (groupDoc.exists()) {
          setGroup({ id: groupDoc.id, ...groupDoc.data() });
        }

        const playersQuery = query(
          collection(db, 'users'),
          where('__name__', 'in', Object.keys(matchData.rsvps || {}))
        );
        const playersSnapshot = await getDocs(playersQuery);
        const playersData = playersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlayers(playersData);

        const goingPlayers = playersData.filter((p: any) => matchData.rsvps?.[p.id] === 'going');
        if (goingPlayers.length >= matchData.minPlayers && group?.settings?.autoBalance) {
          const balanced = balanceTeams(goingPlayers as any);
          setTeams(balanced);
        }

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [matchId, user]);

  const handleRSVP = async (status: 'going' | 'maybe' | 'not-going') => {
    if (!user || !match) return;

    setRsvpLoading(true);
    try {
      await updateDoc(doc(db, 'matches', match.id), {
        [`rsvps.${user.id}`]: status,
      });
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
    setRsvpLoading(false);
  };

  const handleShare = () => {
    if (!match || !group) return;
    const message = generateMatchShareMessage(match, group.name);
    openWhatsAppShare(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Match not found</p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRSVP = match.rsvps?.[user?.id || ''];
  const goingCount = Object.values(match.rsvps || {}).filter((s: any) => s === 'going').length;
  const maybeCount = Object.values(match.rsvps || {}).filter((s: any) => s === 'maybe').length;
  const notGoingCount = Object.values(match.rsvps || {}).filter((s: any) => s === 'not-going').length;
  const isRSVPClosed = isPast(new Date(match.rsvpDeadline));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
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
              <h1 className="text-xl font-semibold">{match.title || 'Cricket Match'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{match.title || `${match.format} Match`}</CardTitle>
                <Badge variant={match.status === 'upcoming' ? 'default' : 'secondary'}>
                  {match.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(match.date), 'EEEE, dd MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(match.date), 'hh:mm a')}</span>
                    <Badge variant="outline" className="ml-2">
                      {formatDistanceToNow(new Date(match.date), { addSuffix: true })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Format:</span>
                    <Badge>{match.format} {match.overs && `(${match.overs} overs)`}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Ground:</span>
                    <Badge variant="outline">{match.groundType}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Ball:</span>
                    <Badge variant="outline">{match.ballType}</Badge>
                  </div>
                </div>
              </div>

              {!isRSVPClosed ? (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Your RSVP:</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRSVP('going')}
                      variant={userRSVP === 'going' ? 'default' : 'outline'}
                      disabled={rsvpLoading}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Going
                    </Button>
                    <Button
                      onClick={() => handleRSVP('maybe')}
                      variant={userRSVP === 'maybe' ? 'secondary' : 'outline'}
                      disabled={rsvpLoading}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Maybe
                    </Button>
                    <Button
                      onClick={() => handleRSVP('not-going')}
                      variant={userRSVP === 'not-going' ? 'destructive' : 'outline'}
                      disabled={rsvpLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Can't Make It
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    RSVP deadline: {format(new Date(match.rsvpDeadline), 'dd MMM, hh:mm a')}
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t">
                  <Badge variant="secondary">RSVP Closed</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Players ({goingCount + maybeCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rsvp" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rsvp">RSVPs</TabsTrigger>
                  <TabsTrigger value="teams" disabled={teams.red.length === 0}>
                    Teams
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="rsvp" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-primary mb-2">Going ({goingCount})</p>
                      <div className="flex flex-wrap gap-2">
                        {players
                          .filter(p => match.rsvps[p.id] === 'going')
                          .map(player => (
                            <div key={player.id} className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.photoURL} />
                                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{player.displayName}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-yellow-500 mb-2">Maybe ({maybeCount})</p>
                      <div className="flex flex-wrap gap-2">
                        {players
                          .filter(p => match.rsvps[p.id] === 'maybe')
                          .map(player => (
                            <div key={player.id} className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.photoURL} />
                                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{player.displayName}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-destructive mb-2">Not Going ({notGoingCount})</p>
                      <div className="flex flex-wrap gap-2">
                        {players
                          .filter(p => match.rsvps[p.id] === 'not-going')
                          .map(player => (
                            <div key={player.id} className="flex items-center gap-2 bg-destructive/10 px-3 py-1 rounded-full">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.photoURL} />
                                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{player.displayName}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="teams" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-chart-2">
                      <CardHeader className="bg-chart-2/10">
                        <CardTitle className="text-chart-2">Team A</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {teams.red.map((player, index) => (
                            <div key={player.id} className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={player.photoURL} />
                                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="flex-1">{player.displayName}</span>
                              {index === 0 && <Badge variant="secondary">Captain</Badge>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-3">
                      <CardHeader className="bg-chart-3/10">
                        <CardTitle className="text-chart-3">Team B</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {teams.blue.map((player, index) => (
                            <div key={player.id} className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={player.photoURL} />
                                <AvatarFallback>{player.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="flex-1">{player.displayName}</span>
                              {index === 0 && <Badge variant="secondary">Captain</Badge>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {match.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{match.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}