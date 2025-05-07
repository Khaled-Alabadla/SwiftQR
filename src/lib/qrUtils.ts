import type { VCardData, EmailData, WifiData, EventData, LocationData, SmsData, WhatsAppData, BitcoinData, QrFormState } from '@/types/qr';
import { format as formatDateFns } from 'date-fns';

export const generateVCardString = (data: VCardData): string => {
  let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
  if (data.firstName || data.lastName) vCard += `N:${data.lastName || ''};${data.firstName || ''}\n`;
  if (data.firstName || data.lastName) vCard += `FN:${(data.firstName || '')} ${(data.lastName || '')}\n`.trim() + '\n';
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
  if (!data.to) return '';
  let mailto = `mailto:${encodeURIComponent(data.to)}`;
  const params = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  if (params.length > 0) mailto += `?${params.join('&')}`;
  return mailto;
};

export const generateWifiString = (data: WifiData): string => {
  if (!data.ssid) return '';
  const escapeWifiValue = (value?: string) => value?.replace(/([\\;,":])/g, '\\$1') || '';
  let wifiString = `WIFI:S:${escapeWifiValue(data.ssid)};`;
  if (data.encryption && data.encryption !== 'nopass') {
    wifiString += `T:${data.encryption};`;
  }
  if (data.password) {
    wifiString += `P:${escapeWifiValue(data.password)};`;
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
    return formatDateFns(date, "yyyyMMdd");
  }
  const utcDate = new Date(date.valueOf() - (date.getTimezoneOffset() * 60000));
  return formatDateFns(utcDate, "yyyyMMdd'T'HHmmss'Z'");
};

export const generateEventString = (data: EventData): string => {
  if (!data.summary || !data.dtstart) return '';
  let eventStr = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SwiftQR//EN//\nBEGIN:VEVENT\n';
  eventStr += `SUMMARY:${data.summary.replace(/\n/g, '\\n')}\n`;
  eventStr += `DTSTART${data.allDay ? ';VALUE=DATE' : ''}:${formatDateForICal(data.dtstart, data.allDay)}\n`;
  if (data.dtend) {
    eventStr += `DTEND${data.allDay ? ';VALUE=DATE' : ''}:${formatDateForICal(data.dtend, data.allDay)}\n`;
  } else if (data.allDay && data.dtstart) { 
    const endDate = new Date(data.dtstart);
    endDate.setDate(endDate.getDate() + 1);
    eventStr += `DTEND;VALUE=DATE:${formatDateForICal(endDate, true)}\n`;
  }
  if (data.location) eventStr += `LOCATION:${data.location.replace(/\n/g, '\\n')}\n`;
  if (data.description) eventStr += `DESCRIPTION:${data.description.replace(/\n/g, '\\n')}\n`;
  eventStr += `UID:${new Date().getTime()}-${Math.random().toString(36).substring(2)}@swiftqr.dev\n`; 
  eventStr += 'END:VEVENT\nEND:VCALENDAR';
  return eventStr;
};

export const generateLocationString = (data: LocationData): string => {
  if (data.latitude && data.longitude) {
    let geoStr = `geo:${data.latitude},${data.longitude}`;
    if (data.query) geoStr += `?q=${encodeURIComponent(data.query)}`;
    return geoStr;
  }
  if (data.query) {
    return `geo:0,0?q=${encodeURIComponent(data.query)}`;
  }
  return '';
};

export const generateSmsString = (data: SmsData): string => {
  if (!data.recipient) return '';
  let smsStr = `smsto:${data.recipient}`;
  if (data.message) {
    smsStr += `:${encodeURIComponent(data.message)}`;
  }
  return smsStr;
};

export const generateWhatsAppString = (data: WhatsAppData): string => {
  if (!data.phone) return '';
  // Phone number should be in international format, digits only (e.g., 15551234567 for +1 555-123-4567)
  const cleanedPhone = data.phone.replace(/[^0-9]/g, '');
  let waString = `https://wa.me/${cleanedPhone}`;
  if (data.message) {
    waString += `?text=${encodeURIComponent(data.message)}`;
  }
  return waString;
};

export const generateBitcoinString = (data: BitcoinData): string => {
  if (!data.address) return '';
  let btcString = `bitcoin:${data.address}`;
  const params = [];
  if (data.amount) params.push(`amount=${data.amount}`);
  if (data.label) params.push(`label=${encodeURIComponent(data.label)}`);
  if (data.message) params.push(`message=${encodeURIComponent(data.message)}`);
  if (params.length > 0) {
    btcString += `?${params.join('&')}`;
  }
  return btcString;
};

export const generateQrValue = (
  activeTab: QrFormState['activeTab'],
  formData: QrFormState
): string => {
  let value = '';
  switch (activeTab) {
    case 'url':
      value = formData.url || 'https://swiftqr.dev';
      break;
    case 'text':
      value = formData.text || 'Hello from SwiftQR!';
      break;
    case 'vcard':
      value = generateVCardString(formData.vCard);
      break;
    case 'email':
      value = generateEmailString(formData.email);
      break;
    case 'phone':
      value = formData.phone ? `tel:${formData.phone}` : '';
      break;
    case 'wifi':
      value = generateWifiString(formData.wifi);
      break;
    case 'event':
      value = generateEventString(formData.event);
      break;
    case 'location':
      value = generateLocationString(formData.location);
      break;
    case 'sms':
      value = generateSmsString(formData.sms);
      break;
    case 'whatsapp':
      value = generateWhatsAppString(formData.whatsapp);
      break;
    case 'bitcoin':
      value = generateBitcoinString(formData.bitcoin);
      break;
    default:
      const _exhaustiveCheck: never = activeTab;
      value = 'https://swiftqr.dev';
  }
  return value || 'https://swiftqr.dev/empty-placeholder'; 
};
