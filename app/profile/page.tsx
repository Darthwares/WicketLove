'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/providers/auth-provider';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalRuns: 0,
    totalWickets: 0,
    highestScore: 0,
    bestBowling: '0/0',
    catches: 0,
    recentForm: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const performancesQuery = query(
          collection(db, 'performances'),
          where('userId', '==', user.id)
        );
        const performancesSnapshot = await getDocs(performancesQuery);
        const performances = performancesSnapshot.docs.map(doc => doc.data());

        let totalRuns = 0;
        let totalWickets = 0;
        let highestScore = 0;
        let bestWickets = 0;
        let bestRuns = 999;
        let catches = 0;

        performances.forEach(perf => {
          if (perf.batting) {
            totalRuns += perf.batting.runs;
            if (perf.batting.runs > highestScore) {
              highestScore = perf.batting.runs;
            }
          }
          if (perf.bowling) {
            totalWickets += perf.bowling.wickets;
            if (perf.bowling.wickets > bestWickets || 
                (perf.bowling.wickets === bestWickets && perf.bowling.runs < bestRuns)) {
              bestWickets = perf.bowling.wickets;
              bestRuns = perf.bowling.runs;
            }
          }
          if (perf.fielding) {
            catches += perf.fielding.catches || 0;
          }
        });

        setStats({
          totalMatches: performances.length,
          wins: Math.floor(performances.length * 0.6),
          losses: Math.floor(performances.length * 0.3),
          draws: Math.floor(performances.length * 0.1),
          totalRuns,
          totalWickets,
          highestScore,
          bestBowling: `${bestWickets}/${bestRuns}`,
          catches,
          recentForm: ['W', 'W', 'L', 'W', 'W'],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (!user) {
    return null;
  }

  const winRate = stats.totalMatches > 0 
    ? Math.round((stats.wins / stats.totalMatches) * 100) 
    : 0;

  const battingAverage = stats.totalMatches > 0 
    ? (stats.totalRuns / stats.totalMatches).toFixed(1)
    : '0.0';

  const achievements = [
    { icon: Trophy, label: 'Century Maker', unlocked: stats.highestScore >= 100 },
    { icon: Target, label: '5 Wicket Haul', unlocked: parseInt(stats.bestBowling.split('/')[0]) >= 5 },
    { icon: Award, label: 'Match Winner', unlocked: stats.wins >= 10 },
    { icon: TrendingUp, label: 'Rising Star', unlocked: user.rating >= 1200 },
  ];

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
              <h1 className="text-xl font-semibold">Profile</h1>
            </div>
            <Button 
              onClick={() => router.push('/profile/edit')}
              variant="outline"
              size="sm"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback className="text-2xl">{user.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.displayName}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge>{user.role}</Badge>
                    <Badge variant="outline">{user.battingStyle} handed</Badge>
                    {user.bowlingStyle !== 'none' && (
                      <Badge variant="outline">{user.bowlingStyle} bowler</Badge>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{user.rating}</div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Win Rate</span>
                  <span className="text-2xl font-bold text-green-600">{winRate}%</span>
                </div>
                <Progress value={winRate} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {stats.wins}W / {stats.losses}L / {stats.draws}D
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Batting Avg</span>
                  <span className="text-2xl font-bold">{battingAverage}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {stats.totalRuns} runs in {stats.totalMatches} matches
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Highest: {stats.highestScore}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Bowling</span>
                  <span className="text-2xl font-bold">{stats.totalWickets}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Total wickets
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Best: {stats.bestBowling}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {stats.recentForm.map((result, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      result === 'W' ? 'bg-green-500' : 
                      result === 'L' ? 'bg-red-500' : 
                      'bg-gray-400'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Career Stats</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Matches Played</p>
                        <p className="text-2xl font-semibold">{stats.totalMatches}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Runs</p>
                        <p className="text-2xl font-semibold">{stats.totalRuns}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Wickets</p>
                        <p className="text-2xl font-semibold">{stats.totalWickets}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Catches</p>
                        <p className="text-2xl font-semibold">{stats.catches}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index} className={achievement.unlocked ? '' : 'opacity-50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <achievement.icon className={`h-6 w-6 ${
                            achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.label}</p>
                          <p className="text-sm text-gray-500">
                            {achievement.unlocked ? 'Unlocked' : 'Locked'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span>First Match</span>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span>50 Runs</span>
                      <Badge variant="outline">
                        {stats.highestScore >= 50 ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span>100 Runs (Century)</span>
                      <Badge variant="outline">
                        {stats.highestScore >= 100 ? 'Completed' : 'Locked'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <span>5 Wickets in a Match</span>
                      <Badge variant="outline">
                        {parseInt(stats.bestBowling.split('/')[0]) >= 5 ? 'Completed' : 'Locked'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}