import type { VCardData, EmailData, WifiData, EventData } from '@/types/qr';
import { format } from 'date-fns';

export const generateVCardString = (data: VCardData): string => {
  let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
  if (data.firstName || data.lastName) vCard += `N:${data.lastName || ''};${data.firstName || ''}\n`;
  if (data.firstName || data.lastName) vCard += `FN:${data.firstName || ''} ${data.lastName || ''}\n`.trim() + '\n';
  if (data.organization) vCard += `ORG:${data.organization}\n`;
  if (data.phone) vCard += `TEL;TYPE=WORK,VOICE:${data.phone}\n`;
  if (data.email) vCard += `EMAIL:${data.email}\n`;
  if (data.website) vCard += `URL:${data.website}\n`;
  if (data.street || data.city || data.zip || data.country) {
    vCard += `ADR;TYPE=WORK:;;${data.street || ''};${data.city || ''};;${data.zip || ''};${data.country || ''}\n`;
  }
  vCard += 'END:VCARD';
  return vCard;
};

export const generateEmailString = (data: EmailData): string => {
  let mailto = `mailto:${data.to || ''}`;
  const params = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  if (params.length > 0) mailto += `?${params.join('&')}`;
  return mailto;
};

export const generateWifiString = (data: WifiData): string => {
  // WIFI:T:WPA;S:mynetwork;P:mypass;;
  let wifiString = `WIFI:S:${data.ssid};`;
  if (data.encryption !== 'nopass') {
    wifiString += `T:${data.encryption};`;
  }
  if (data.password) {
    wifiString += `P:${data.password};`;
  }
  if (data.hidden) {
    wifiString += `H:true;`;
  }
  wifiString += ';';
  return wifiString;
};

const formatDateForICal = (date: Date | null, allDay: boolean): string => {
  if (!date) return '';
  if (allDay) {
    return format(date, "yyyyMMdd");
  }
  return format(date, "yyyyMMdd'T'HHmmss'Z'"); // Assumes UTC, adjust if local time needed
};

export const generateEventString = (data: EventData): string => {
  // Basic iCalendar VEVENT format
  let eventStr = 'BEGIN:VEVENT\n';
  if (data.summary) eventStr += `SUMMARY:${data.summary}\n`;
  if (data.dtstart) eventStr += `DTSTART${data.allDay ? ';VALUE=DATE' : ''}:${formatDateForICal(data.dtstart, data.allDay)}\n`;
  if (data.dtend) eventStr += `DTEND${data.allDay ? ';VALUE=DATE' : ''}:${formatDateForICal(data.dtend, data.allDay)}\n`;
  if (data.location) eventStr += `LOCATION:${data.location}\n`;
  if (data.description) eventStr += `DESCRIPTION:${data.description.replace(/\n/g, '\\n')}\n`; // Escape newlines
  eventStr += 'END:VEVENT';
  return eventStr;
};

export const generateQrValue = (
  activeTab: string,
  formData: {
    url: string;
    text: string;
    vCard: VCardData;
    email: EmailData;
    phone: string;
    wifi: WifiData;
    event: EventData;
  }
): string => {
  switch (activeTab) {
    case 'url':
      return formData.url || 'https://swiftqr.dev';
    case 'text':
      return formData.text || 'Hello from SwiftQR!';
    case 'vcard':
      return generateVCardString(formData.vCard);
    case 'email':
      return generateEmailString(formData.email);
    case 'phone':
      return `tel:${formData.phone || ''}`;
    case 'wifi':
      return generateWifiString(formData.wifi);
    case 'event':
      return generateEventString(formData.event);
    default:
      return 'https://swiftqr.dev';
  }
};
