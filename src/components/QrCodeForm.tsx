// @ts-nocheck
"use client";

import type React from 'react';
import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon, Palette, Settings2, Image as ImageIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType, VCardData, EmailData, WifiData, EventData } from '@/types/qr';

interface QrCodeFormProps {
  qrCodeState: QrCodeState;
  setQrCodeState: Dispatch<SetStateAction<QrCodeState>>;
  qrFormState: QrFormState;
  setQrFormState: Dispatch<SetStateAction<QrFormState>>;
}

const QrCodeForm: React.FC<QrCodeFormProps> = ({ qrCodeState, setQrCodeState, qrFormState, setQrFormState }) => {

  const handleInputChange = (
    tab: QrContentType,
    field: keyof VCardData | keyof EmailData | keyof WifiData | keyof EventData | 'url' | 'text' | 'phone',
    value: string | boolean | Date | null
  ) => {
    setQrFormState(prev => {
      const newState = { ...prev };
      if (tab === 'url' || tab === 'text' || tab === 'phone') {
        newState[tab] = value as string;
      } else {
        (newState[tab] as any)[field as string] = value;
      }
      return newState;
    });
  };
  
  const handleCommonOptionsChange = (field: keyof QrCodeState, value: string | number | boolean) => {
    setQrCodeState(prev => ({ ...prev, [field]: value }));
  };

  const commonOptionFields = (
    <div className="space-y-6 mt-6 p-6 border border-border rounded-lg shadow-sm bg-card">
        <h3 className="text-lg font-semibold flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fgColor">Foreground Color</Label>
            <Input id="fgColor" type="color" value={qrCodeState.fgColor} onChange={(e) => handleCommonOptionsChange('fgColor', e.target.value)} className="h-10 mt-1" />
          </div>
          <div>
            <Label htmlFor="bgColor">Background Color</Label>
            <Input id="bgColor" type="color" value={qrCodeState.bgColor} onChange={(e) => handleCommonOptionsChange('bgColor', e.target.value)} className="h-10 mt-1" />
          </div>
        </div>

        <h3 className="text-lg font-semibold flex items-center mt-6"><Settings2 className="mr-2 h-5 w-5 text-primary" /> QR Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="size">Size: {qrCodeState.size}px</Label>
            <Slider id="size" min={64} max={1024} step={8} value={[qrCodeState.size]} onValueChange={(val) => handleCommonOptionsChange('size', val[0])} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="level">Error Correction</Label>
            <Select value={qrCodeState.level} onValueChange={(val: ErrorCorrectionLevel) => handleCommonOptionsChange('level', val)}>
              <SelectTrigger id="level" className="mt-1">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (L)</SelectItem>
                <SelectItem value="M">Medium (M)</SelectItem>
                <SelectItem value="Q">Quartile (Q)</SelectItem>
                <SelectItem value="H">High (H)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="margin">Include Margin (Quiet Zone)</Label>
             <Checkbox
                id="margin"
                checked={qrCodeState.includeMargin}
                onCheckedChange={(checked) => handleCommonOptionsChange('includeMargin', Boolean(checked))}
                className="mt-1 ml-2"
              />
          </div>
        </div>

        <h3 className="text-lg font-semibold flex items-center mt-6"><ImageIcon className="mr-2 h-5 w-5 text-primary" /> Logo (Optional)</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo Image URL</Label>
            <Input id="logoUrl" type="url" placeholder="https://example.com/logo.png" value={qrCodeState.logoUrl} onChange={(e) => handleCommonOptionsChange('logoUrl', e.target.value)} className="mt-1" />
          </div>
           {qrCodeState.logoUrl && (
            <>
            <div>
              <Label htmlFor="logoSizeRatio">Logo Size Ratio: {Math.round(qrCodeState.logoSizeRatio * 100)}%</Label>
              <Slider id="logoSizeRatio" min={0.05} max={0.3} step={0.01} value={[qrCodeState.logoSizeRatio]} onValueChange={(val) => handleCommonOptionsChange('logoSizeRatio', val[0])} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="logoOpacity">Logo Opacity: {Math.round(qrCodeState.logoOpacity * 100)}%</Label>
              <Slider id="logoOpacity" min={0.1} max={1} step={0.05} value={[qrCodeState.logoOpacity]} onValueChange={(val) => handleCommonOptionsChange('logoOpacity', val[0])} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="logoPadding">Logo Padding: {qrCodeState.logoPadding}px</Label>
              <Slider id="logoPadding" min={0} max={10} step={1} value={[qrCodeState.logoPadding]} onValueChange={(val) => handleCommonOptionsChange('logoPadding', val[0])} className="mt-1" />
            </div>
            </>
          )}
        </div>
    </div>
  );

  return (
    <Card className="w-full h-full overflow-y-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">QR Code Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={qrFormState.activeTab} onValueChange={(value) => setQrFormState(prev => ({...prev, activeTab: value as QrContentType}))} className="w-full">
          <ScrollArea className="w-full pb-2 mb-4">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-md">
              {(['url', 'text', 'vcard', 'email', 'phone', 'wifi', 'event'] as QrContentType[]).map(tabName => (
                <TabsTrigger key={tabName} value={tabName} className="capitalize text-xs sm:text-sm px-3 py-1.5">
                  {tabName}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>

          <TabsContent value="url">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <Label htmlFor="url">Website URL</Label>
              <Input id="url" type="url" placeholder="https://example.com" value={qrFormState.url} onChange={(e) => handleInputChange('url', 'url', e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <Label htmlFor="text">Plain Text</Label>
              <Textarea id="text" placeholder="Enter your text here" value={qrFormState.text} onChange={(e) => handleInputChange('text', 'text', e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="vcard">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <h4 className="font-semibold text-lg">Contact Information (vCard)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vcard-firstName">First Name</Label>
                  <Input id="vcard-firstName" value={qrFormState.vCard.firstName} onChange={(e) => handleInputChange('vcard', 'firstName', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="vcard-lastName">Last Name</Label>
                  <Input id="vcard-lastName" value={qrFormState.vCard.lastName} onChange={(e) => handleInputChange('vcard', 'lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="vcard-organization">Organization</Label>
                <Input id="vcard-organization" value={qrFormState.vCard.organization} onChange={(e) => handleInputChange('vcard', 'organization', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vcard-phone">Phone</Label>
                  <Input id="vcard-phone" type="tel" value={qrFormState.vCard.phone} onChange={(e) => handleInputChange('vcard', 'phone', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="vcard-email">Email</Label>
                  <Input id="vcard-email" type="email" value={qrFormState.vCard.email} onChange={(e) => handleInputChange('vcard', 'email', e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="vcard-website">Website</Label>
                <Input id="vcard-website" type="url" value={qrFormState.vCard.website} onChange={(e) => handleInputChange('vcard', 'website', e.target.value)} />
              </div>
              <h5 className="font-medium">Address</h5>
              <div>
                <Label htmlFor="vcard-street">Street</Label>
                <Input id="vcard-street" value={qrFormState.vCard.street} onChange={(e) => handleInputChange('vcard', 'street', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vcard-city">City</Label>
                  <Input id="vcard-city" value={qrFormState.vCard.city} onChange={(e) => handleInputChange('vcard', 'city', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="vcard-zip">ZIP Code</Label>
                  <Input id="vcard-zip" value={qrFormState.vCard.zip} onChange={(e) => handleInputChange('vcard', 'zip', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="vcard-country">Country</Label>
                  <Input id="vcard-country" value={qrFormState.vCard.country} onChange={(e) => handleInputChange('vcard', 'country', e.target.value)} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <h4 className="font-semibold text-lg">Email Details</h4>
              <div>
                <Label htmlFor="email-to">To</Label>
                <Input id="email-to" type="email" placeholder="recipient@example.com" value={qrFormState.email.to} onChange={(e) => handleInputChange('email', 'to', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Email Subject" value={qrFormState.email.subject} onChange={(e) => handleInputChange('email', 'subject', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email-body">Body</Label>
                <Textarea id="email-body" placeholder="Email body content..." value={qrFormState.email.body} onChange={(e) => handleInputChange('email', 'body', e.target.value)} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="phone">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1234567890" value={qrFormState.phone} onChange={(e) => handleInputChange('phone', 'phone', e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="wifi">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <h4 className="font-semibold text-lg">Wi-Fi Credentials</h4>
              <div>
                <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                <Input id="wifi-ssid" value={qrFormState.wifi.ssid} onChange={(e) => handleInputChange('wifi', 'ssid', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wifi-password">Password</Label>
                <Input id="wifi-password" type="password" value={qrFormState.wifi.password} onChange={(e) => handleInputChange('wifi', 'password', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wifi-encryption">Encryption</Label>
                <Select value={qrFormState.wifi.encryption} onValueChange={(val: 'WPA' | 'WEP' | 'nopass') => handleInputChange('wifi', 'encryption', val)}>
                  <SelectTrigger id="wifi-encryption">
                    <SelectValue placeholder="Select encryption type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No Password (Open)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="wifi-hidden" checked={qrFormState.wifi.hidden} onCheckedChange={(checked) => handleInputChange('wifi', 'hidden', Boolean(checked))} />
                <Label htmlFor="wifi-hidden">Hidden Network</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="event">
            <div className="space-y-4 p-6 rounded-lg border bg-card/50 shadow-sm">
              <h4 className="font-semibold text-lg">Calendar Event</h4>
              <div>
                <Label htmlFor="event-summary">Event Summary/Title</Label>
                <Input id="event-summary" value={qrFormState.event.summary} onChange={(e) => handleInputChange('event', 'summary', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-dtstart">Start Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="event-dtstart"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !qrFormState.event.dtstart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {qrFormState.event.dtstart ? format(qrFormState.event.dtstart, qrFormState.event.allDay ? "PPP" : "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={qrFormState.event.dtstart}
                        onSelect={(date) => handleInputChange('event', 'dtstart', date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="event-dtend">End Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="event-dtend"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !qrFormState.event.dtend && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {qrFormState.event.dtend ? format(qrFormState.event.dtend, qrFormState.event.allDay ? "PPP" : "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                       <Calendar
                        mode="single"
                        selected={qrFormState.event.dtend}
                        onSelect={(date) => handleInputChange('event', 'dtend', date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="event-allDay" checked={qrFormState.event.allDay} onCheckedChange={(checked) => handleInputChange('event', 'allDay', Boolean(checked))} />
                <Label htmlFor="event-allDay">All-day event</Label>
              </div>
              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" value={qrFormState.event.location} onChange={(e) => handleInputChange('event', 'location', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" value={qrFormState.event.description} onChange={(e) => handleInputChange('event', 'description', e.target.value)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Common Customization Options */}
        {commonOptionFields}

      </CardContent>
    </Card>
  );
};

export default QrCodeForm;
