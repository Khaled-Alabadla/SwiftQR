
'use client';

import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType, DotType } from '@/types/qr';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QrCodeForm from '@/components/QrCodeForm';
import QrCodePreview from '@/components/QrCodePreview';
import { generateQrValue } from '@/lib/qrUtils';
import { Loader2, Zap, Palette, Settings, Code2, LayoutGrid, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


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
  vCard: { },
  email: { to: '', subject: '', body: '' },
  phone: '',
  wifi: { ssid: '', encryption: 'WPA', hidden: false },
  event: { summary: '', dtstart: null, dtend: null, allDay: false },
  location: { latitude: '', longitude: '', query: '' },
  sms: { recipient: '' , message: ''},
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

      if(cardR_str && cardG_str && cardB_str) {
        newBgColor = rgbToHex(parseInt(cardR_str), parseInt(cardG_str), parseInt(cardB_str));
      }
      
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
      <Header qrCodeState={qrCodeState} setQrCodeState={setQrCodeState} />
      <main className="flex-grow container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[calc(100vh-var(--header-height)-var(--footer-height)-4rem)]"> {/* Adjusted min-h for features section space */}
          <div className="h-full"> 
            <QrCodeForm 
              qrCodeState={qrCodeState}
              setQrCodeState={setQrCodeState}
              qrFormState={qrFormState}
              setQrFormState={setQrFormState}
            />
          </div>
          <div className="h-full flex items-start justify-center lg:sticky lg:top-[calc(var(--header-height)+1rem)] pt-0 lg:pt-0">
             <QrCodePreview qrCodeState={qrCodeState} value={currentQrValue} />
          </div>
        </div>

        <section id="features" className="py-12 sm:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SwiftQR offers a comprehensive suite of tools to create, customize, and manage your QR codes effortlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-accent" />,
                title: 'Dynamic QR Types',
                description: 'Generate codes for URLs, text, vCards, Wi-Fi, events, locations, SMS, WhatsApp, Bitcoin, and more.',
                aiHint: 'data connection',
              },
              {
                icon: <Palette className="h-8 w-8 text-accent" />,
                title: 'Advanced Customization',
                description: 'Tailor colors, add logos, choose dot and corner styles, and adjust margins to match your brand.',
                aiHint: 'color palette',
              },
              {
                icon: <Settings className="h-8 w-8 text-accent" />,
                title: 'High Error Correction',
                description: 'Select from multiple error correction levels (L, M, Q, H) to ensure scannability.',
                aiHint: 'gear settings',
              },
              {
                icon: <Code2 className="h-8 w-8 text-accent" />,
                title: 'Multiple Export Formats',
                description: 'Download your QR codes in PNG, SVG, or PDF formats for versatile use.',
                aiHint: 'file formats',
              },
              {
                icon: <LayoutGrid className="h-8 w-8 text-accent" />,
                title: 'Pre-designed Templates',
                description: 'Quickly apply professional styles with our curated QR code templates.',
                aiHint: 'grid layout',
              },
              {
                icon: <Smartphone className="h-8 w-8 text-accent" />,
                title: 'Mobile Friendly',
                description: 'Easily create and manage QR codes on any device, thanks to our responsive design.',
                aiHint: 'mobile responsive',
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60" data-ai-hint={feature.aiHint}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
