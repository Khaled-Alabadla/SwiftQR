
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
      url: 'https://picsum.photos/200/200?grayscale&random=0', // Added unique random for picsum
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
        cornersDotType: undefined, // Default
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
  onTemplateApplied?: () => void; // Optional callback
}

const QrTemplates: React.FC<QrTemplatesProps> = ({ setQrCodeState, onTemplateApplied }) => {
  
  const applyTemplate = (templateSettings: Partial<QrCodeState>) => {
    setQrCodeState(prev => {
      // Ensure prev.qrStyleOptions is an object, defaulting if necessary (though it shouldn't be based on initial state)
      const baseQrStyleOptions = prev.qrStyleOptions || { dotsType: 'rounded' as DotType };
      
      const newQrStyleOptions = {
        ...baseQrStyleOptions,
        ...(templateSettings.qrStyleOptions || {}), // templateSettings.qrStyleOptions from template should be an object
      };

      return {
        ...prev,
        ...templateSettings, // This will spread fgColor, bgColor, and also templateSettings.qrStyleOptions
        qrStyleOptions: newQrStyleOptions, // This explicitly sets the merged qrStyleOptions, overriding the one from templateSettings if it was spread
      };
    });
    onTemplateApplied?.(); // Call the callback if provided
  };

  return (
    <Card className="w-full shadow-none border-0 bg-popover text-popover-foreground">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center">
          <Zap className="mr-2.5 h-6 w-6" />
          Quick Styles & Templates
        </CardTitle>
        <CardDescription className="text-sm">
          Choose a pre-defined style or customize everything in the form.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground border-border">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 flex-grow">
                <div className="aspect-square w-full bg-muted rounded-md mb-2 sm:mb-3 overflow-hidden relative">
                  <Image 
                    src={template.previewImage.url} 
                    alt={template.previewImage.alt} 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={template.previewImage.aiHint}
                    className="rounded-md"
                  />
                </div>
                <CardDescription className="text-xs sm:text-sm">{template.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 border-t mt-auto border-border/50">
                <Button onClick={() => applyTemplate(template.settings)} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs sm:text-sm py-2">
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

```