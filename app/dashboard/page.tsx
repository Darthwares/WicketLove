'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Users, 
  Trophy, 
  LogOut, 
  Clock,
  MapPin,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { onAuthChange, logOut } from '@/lib/utils/auth';
import { useStore } from '@/lib/store';
import { format, formatDistanceToNow, isFuture } from 'date-fns';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser, setGroups, setMatches } = useStore();
  const [loading, setLoading] = useState(true);
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [groups, setLocalGroups] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (userData) => {
      if (!userData) {
        router.push('/');
      } else {
        setUser(userData);
        
        // Fetch user's groups
        const groupsQuery = query(
          collection(db, 'groups'),
          where('memberIds', 'array-contains', userData.id)
        );
        const groupsSnapshot = await getDocs(groupsQuery);
        const userGroups = groupsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLocalGroups(userGroups);
        setGroups(userGroups);
        
        // Fetch upcoming matches from user's groups
        if (userGroups.length > 0) {
          const groupIds = userGroups.map(g => g.id);
          const matchesQuery = query(
            collection(db, 'matches'),
            where('groupId', 'in', groupIds),
            where('status', '==', 'upcoming')
          );
          const matchesSnapshot = await getDocs(matchesQuery);
          const matches = matchesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          const upcoming = matches
            .filter(m => isFuture(new Date(m.date)))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setUpcomingMatches(upcoming);
          setMatches(matches);
          
          if (upcoming.length > 0) {
            setNextMatch(upcoming[0]);
          }
        }
        
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setUser, setGroups, setMatches]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const handleRSVP = async (matchId: string, status: 'going' | 'maybe' | 'not-going') => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'matches', matchId), {
        [`rsvps.${user.id}`]: status,
      });
      
      // Update local state
      setNextMatch((prev: any) => ({
        ...prev,
        rsvps: {
          ...prev.rsvps,
          [user.id]: status
        }
      }));
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.displayName}</p>
                <p className="text-sm text-gray-500">Rating: {user?.rating}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {nextMatch && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Next Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{nextMatch.title}</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(nextMatch.date), 'EEEE, dd MMM yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(nextMatch.date), 'hh:mm a')}</span>
                        <Badge variant="secondary" className="ml-2">
                          {formatDistanceToNow(new Date(nextMatch.date), { addSuffix: true })}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{nextMatch.venue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleRSVP(nextMatch.id, 'going')}
                      variant="secondary"
                      className="bg-white text-green-600 hover:bg-green-50"
                    >
                      Going
                    </Button>
                    <Button 
                      onClick={() => handleRSVP(nextMatch.id, 'maybe')}
                      variant="secondary"
                      className="bg-white text-yellow-600 hover:bg-yellow-50"
                    >
                      Maybe
                    </Button>
                    <Button 
                      onClick={() => handleRSVP(nextMatch.id, 'not-going')}
                      variant="secondary"
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      Can't Make It
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              onClick={() => router.push('/matches/create')}
              className="w-full h-32 bg-green-600 hover:bg-green-700"
            >
              <div className="text-center">
                <Plus className="h-8 w-8 mb-2 mx-auto" />
                <span className="text-lg">Create Match</span>
              </div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => router.push('/groups/create')}
              variant="outline"
              className="w-full h-32"
            >
              <div className="text-center">
                <Users className="h-8 w-8 mb-2 mx-auto" />
                <span className="text-lg">Create Group</span>
              </div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={() => router.push('/groups/join')}
              variant="outline"
              className="w-full h-32"
            >
              <div className="text-center">
                <UserPlus className="h-8 w-8 mb-2 mx-auto" />
                <span className="text-lg">Join Group</span>
              </div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => router.push('/profile')}
              variant="outline"
              className="w-full h-32"
            >
              <div className="text-center">
                <Trophy className="h-8 w-8 mb-2 mx-auto" />
                <span className="text-lg">View Stats</span>
              </div>
            </Button>
          </motion.div>
        </div>

        {groups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Groups Yet</h3>
              <p className="text-gray-500 mb-4">Create or join a group to start organizing matches</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push('/groups/create')}>
                  Create Group
                </Button>
                <Button onClick={() => router.push('/groups/join')} variant="outline">
                  Join Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Groups</h2>
            {groups.map((group) => (
              <Card 
                key={group.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/groups/${group.id}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={group.photoURL} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.memberIds.length} members</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}