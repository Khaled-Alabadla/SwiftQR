'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QrCodeForm from '@/components/QrCodeForm';
import QrCodePreview from '@/components/QrCodePreview';
import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType } from '@/types/qr';
import { generateQrValue } from '@/lib/qrUtils';
import { Loader2 } from 'lucide-react';

const initialQrCodeState: QrCodeState = {
  value: 'https://swiftqr.dev',
  fgColor: '#0D1A2E', // Dark Blue/Black
  bgColor: '#FFFFFF', // White
  size: 256,
  level: 'M' as ErrorCorrectionLevel,
  logoUrl: '',
  logoSizeRatio: 0.15,
  logoOpacity: 1,
  logoPadding: 4,
  includeMargin: true,
};

const initialFormState: QrFormState = {
  activeTab: 'url' as QrContentType,
  url: 'https://swiftqr.dev',
  text: 'Hello from SwiftQR!',
  vCard: {
    firstName: '', lastName: '', organization: '', phone: '', email: '',
    website: '', street: '', city: '', zip: '', country: ''
  },
  email: { to: '', subject: '', body: '' },
  phone: '',
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  event: { summary: '', dtstart: null, dtend: null, allDay: false, location: '', description: '' },
};

export default function Home() {
  const [qrCodeState, setQrCodeState] = useState<QrCodeState>(initialQrCodeState);
  const [qrFormState, setQrFormState] = useState<QrFormState>(initialFormState);
  const [currentQrValue, setCurrentQrValue] = useState<string>(initialQrCodeState.value);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Prevent server-side execution

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[calc(100vh-10rem)]"> {/* Adjusted min-height */}
          <div className="h-full"> {/* Ensure form side takes full height */}
            <QrCodeForm 
              qrCodeState={qrCodeState}
              setQrCodeState={setQrCodeState}
              qrFormState={qrFormState}
              setQrFormState={setQrFormState}
            />
          </div>
          <div className="h-full flex items-center justify-center lg:sticky lg:top-20"> {/* Sticky preview for larger screens */}
             <QrCodePreview qrCodeState={qrCodeState} value={currentQrValue} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
