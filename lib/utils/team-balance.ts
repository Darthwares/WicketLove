import { User } from '@/types';

interface TeamBalanceResult {
  red: User[];
  blue: User[];
}

export function balanceTeams(players: User[]): TeamBalanceResult {
  if (players.length < 2) {
    return { red: players, blue: [] };
  }

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  
  const keepers = sortedPlayers.filter(p => p.role === 'wicket-keeper');
  const batsmen = sortedPlayers.filter(p => p.role === 'batsman');
  const bowlers = sortedPlayers.filter(p => p.role === 'bowler');
  const allRounders = sortedPlayers.filter(p => p.role === 'all-rounder');
  
  const redTeam: User[] = [];
  const blueTeam: User[] = [];
  
  if (keepers.length >= 2) {
    redTeam.push(keepers[0]);
    blueTeam.push(keepers[1]);
    keepers.splice(0, 2);
  } else if (keepers.length === 1) {
    const randomTeam = Math.random() > 0.5;
    if (randomTeam) {
      redTeam.push(keepers[0]);
    } else {
      blueTeam.push(keepers[0]);
    }
    keepers.splice(0, 1);
  }
  
  const remainingPlayers = [...keepers, ...batsmen, ...bowlers, ...allRounders];
  
  remainingPlayers.forEach((player, index) => {
    const redRating = redTeam.reduce((sum, p) => sum + p.rating, 0);
    const blueRating = blueTeam.reduce((sum, p) => sum + p.rating, 0);
    
    if (index % 2 === 0) {
      if (redRating <= blueRating) {
        redTeam.push(player);
      } else {
        blueTeam.push(player);
      }
    } else {
      if (blueRating <= redRating) {
        blueTeam.push(player);
      } else {
        redTeam.push(player);
      }
    }
  });
  
  return { red: redTeam, blue: blueTeam };
}

export function calculateTeamRating(team: User[]): number {
  if (team.length === 0) return 0;
  return team.reduce((sum, player) => sum + player.rating, 0) / team.length;
}

export function selectCaptain(team: User[], previousCaptainIds: string[] = []): User | null {
  if (team.length === 0) return null;
  
  const eligiblePlayers = team.filter(p => !previousCaptainIds.includes(p.id));
  
  if (eligiblePlayers.length === 0) {
    return team[0];
  }
  
  const openingPlayers = eligiblePlayers.filter(p => p.preferredPosition === 'opening');
  if (openingPlayers.length > 0) {
    return openingPlayers[0];
  }
  
  return eligiblePlayers.sort((a, b) => b.rating - a.rating)[0];
}