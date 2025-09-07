export type UserRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
export type BattingStyle = 'right' | 'left';
export type BowlingStyle = 'fast' | 'medium' | 'spin' | 'none';
export type PreferredPosition = 'opening' | 'middle' | 'lower';
export type MatchFormat = 'T20' | 'ODI' | 'Test' | 'Custom';
export type GroundType = 'turf' | 'matting' | 'concrete';
export type BallType = 'leather' | 'tennis' | 'rubber';
export type MatchStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
export type RSVPStatus = 'going' | 'maybe' | 'not-going';
export type TeamColor = 'red' | 'blue';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  preferredPosition: PreferredPosition;
  rating: number;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
    economy: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  photoURL?: string;
  adminIds: string[];
  memberIds: string[];
  inviteCode: string;
  inviteLink: string;
  settings: {
    isPrivate: boolean;
    autoBalance: boolean;
    captainRotation: boolean;
  };
  createdAt: Date;
  createdBy: string;
}

export interface Match {
  id: string;
  groupId: string;
  title: string;
  date: Date;
  venue: string;
  venueLocation?: {
    lat: number;
    lng: number;
  };
  format: MatchFormat;
  overs?: number;
  groundType: GroundType;
  ballType: BallType;
  status: MatchStatus;
  rsvpDeadline: Date;
  minPlayers: number;
  maxPlayers: number;
  teams: {
    red: {
      captainId?: string;
      playerIds: string[];
    };
    blue: {
      captainId?: string;
      playerIds: string[];
    };
  };
  rsvps: Record<string, RSVPStatus>;
  createdAt: Date;
  createdBy: string;
}

export interface Performance {
  id: string;
  matchId: string;
  userId: string;
  team: TeamColor;
  batting?: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOut: boolean;
    dismissalType?: string;
  };
  bowling?: {
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    wides: number;
    noBalls: number;
  };
  fielding?: {
    catches: number;
    runOuts: number;
    stumpings: number;
  };
  ratingChange: number;
  newRating: number;
  createdAt: Date;
}