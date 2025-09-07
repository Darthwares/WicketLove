import { Match, Group } from '@/types';
import { format } from 'date-fns';

export function generateMatchShareMessage(match: Match, groupName: string): string {
  const formattedDate = format(match.date, 'EEEE, dd MMM yyyy');
  const formattedTime = format(match.date, 'hh:mm a');
  
  const message = `🏏 *Cricket Match Alert!*
  
📅 *Date:* ${formattedDate}
⏰ *Time:* ${formattedTime}
📍 *Venue:* ${match.venue}
🎯 *Format:* ${match.format} ${match.overs ? `(${match.overs} overs)` : ''}
⚡ *Ground:* ${match.groundType.charAt(0).toUpperCase() + match.groundType.slice(1)}
🎾 *Ball:* ${match.ballType.charAt(0).toUpperCase() + match.ballType.slice(1)}

*Group:* ${groupName}
*RSVP Deadline:* ${format(match.rsvpDeadline, 'dd MMM, hh:mm a')}

Please confirm your availability!
✅ Going | 🤔 Maybe | ❌ Can't

Join Wicket Love to RSVP:
${window.location.origin}/matches/${match.id}`;

  return message;
}

export function generateGroupInviteMessage(group: Group): string {
  const message = `🏏 *You're invited to join ${group.name}!*

${group.description}

Join our cricket group and be part of exciting matches!

*Invite Code:* ${group.inviteCode}

Click to join:
${group.inviteLink}

Download Wicket Love to get started!`;

  return message;
}

export function getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
  const encodedMessage = encodeURIComponent(message);
  
  if (phoneNumber) {
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  }
  
  return `https://wa.me/?text=${encodedMessage}`;
}

export function openWhatsAppShare(message: string, phoneNumber?: string): void {
  const url = getWhatsAppShareUrl(message, phoneNumber);
  
  if (typeof window !== 'undefined') {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }
}