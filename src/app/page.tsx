
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QrCodeForm from '@/components/QrCodeForm';
import QrCodePreview from '@/components/QrCodePreview';
import QrTemplates from '@/components/QrTemplates'; // Import the new component
import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType, DotType } from '@/types/qr';
import { generateQrValue } from '@/lib/qrUtils';
import { Loader2 } from 'lucide-react';

const initialQrCodeState: QrCodeState = {
  value: 'https://swiftqr.dev',
  fgColor: '#262626', 
  bgColor: '#FFFFFF', 
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
  whatsapp: { phone: '' , message: ''},
  bitcoin: { address: '', amount: '', label: '', message: '' },
};


const rgbToHex = (r: number, g: number, b: number): string => {
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
      
      const fgR_str = rootStyle.getPropertyValue('--foreground-r').trim();
      const fgG_str = rootStyle.getPropertyValue('--foreground-g').trim();
      const fgB_str = rootStyle.getPropertyValue('--foreground-b').trim();
      
      const cardR_str = rootStyle.getPropertyValue('--card-r').trim();
      const cardG_str = rootStyle.getPropertyValue('--card-g').trim();
      const cardB_str = rootStyle.getPropertyValue('--card-b').trim();

      let newFgColor = initialQrCodeState.fgColor;
      let newBgColor = initialQrCodeState.bgColor;

      if(fgR_str && fgG_str && fgB_str) {
        newFgColor = rgbToHex(parseInt(fgR_str), parseInt(fgG_str), parseInt(fgB_str));
      }
      // No fallback to HSL conversion for foreground as RGB should be defined

      if(cardR_str && cardG_str && cardB_str) {
        newBgColor = rgbToHex(parseInt(cardR_str), parseInt(cardG_str), parseInt(cardB_str));
      }
      // No fallback to HSL conversion for background as RGB should be defined
      
      setQrCodeState(prev => ({
        ...prev,
        fgColor: newFgColor,
        bgColor: newBgColor,
         qrStyleOptions: {
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
        <QrTemplates setQrCodeState={setQrCodeState} /> {/* Add QrTemplates component */}
        
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
