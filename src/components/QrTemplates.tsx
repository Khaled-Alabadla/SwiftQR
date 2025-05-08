// @ts-nocheck
"use client";

import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QrCodeState, DotType, CornerSquareType, CornerDotType } from '@/types/qr';
import { Zap } from 'lucide-react';

interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  settings: Partial<QrCodeState>;
  previewImage: {
    url: string;
    alt: string;
    aiHint: string;
  };
}

const templates: TemplateDefinition[] = [
  {
    id: 'classic-dark',
    name: 'Classic Dark',
    description: 'A timeless black and white design, sharp and professional.',
    settings: {
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      qrStyleOptions: {
        dotsType: 'square' as DotType,
        cornersSquareType: 'square' as CornerSquareType,
        cornersDotType: 'square' as CornerDotType,
      },
      includeMargin: true,
    },
    previewImage: {
      url: 'https://picsum.photos/200/200?grayscale',
      alt: 'Classic Dark QR Template Preview',
      aiHint: 'monochrome pattern',
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blue foreground on a light cyan background, with rounded elements.',
    settings: {
      fgColor: '#0D47A1', // Dark Blue
      bgColor: '#E0F7FA', // Light Cyan
      qrStyleOptions: {
        dotsType: 'rounded' as DotType,
        cornersSquareType: 'extra-rounded' as CornerSquareType,
        cornersDotType: 'dot' as CornerDotType,
      },
      includeMargin: true,
    },
    previewImage: {
      url: 'https://picsum.photos/200/200?random=1',
      alt: 'Ocean Breeze QR Template Preview',
      aiHint: 'blue abstract',
    }
  },
  {
    id: 'tech-purple',
    name: 'Tech Purple',
    description: 'Vibrant purple on a dark background, for a modern, techy feel.',
    settings: {
      fgColor: '#AB47BC', // Medium Purple
      bgColor: '#212121', // Dark Gray
      qrStyleOptions: {
        dotsType: 'dots' as DotType,
        cornersSquareType: 'dot' as CornerSquareType,
        cornersDotType: 'dot' as CornerDotType,
      },
      includeMargin: true,
    },
    previewImage: {
      url: 'https://picsum.photos/200/200?random=2',
      alt: 'Tech Purple QR Template Preview',
      aiHint: 'purple tech',
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Earthy green tones with classy, smooth dot styles.',
    settings: {
      fgColor: '#2E7D32', // Dark Green
      bgColor: '#F1F8E9', // Light Greenish White
      qrStyleOptions: {
        dotsType: 'classy-rounded' as DotType,
        cornersSquareType: 'extra-rounded' as CornerSquareType,
        cornersDotType: undefined,
      },
      includeMargin: true,
    },
     previewImage: {
      url: 'https://picsum.photos/200/200?random=3',
      alt: 'Forest Green QR Template Preview',
      aiHint: 'green nature',
    }
  },
];

interface QrTemplatesProps {
  setQrCodeState: Dispatch<SetStateAction<QrCodeState>>;
  // currentQrCodeState: QrCodeState; // Could be used to highlight active template
}

const QrTemplates: React.FC<QrTemplatesProps> = ({ setQrCodeState }) => {
  
  const applyTemplate = (templateSettings: Partial<QrCodeState>) => {
    setQrCodeState(prev => {
      // Ensure qrStyleOptions are merged correctly
      const newQrStyleOptions = {
        ...prev.qrStyleOptions,
        ...templateSettings.qrStyleOptions,
      };
      return {
        ...prev,
        ...templateSettings,
        qrStyleOptions: newQrStyleOptions,
      };
    });
  };

  return (
    <Card className="w-full mb-8 shadow-lg border-border/70 bg-card">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <Zap className="mr-3 h-7 w-7" />
          Quick Styles & Templates
        </CardTitle>
        <CardDescription>
          Choose a pre-defined style to get started quickly, or customize everything yourself below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="aspect-square w-full bg-muted rounded-md mb-3 overflow-hidden relative">
                  <Image 
                    src={template.previewImage.url} 
                    alt={template.previewImage.alt} 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={template.previewImage.aiHint} 
                  />
                </div>
                <CardDescription className="text-sm">{template.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 border-t mt-auto">
                <Button onClick={() => applyTemplate(template.settings)} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Apply Style
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QrTemplates;
