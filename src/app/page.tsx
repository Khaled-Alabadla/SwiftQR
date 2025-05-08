
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QrCodeForm from '@/components/QrCodeForm';
import QrCodePreview from '@/components/QrCodePreview';
import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType, DotType } from '@/types/qr';
import { generateQrValue } from '@/lib/qrUtils';
import { Loader2 } from 'lucide-react';

const initialQrCodeState: QrCodeState = {
  value: 'https://swiftqr.dev',
  fgColor: '#262626', // A dark gray, to be updated from CSS vars
  bgColor: '#FFFFFF', // White, to be updated from CSS vars
  size: 256,
  level: 'M' as ErrorCorrectionLevel,
  logoUrl: '',
  logoSizeRatio: 0.15,
  logoOpacity: 1,
  logoPadding: 4,
  includeMargin: true,
  qrStyleOptions: {
    dotsType: 'rounded' as DotType, 
    cornersSquareType: undefined,
    cornersDotType: undefined,
  },
};

const initialFormState: QrFormState = {
  activeTab: 'url' as QrContentType,
  url: 'https://swiftqr.dev',
  text: 'Hello from SwiftQR!',
  vCard: { /* All fields optional, initialized as empty or undefined */ },
  email: { to: '', subject: '', body: '' },
  phone: '',
  wifi: { ssid: '', encryption: 'WPA', hidden: false },
  event: { summary: '', dtstart: null, dtend: null, allDay: false },
  location: { latitude: '', longitude: '', query: '' },
  sms: { recipient: '' },
  whatsapp: { phone: '' , message: ''}, // Initialize whatsapp
  bitcoin: { address: '', amount: '', label: '', message: '' }, // Initialize bitcoin
};

// Helper to convert HSL string to Hex (simplified, assumes HSL format from CSS)
const hslToHex = (hslColor: string): string => {
  if (!hslColor || !hslColor.startsWith('hsl')) {
    // Check if it's already a hex color or an RGB(A) string
    if (hslColor && hslColor.startsWith('#')) return hslColor.toUpperCase();
    if (hslColor && hslColor.startsWith('rgb')) {
        const rgbMatch = hslColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }
    }
    return '#000000'; // fallback for invalid input
  }

  const hslMatch = hslColor.match(/hsl\((\d+)\s*(\d+)%?\s*(\d+)%?\)/);
  if (!hslMatch) return '#000000'; // fallback

  let h = parseInt(hslMatch[1]);
  let s = parseInt(hslMatch[2]) / 100;
  let l = parseInt(hslMatch[3]) / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = c; g = 0; b = x; }
  else if (300 <= h && h < 360) { r = x; g = 0; b = c; }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};


export default function Home() {
  const [qrCodeState, setQrCodeState] = useState<QrCodeState>(initialQrCodeState);
  const [qrFormState, setQrFormState] = useState<QrFormState>(initialFormState);
  const [currentQrValue, setCurrentQrValue] = useState<string>(initialQrCodeState.value);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const rootStyle = getComputedStyle(document.documentElement);
      // Use the raw RGB values from CSS if available, otherwise convert HSL
      const fgR = rootStyle.getPropertyValue('--foreground-r').trim();
      const fgG = rootStyle.getPropertyValue('--foreground-g').trim();
      const fgB = rootStyle.getPropertyValue('--foreground-b').trim();
      
      const cardR = rootStyle.getPropertyValue('--card-r').trim();
      const cardG = rootStyle.getPropertyValue('--card-g').trim();
      const cardB = rootStyle.getPropertyValue('--card-b').trim();

      let newFgColor = initialQrCodeState.fgColor;
      let newBgColor = initialQrCodeState.bgColor;

      if(fgR && fgG && fgB) {
        newFgColor = `#${parseInt(fgR).toString(16).padStart(2, '0')}${parseInt(fgG).toString(16).padStart(2, '0')}${parseInt(fgB).toString(16).padStart(2, '0')}`.toUpperCase();
      } else {
        const fgCssVar = rootStyle.getPropertyValue('--foreground').trim();
        if (fgCssVar) newFgColor = hslToHex(fgCssVar);
      }

      if(cardR && cardG && cardB) {
        newBgColor = `#${parseInt(cardR).toString(16).padStart(2, '0')}${parseInt(cardG).toString(16).padStart(2, '0')}${parseInt(cardB).toString(16).padStart(2, '0')}`.toUpperCase();
      } else {
        const bgCssVar = rootStyle.getPropertyValue('--card').trim();
        if (bgCssVar) newBgColor = hslToHex(bgCssVar);
      }
      
      setQrCodeState(prev => ({
        ...prev,
        fgColor: newFgColor,
        bgColor: newBgColor,
         qrStyleOptions: { // Ensure qrStyleOptions is initialized
          dotsType: prev.qrStyleOptions?.dotsType || 'rounded',
          cornersSquareType: prev.qrStyleOptions?.cornersSquareType,
          cornersDotType: prev.qrStyleOptions?.cornersDotType,
        },
      }));
    }
  }, []);


  useEffect(() => {
    if (!isClient) return;

    const newQrValue = generateQrValue(qrFormState.activeTab, qrFormState);
    setCurrentQrValue(newQrValue);
  }, [qrFormState, isClient]);

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground mt-4">Loading SwiftQR...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Adjusted min-height using CSS variables defined in Header/Footer and globals.css */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[calc(100vh-var(--header-height)-var(--footer-height)-2rem)]">
          <div className="h-full"> 
            <QrCodeForm 
              qrCodeState={qrCodeState}
              setQrCodeState={setQrCodeState}
              qrFormState={qrFormState}
              setQrFormState={setQrFormState}
            />
          </div>
          {/* Sticky top positioning uses CSS variable for header height */}
          <div className="h-full flex items-start justify-center lg:sticky lg:top-[calc(var(--header-height)+1rem)] pt-0 lg:pt-0">
             <QrCodePreview qrCodeState={qrCodeState} value={currentQrValue} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
