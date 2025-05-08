
export type QrContentType = 'url' | 'text' | 'vcard' | 'email' | 'phone' | 'wifi' | 'event' | 'location' | 'sms' | 'whatsapp' | 'bitcoin';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
export type CornerSquareType = undefined | "dot" | "square" | "extra-rounded";
export type CornerDotType = undefined | "dot" | "square";


export interface VCardData {
  firstName?: string;
  lastName?: string;
  organization?: string;
  phone?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface EmailData {
  to: string; // Usually required by mailto:
  subject?: string;
  body?: string;
}

export interface WifiData {
  ssid: string; // Required
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass'; // 'nopass' for no password / open network
  hidden?: boolean;
}

export interface EventData {
  summary: string; // Required for a meaningful event
  dtstart: Date | null; // Required
  dtend: Date | null; // Required (or calculated if allDay and only dtstart provided)
  allDay?: boolean;
  location?: string;
  description?: string;
}

export interface LocationData {
  latitude?: string; // e.g., "40.7128"
  longitude?: string; // e.g., "-74.0060"
  query?: string; // For address search, e.g., "1600 Amphitheatre Parkway, Mountain View, CA"
}

export interface SmsData {
  recipient: string; // Required
  message?: string;
}

export interface WhatsAppData {
  phone: string; // Required, digits only, international format (e.g. 15551234567)
  message?: string;
}

export interface BitcoinData {
  address: string; // Required
  amount?: string; // String to allow for precise decimal values
  label?: string;
  message?: string;
}

export interface QrCodeState {
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  level: ErrorCorrectionLevel;
  logoUrl?: string;
  logoSizeRatio: number;
  logoOpacity: number;
  logoPadding: number;
  includeMargin: boolean;
  qrStyleOptions: {
    dotsType: DotType;
    cornersSquareType?: CornerSquareType;
    cornersDotType?: CornerDotType;
  };
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
  location: LocationData;
  sms: SmsData;
  whatsapp: WhatsAppData;
  bitcoin: BitcoinData;
}
