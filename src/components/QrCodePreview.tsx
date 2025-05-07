// @ts-nocheck
"use client";

import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling'; // If using this library
// import QRCode from 'qrcode.react'; // If using qrcode.react
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toPng, toSvg, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';
import type { QrCodeState } from '@/types/qr';

interface QrCodePreviewProps {
  qrCodeState: QrCodeState;
  value: string;
}

const QrCodePreview: React.FC<QrCodePreviewProps> = ({ qrCodeState, value }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCodeStylingInstance, setQrCodeStylingInstance] = useState<QRCodeStyling | null>(null);
  const [isLoading, setIsLoading] = useState({ png: false, svg: false, pdf: false });
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !qrRef.current) return;

    if (!qrCodeStylingInstance) {
        const qrInstance = new QRCodeStyling({
            width: qrCodeState.size,
            height: qrCodeState.size,
            data: value,
            margin: qrCodeState.includeMargin ? 10 : 0, // QRCodeStyling handles margin internally
            dotsOptions: {
                color: qrCodeState.fgColor,
                type: 'rounded', // Example, can be made configurable
            },
            backgroundOptions: {
                color: qrCodeState.bgColor,
            },
            cornersSquareOptions: {
                type: 'extra-rounded', // Example
                color: qrCodeState.fgColor,
            },
            cornersDotOptions: {
                type: 'dot', // Example
                color: qrCodeState.fgColor,
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: qrCodeState.logoPadding,
                imageSize: qrCodeState.logoSizeRatio,
                opacity: qrCodeState.logoOpacity,
            },
            qrOptions: {
                errorCorrectionLevel: qrCodeState.level,
            },
        });
        setQrCodeStylingInstance(qrInstance);
        qrInstance.append(qrRef.current);
    } else {
        qrCodeStylingInstance.update({
            width: qrCodeState.size,
            height: qrCodeState.size,
            data: value,
            margin: qrCodeState.includeMargin ? 10 : 0,
            dotsOptions: {
                color: qrCodeState.fgColor,
            },
            backgroundOptions: {
                color: qrCodeState.bgColor,
            },
             cornersSquareOptions: {
                color: qrCodeState.fgColor,
            },
            cornersDotOptions: {
                color: qrCodeState.fgColor,
            },
            image: qrCodeState.logoUrl || undefined, // Ensure undefined if no logo
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: qrCodeState.logoPadding,
                imageSize: qrCodeState.logoSizeRatio,
                opacity: qrCodeState.logoOpacity,
            },
            qrOptions: {
                errorCorrectionLevel: qrCodeState.level,
            },
        });
    }
    // Clean up previous QR code if exists
    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [qrCodeState, value, isMounted, qrCodeStylingInstance]);


  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    if (!qrRef.current?.firstChild || !qrCodeStylingInstance) {
      toast({ title: "Error", description: "QR code element not found.", variant: "destructive" });
      return;
    }

    setIsLoading(prev => ({ ...prev, [format]: true }));
    const filename = `swiftqr-${Date.now()}`;

    try {
      if (format === 'png') {
        const dataUrl = await qrCodeStylingInstance.getRawData('png');
        if(dataUrl) saveAs(dataUrl, `${filename}.png`);
      } else if (format === 'svg') {
        const dataUrl = await qrCodeStylingInstance.getRawData('svg');
        if(dataUrl) saveAs(dataUrl, `${filename}.svg`);

      } else if (format === 'pdf') {
         // For PDF, we use html-to-image to get a PNG, then jspdf
        const dataUrl = await toPng(qrRef.current.firstChild as HTMLElement, { quality: 1.0 });
        const pdf = new jsPDF({
          orientation: qrCodeState.size > qrCodeState.size ? 'landscape' : 'portrait',
          unit: 'px',
          format: [qrCodeState.size + 20, qrCodeState.size + 20], // Add some padding
        });
        pdf.addImage(dataUrl, 'PNG', 10, 10, qrCodeState.size, qrCodeState.size);
        pdf.save(`${filename}.pdf`);
      }
      toast({ title: "Download Started", description: `Your ${format.toUpperCase()} QR code is downloading.`, variant: "default" });
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      toast({ title: "Download Failed", description: `Could not generate ${format.toUpperCase()} file.`, variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, [format]: false }));
    }
  };

  if (!isMounted) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center shadow-lg bg-muted/30">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading Preview...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center shadow-lg bg-muted/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div
          ref={qrRef}
          className="p-4 bg-white shadow-md rounded-lg flex items-center justify-center"
          style={{ width: qrCodeState.size + (qrCodeState.includeMargin ? 20 : 0), height: qrCodeState.size + (qrCodeState.includeMargin ? 20 : 0) }}
          data-ai-hint="qr code preview"
        >
          {/* QRCodeStyling will append canvas here */}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
          <Button onClick={() => handleDownload('png')} disabled={isLoading.png} className="w-full">
            {isLoading.png ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} disabled={isLoading.svg} className="w-full">
            {isLoading.svg ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            SVG
          </Button>
          <Button onClick={() => handleDownload('pdf')} disabled={isLoading.pdf} className="w-full">
            {isLoading.pdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QrCodePreview;
