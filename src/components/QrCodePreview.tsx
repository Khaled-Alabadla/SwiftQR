// @ts-nocheck
"use client";

import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling'; 
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toPng } from 'html-to-image'; 
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
    
    const dynamicMargin = qrCodeState.includeMargin ? Math.max(0, Math.floor(qrCodeState.size * 0.04)) : 0;

    const commonOptions = {
        width: qrCodeState.size,
        height: qrCodeState.size,
        data: value || "https://swiftqr.dev/empty-placeholder",
        margin: dynamicMargin,
        dotsOptions: {
            color: qrCodeState.fgColor,
            type: qrCodeState.qrStyleOptions.dotsType, 
        },
        backgroundOptions: {
            color: qrCodeState.bgColor,
        },
        cornersSquareOptions: {
            type: qrCodeState.qrStyleOptions.cornersSquareType, 
            color: qrCodeState.fgColor,
        },
        cornersDotOptions: {
            type: qrCodeState.qrStyleOptions.cornersDotType, 
            color: qrCodeState.fgColor,
        },
        image: qrCodeState.logoUrl || undefined,
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: qrCodeState.logoPadding,
            imageSize: qrCodeState.logoSizeRatio, 
            opacity: qrCodeState.logoOpacity,
        },
        qrOptions: {
            errorCorrectionLevel: qrCodeState.level,
        },
    };

    if (!qrCodeStylingInstance) {
        const qrInstance = new QRCodeStyling(commonOptions);
        setQrCodeStylingInstance(qrInstance);
        if (qrRef.current) {
          qrRef.current.innerHTML = ''; 
          qrInstance.append(qrRef.current);
        }
    } else {
        qrCodeStylingInstance.update(commonOptions);
    }
    
  }, [qrCodeState, value, isMounted, qrCodeStylingInstance]);


  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    if (!qrRef.current?.firstChild || !qrCodeStylingInstance || !value || value === 'https://swiftqr.dev/empty-placeholder' ) {
      toast({ title: "Error", description: "QR code data is empty or not ready.", variant: "destructive" });
      return;
    }

    setIsLoading(prev => ({ ...prev, [format]: true }));
    const filename = `swiftqr-${Date.now()}`;

    try {
      if (format === 'png') {
        const dataUrl = await qrCodeStylingInstance.getRawData('png');
        if(dataUrl) saveAs(dataUrl, `${filename}.png`);
      } else if (format === 'svg') {
        const svgString = await qrCodeStylingInstance.getRawData('svg');
        if(svgString) {
           const blob = new Blob([svgString as string], { type: 'image/svg+xml;charset=utf-8' });
           saveAs(blob, `${filename}.svg`);
        }
      } else if (format === 'pdf') {
        const tempSize = Math.min(1024, Math.max(300, qrCodeState.size * 2)); 
        const tempMargin = qrCodeState.includeMargin ? Math.max(0, Math.floor(tempSize * 0.04)) : 0;

        const tempQrInstanceOptions = {
          ...qrCodeStylingInstance._options, 
          width: tempSize,
          height: tempSize,
          margin: tempMargin,
          dotsOptions: { ...qrCodeStylingInstance._options.dotsOptions, type: qrCodeState.qrStyleOptions.dotsType },
          cornersSquareOptions: { ...qrCodeStylingInstance._options.cornersSquareOptions, type: qrCodeState.qrStyleOptions.cornersSquareType },
          cornersDotOptions: { ...qrCodeStylingInstance._options.cornersDotOptions, type: qrCodeState.qrStyleOptions.cornersDotType },
        };
        
        if (qrCodeState.logoUrl) {
            tempQrInstanceOptions.image = qrCodeState.logoUrl;
            tempQrInstanceOptions.imageOptions = {
                ...qrCodeStylingInstance._options.imageOptions,
                crossOrigin: 'anonymous',
            };
        } else {
            delete tempQrInstanceOptions.image;
            delete tempQrInstanceOptions.imageOptions;
        }

        const tempQrInstance = new QRCodeStyling(tempQrInstanceOptions);

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = `${tempSize}px`;
        tempDiv.style.height = `${tempSize}px`;
        document.body.appendChild(tempDiv);
        
        if(tempDiv.firstChild) tempDiv.removeChild(tempDiv.firstChild);
        tempQrInstance.append(tempDiv); 
        
        if (qrCodeState.logoUrl) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        const dataUrl = await toPng(tempDiv.firstChild as HTMLElement, { 
          quality: 1.0, 
          pixelRatio: window.devicePixelRatio || 1, 
          backgroundColor: qrCodeState.bgColor,
          width: tempSize,
          height: tempSize,
        });
        
        document.body.removeChild(tempDiv);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [qrCodeState.size + 40, qrCodeState.size + 40],
        });
        const xOffset = (pdf.internal.pageSize.getWidth() - qrCodeState.size) / 2;
        const yOffset = (pdf.internal.pageSize.getHeight() - qrCodeState.size) / 2;
        pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, qrCodeState.size, qrCodeState.size);
        pdf.save(`${filename}.pdf`);
      }
      toast({ title: "Download Started", description: `Your ${format.toUpperCase()} QR code is downloading.`, variant: "default" });
    } catch (error: any) {
      console.error(`Error downloading ${format}:`, error);
      let description = `Could not generate ${format.toUpperCase()} file.`;
      if (error.message && (error.message.includes('Tainted canvases') || error.message.includes('NetworkError'))) {
        description += " This might be due to cross-origin restrictions on the logo image. Try a different logo URL or ensure CORS is configured on the image server.";
      }
      toast({ title: "Download Failed", description, variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, [format]: false }));
    }
  };

  if (!isMounted) {
    return (
      <Card className="w-full max-w-md mx-auto h-full flex flex-col items-center justify-center shadow-xl bg-card border-border/70">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading Preview...</p>
        </CardContent>
      </Card>
    );
  }
  
  const qrInstanceRenderSize = qrCodeState.size; 
  const previewContainerPadding = 16; 
  const previewContainerSize = qrInstanceRenderSize + previewContainerPadding;
  const isQrValueEmpty = !value || value === 'https://swiftqr.dev/empty-placeholder';

  return (
    <Card className="w-full max-w-md mx-auto h-fit flex flex-col items-center justify-start shadow-xl bg-card border-border/70 sticky top-[calc(var(--header-height)+1rem)]">
      <CardHeader className="w-full pb-4 border-b border-border/50">
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary text-center">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center w-full">
        <div
          className="p-2 shadow-lg rounded-lg flex items-center justify-center border border-border/50 overflow-hidden"
          style={{ 
            width: previewContainerSize, 
            height: previewContainerSize,
            backgroundColor: qrCodeState.bgColor,
          }}
          data-ai-hint="qr code preview"
        >
          <div ref={qrRef} style={{ width: qrCodeState.size, height: qrCodeState.size }} className="flex items-center justify-center">
            {/* QRCodeStyling will append canvas/svg here */}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <Button onClick={() => handleDownload('png')} disabled={isLoading.png || isQrValueEmpty} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5">
            {isLoading.png ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} disabled={isLoading.svg || isQrValueEmpty} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2.5">
            {isLoading.svg ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            SVG
          </Button>
          <Button onClick={() => handleDownload('pdf')} disabled={isLoading.pdf || isQrValueEmpty} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2.5">
            {isLoading.pdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            PDF
          </Button>
        </div>
        {isQrValueEmpty && <p className="text-destructive text-sm mt-4 text-center">Please enter content for the QR code.</p>}
      </CardContent>
    </Card>
  );
};

export default QrCodePreview;
