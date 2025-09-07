import { create } from 'zustand';
import { User, Group, Match } from '@/types';

interface AppState {
  user: User | null;
  groups: Group[];
  matches: Match[];
  loading: boolean;
  
  setUser: (user: User | null) => void;
  setGroups: (groups: Group[]) => void;
  setMatches: (matches: Match[]) => void;
  setLoading: (loading: boolean) => void;
  
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  updateRSVP: (matchId: string, userId: string, status: 'going' | 'maybe' | 'not-going') => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  groups: [],
  matches: [],
  loading: false,
  
  setUser: (user) => set({ user }),
  setGroups: (groups) => set({ groups }),
  setMatches: (matches) => set({ matches }),
  setLoading: (loading) => set({ loading }),
  
  addGroup: (group) => set((state) => ({ 
    groups: [...state.groups, group] 
  })),
  
  updateGroup: (groupId, updates) => set((state) => ({
    groups: state.groups.map((group) =>
      group.id === groupId ? { ...group, ...updates } : group
    ),
  })),
  
  addMatch: (match) => set((state) => ({ 
    matches: [...state.matches, match] 
  })),
  
  updateMatch: (matchId, updates) => set((state) => ({
    matches: state.matches.map((match) =>
      match.id === matchId ? { ...match, ...updates } : match
    ),
  })),
  
  updateRSVP: (matchId, userId, status) => set((state) => ({
    matches: state.matches.map((match) =>
      match.id === matchId 
        ? { ...match, rsvps: { ...match.rsvps, [userId]: status } }
        : match
    ),
  })),
}));