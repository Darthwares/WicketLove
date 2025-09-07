'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/providers/auth-provider';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, addDays } from 'date-fns';

export default function CreateMatch() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    groupId: '',
    title: '',
    date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    time: '10:00',
    venue: '',
    format: 'T20',
    overs: 20,
    groundType: 'turf',
    ballType: 'leather',
    rsvpDeadline: format(addDays(new Date(), 6), 'yyyy-MM-dd'),
    rsvpTime: '22:00',
    minPlayers: 10,
    maxPlayers: 22,
    notes: '',
  });

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      try {
        const groupsQuery = query(
          collection(db, 'groups'),
          where('memberIds', 'array-contains', user.id)
        );
        const querySnapshot = await getDocs(groupsQuery);
        const userGroups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGroups(userGroups);
        
        if (userGroups.length > 0) {
          setFormData(prev => ({ ...prev, groupId: userGroups[0].id }));
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.groupId) return;

    setLoading(true);
    try {
      const matchDate = new Date(`${formData.date}T${formData.time}`);
      const rsvpDeadline = new Date(`${formData.rsvpDeadline}T${formData.rsvpTime}`);
      
      const matchData = {
        groupId: formData.groupId,
        title: formData.title || `${formData.format} Match`,
        date: matchDate,
        venue: formData.venue,
        format: formData.format,
        overs: formData.format === 'Custom' ? formData.overs : 
                formData.format === 'T20' ? 20 : 
                formData.format === 'ODI' ? 50 : 90,
        groundType: formData.groundType,
        ballType: formData.ballType,
        status: 'upcoming',
        rsvpDeadline,
        minPlayers: formData.minPlayers,
        maxPlayers: formData.maxPlayers,
        teams: {
          red: { playerIds: [] },
          blue: { playerIds: [] }
        },
        rsvps: {},
        notes: formData.notes,
        createdAt: new Date(),
        createdBy: user.id,
      };

      const docRef = await addDoc(collection(db, 'matches'), matchData);
      router.push(`/matches/${docRef.id}`);
    } catch (error) {
      console.error('Error creating match:', error);
      setLoading(false);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Groups Yet</h3>
            <p className="text-gray-500 mb-6">You need to be part of a group to create matches</p>
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/groups/create')}
                className="w-full"
              >
                Create Group
              </Button>
              <Button 
                onClick={() => router.push('/groups/join')}
                variant="outline"
                className="w-full"
              >
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold">Create Match</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Match Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group">Group *</Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) => setFormData({ ...formData, groupId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Match Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="Sunday Friendly Match"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="venue"
                      placeholder="Cricket Ground Name"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Match Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Format *</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData({ ...formData, format: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T20">T20 (20 overs)</SelectItem>
                        <SelectItem value="ODI">ODI (50 overs)</SelectItem>
                        <SelectItem value="Test">Test Match</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.format === 'Custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="overs">Overs</Label>
                      <Input
                        id="overs"
                        type="number"
                        value={formData.overs}
                        onChange={(e) => setFormData({ ...formData, overs: parseInt(e.target.value) })}
                        min={1}
                        max={90}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groundType">Ground Type *</Label>
                    <Select
                      value={formData.groundType}
                      onValueChange={(value) => setFormData({ ...formData, groundType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="turf">Turf</SelectItem>
                        <SelectItem value="matting">Matting</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ballType">Ball Type *</Label>
                    <Select
                      value={formData.ballType}
                      onValueChange={(value) => setFormData({ ...formData, ballType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leather">Leather</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="rubber">Rubber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RSVP Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rsvpDate">RSVP Deadline Date *</Label>
                    <Input
                      id="rsvpDate"
                      type="date"
                      value={formData.rsvpDeadline}
                      onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rsvpTime">RSVP Deadline Time *</Label>
                    <Input
                      id="rsvpTime"
                      type="time"
                      value={formData.rsvpTime}
                      onChange={(e) => setFormData({ ...formData, rsvpTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPlayers">Min Players</Label>
                    <Input
                      id="minPlayers"
                      type="number"
                      value={formData.minPlayers}
                      onChange={(e) => setFormData({ ...formData, minPlayers: parseInt(e.target.value) })}
                      min={4}
                      max={22}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Max Players</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                      min={4}
                      max={30}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

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
                disabled={loading || !formData.groupId || !formData.venue}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Create Match'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}