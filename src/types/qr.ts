export type QrContentType = 'url' | 'text' | 'vcard' | 'email' | 'phone' | 'wifi' | 'event';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EventData {
  summary: string;
  dtstart: Date | null;
  dtend: Date | null;
  allDay: boolean;
  location: string;
  description: string;
}

export interface QrCodeState {
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  level: ErrorCorrectionLevel;
  logoUrl: string;
  logoSizeRatio: number; // e.g. 0.2 for 20% of QR code size
  logoOpacity: number; // 0 to 1
  logoPadding: number; // padding around the logo
  includeMargin: boolean;
}

export interface QrFormState {
  activeTab: QrContentType;
  url: string;
  text: string;
  vCard: VCardData;
  email: EmailData;
  phone: string;
  wifi: WifiData;
  event: EventData;
}
