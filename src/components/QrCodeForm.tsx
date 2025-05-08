
// @ts-nocheck
"use client";

import type React from 'react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button'; // Button is imported for PopoverTrigger
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
import { Button } from '@/components/ui/button'; // Ensure Button is imported
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  CalendarIcon, Palette, Settings2, Image as ImageIcon, Link2, Baseline, Contact, Mail, PhoneCall, WifiIcon as Wifi, CalendarDays, MapPin, MessageSquare, MessageCircle, Bitcoin as BitcoinIcon
} from 'lucide-react'; // Renamed Wifi to WifiIcon to avoid conflict
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { QrCodeState, QrFormState, ErrorCorrectionLevel, QrContentType, VCardData, EmailData, WifiData, EventData, LocationData, SmsData, WhatsAppData, BitcoinData, DotType, CornerSquareType, CornerDotType } from '@/types/qr';

interface QrCodeFormProps {
  qrCodeState: QrCodeState;
  setQrCodeState: Dispatch<SetStateAction<QrCodeState>>;
  qrFormState: QrFormState;
  setQrFormState: Dispatch<SetStateAction<QrFormState>>;
}

const qrTypeIcons: Record<QrContentType, React.ElementType> = {
  url: Link2,
  text: Baseline,
  vcard: Contact,
  email: Mail,
  phone: PhoneCall,
  wifi: Wifi,
  event: CalendarDays,
  location: MapPin,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  bitcoin: BitcoinIcon,
};

const dotTypes: DotType[] = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];
const cornerSquareTypes: CornerSquareType[] = [undefined, 'dot', 'square', 'extra-rounded']; // undefined for default
const cornerDotTypes: CornerDotType[] = [undefined, 'dot', 'square']; // undefined for default


const QrCodeForm: React.FC<QrCodeFormProps> = ({ qrCodeState, setQrCodeState, qrFormState, setQrFormState }) => {

  const handleInputChange = (
    tab: QrContentType,
    field: keyof VCardData | keyof EmailData | keyof WifiData | keyof EventData | keyof LocationData | keyof SmsData | keyof WhatsAppData | keyof BitcoinData | 'url' | 'text' | 'phone',
    value: string | boolean | Date | null
  ) => {
    setQrFormState(prev => {
      const newState = { ...prev };
      if (tab === 'url' || tab === 'text' || tab === 'phone') {
        newState[tab] = value as string;
      } else if (tab === 'vcard' || tab === 'email' || tab === 'wifi' || tab === 'event' || tab === 'location' || tab === 'sms' || tab === 'whatsapp' || tab === 'bitcoin') {
         (newState[tab] as Record<string, any>)[field as string] = value;
      }
      return newState;
    });
  };
  
  const handleCommonOptionsChange = (field: keyof QrCodeState | `qrStyleOptions.${keyof QrCodeState['qrStyleOptions']}`, value: string | number | boolean) => {
    if (typeof field === 'string' && field.startsWith('qrStyleOptions.')) {
      const styleField = field.split('.')[1] as keyof QrCodeState['qrStyleOptions'];
      setQrCodeState(prev => ({
        ...prev,
        qrStyleOptions: {
          ...prev.qrStyleOptions,
          [styleField]: value,
        },
      }));
    } else {
      setQrCodeState(prev => ({ ...prev, [field as keyof QrCodeState]: value }));
    }
  };

  const commonOptionFields = (
    <div className="space-y-6 mt-6 p-4 sm:p-6 border border-border/50 rounded-lg shadow-sm bg-card">
        <h3 className="text-lg font-semibold flex items-center text-foreground"><Palette className="mr-2 h-5 w-5 text-primary" /> Colors</h3>
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

        <h3 className="text-lg font-semibold flex items-center mt-6 text-foreground"><Settings2 className="mr-2 h-5 w-5 text-primary" /> QR Settings</h3>
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
                <SelectItem value="L">Low (L) - ~7% recovery</SelectItem>
                <SelectItem value="M">Medium (M) - ~15% recovery</SelectItem>
                <SelectItem value="Q">Quartile (Q) - ~25% recovery</SelectItem>
                <SelectItem value="H">High (H) - ~30% recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* QR Styling Options */}
          <div>
            <Label htmlFor="dotsType">Dot Style</Label>
            <Select value={qrCodeState.qrStyleOptions?.dotsType || 'rounded'} onValueChange={(val: DotType) => handleCommonOptionsChange('qrStyleOptions.dotsType', val)}>
              <SelectTrigger id="dotsType" className="mt-1"><SelectValue placeholder="Select dot style" /></SelectTrigger>
              <SelectContent>
                {dotTypes.map(type => <SelectItem key={type} value={type} className="capitalize">{type.replace('-', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cornersSquareType">Corner Square Style</Label>
            <Select value={qrCodeState.qrStyleOptions?.cornersSquareType || 'default'} onValueChange={(val: CornerSquareType | 'default') => handleCommonOptionsChange('qrStyleOptions.cornersSquareType', val === 'default' ? undefined : val)}>
              <SelectTrigger id="cornersSquareType" className="mt-1"><SelectValue placeholder="Select corner square style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                {cornerSquareTypes.filter(t => t !== undefined).map(type => <SelectItem key={type} value={type!} className="capitalize">{type!.replace('-', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cornersDotType">Corner Dot Style</Label>
             <Select value={qrCodeState.qrStyleOptions?.cornersDotType || 'default'} onValueChange={(val: CornerDotType | 'default') => handleCommonOptionsChange('qrStyleOptions.cornersDotType', val === 'default' ? undefined : val)}>
              <SelectTrigger id="cornersDotType" className="mt-1"><SelectValue placeholder="Select corner dot style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                {cornerDotTypes.filter(t => t !== undefined).map(type => <SelectItem key={type} value={type!} className="capitalize">{type!.replace('-', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

           <div className="flex items-center space-x-2 pt-1">
            <Checkbox
                id="margin"
                checked={qrCodeState.includeMargin}
                onCheckedChange={(checked) => handleCommonOptionsChange('includeMargin', Boolean(checked))}
              />
            <Label htmlFor="margin" className="font-normal cursor-pointer">Include Margin (Quiet Zone)</Label>
          </div>
        </div>

        <h3 className="text-lg font-semibold flex items-center mt-6 text-foreground"><ImageIcon className="mr-2 h-5 w-5 text-primary" /> Logo (Optional)</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo Image URL</Label>
            <Input id="logoUrl" type="url" placeholder="https://example.com/logo.png" value={qrCodeState.logoUrl || ''} onChange={(e) => handleCommonOptionsChange('logoUrl', e.target.value)} className="mt-1" />
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
              <Label htmlFor="logoPadding">Logo Padding (Margin around logo): {qrCodeState.logoPadding}px</Label>
              <Slider id="logoPadding" min={0} max={20} step={1} value={[qrCodeState.logoPadding]} onValueChange={(val) => handleCommonOptionsChange('logoPadding', val[0])} className="mt-1" />
            </div>
            </>
          )}
        </div>
    </div>
  );
  
  const tabContentWrapperClasses = "p-4 sm:p-6 rounded-lg border border-border/50 bg-card shadow-sm";
  const RequiredIndicator = () => <span className="text-destructive ml-0.5">*</span>;


  return (
    <Card className="w-full h-full overflow-y-auto shadow-xl border-border/70 bg-card">
      <CardHeader className="pb-4 sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b border-border/50">
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary">QR Code Content</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <Tabs value={qrFormState.activeTab} onValueChange={(value) => setQrFormState(prev => ({...prev, activeTab: value as QrContentType}))} className="w-full">
          <ScrollArea className="w-full pb-2 mb-4">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg shadow-inner">
              {(['url', 'text', 'vcard', 'email', 'phone', 'wifi', 'event', 'location', 'sms', 'whatsapp', 'bitcoin'] as QrContentType[]).map(tabName => {
                const Icon = qrTypeIcons[tabName];
                return (
                  <TabsTrigger key={tabName} value={tabName} className="capitalize text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {tabName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="mt-2 h-2" />
          </ScrollArea>

          <TabsContent value="url">
            <div className={tabContentWrapperClasses}>
              <Label htmlFor="url">Website URL <RequiredIndicator /></Label>
              <Input id="url" type="url" placeholder="https://example.com" value={qrFormState.url} onChange={(e) => handleInputChange('url', 'url', e.target.value)} className="mt-1" required/>
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className={tabContentWrapperClasses}>
              <Label htmlFor="text">Plain Text <RequiredIndicator /></Label>
              <Textarea id="text" placeholder="Enter your text here" value={qrFormState.text} onChange={(e) => handleInputChange('text', 'text', e.target.value)} className="mt-1" required/>
            </div>
          </TabsContent>

          <TabsContent value="vcard">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Contact Information (vCard)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vcard-firstName">First Name</Label>
                  <Input id="vcard-firstName" value={qrFormState.vCard?.firstName || ''} onChange={(e) => handleInputChange('vcard', 'firstName', e.target.value)} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="vcard-lastName">Last Name</Label>
                  <Input id="vcard-lastName" value={qrFormState.vCard?.lastName || ''} onChange={(e) => handleInputChange('vcard', 'lastName', e.target.value)} className="mt-1"/>
                </div>
              </div>
              <div>
                <Label htmlFor="vcard-organization">Organization</Label>
                <Input id="vcard-organization" value={qrFormState.vCard?.organization || ''} onChange={(e) => handleInputChange('vcard', 'organization', e.target.value)} className="mt-1"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vcard-phone">Phone</Label>
                  <Input id="vcard-phone" type="tel" value={qrFormState.vCard?.phone || ''} onChange={(e) => handleInputChange('vcard', 'phone', e.target.value)} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="vcard-email">Email</Label>
                  <Input id="vcard-email" type="email" value={qrFormState.vCard?.email || ''} onChange={(e) => handleInputChange('vcard', 'email', e.target.value)} className="mt-1"/>
                </div>
              </div>
              <div>
                <Label htmlFor="vcard-website">Website</Label>
                <Input id="vcard-website" type="url" value={qrFormState.vCard?.website || ''} onChange={(e) => handleInputChange('vcard', 'website', e.target.value)} className="mt-1"/>
              </div>
              <h5 className="font-medium text-foreground/90 pt-2">Address</h5>
              <div>
                <Label htmlFor="vcard-street">Street</Label>
                <Input id="vcard-street" value={qrFormState.vCard?.street || ''} onChange={(e) => handleInputChange('vcard', 'street', e.target.value)} className="mt-1"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vcard-city">City</Label>
                  <Input id="vcard-city" value={qrFormState.vCard?.city || ''} onChange={(e) => handleInputChange('vcard', 'city', e.target.value)} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="vcard-zip">ZIP Code</Label>
                  <Input id="vcard-zip" value={qrFormState.vCard?.zip || ''} onChange={(e) => handleInputChange('vcard', 'zip', e.target.value)} className="mt-1"/>
                </div>
                <div>
                  <Label htmlFor="vcard-country">Country</Label>
                  <Input id="vcard-country" value={qrFormState.vCard?.country || ''} onChange={(e) => handleInputChange('vcard', 'country', e.target.value)} className="mt-1"/>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Email Details</h4>
              <div>
                <Label htmlFor="email-to">To (Email Address) <RequiredIndicator /></Label>
                <Input id="email-to" type="email" placeholder="recipient@example.com" value={qrFormState.email?.to || ''} onChange={(e) => handleInputChange('email', 'to', e.target.value)} className="mt-1" required/>
              </div>
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Email Subject" value={qrFormState.email?.subject || ''} onChange={(e) => handleInputChange('email', 'subject', e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="email-body">Body</Label>
                <Textarea id="email-body" placeholder="Email body content..." value={qrFormState.email?.body || ''} onChange={(e) => handleInputChange('email', 'body', e.target.value)} className="mt-1"/>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="phone">
            <div className={tabContentWrapperClasses}>
              <Label htmlFor="phone">Phone Number <RequiredIndicator /></Label>
              <Input id="phone" type="tel" placeholder="+1234567890" value={qrFormState.phone} onChange={(e) => handleInputChange('phone', 'phone', e.target.value)} className="mt-1" required/>
            </div>
          </TabsContent>

          <TabsContent value="wifi">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Wi-Fi Credentials</h4>
              <div>
                <Label htmlFor="wifi-ssid">Network Name (SSID) <RequiredIndicator /></Label>
                <Input id="wifi-ssid" value={qrFormState.wifi?.ssid || ''} onChange={(e) => handleInputChange('wifi', 'ssid', e.target.value)} className="mt-1" required/>
              </div>
              <div>
                <Label htmlFor="wifi-password">Password</Label>
                <Input id="wifi-password" type="password" value={qrFormState.wifi?.password || ''} onChange={(e) => handleInputChange('wifi', 'password', e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="wifi-encryption">Encryption</Label>
                <Select value={qrFormState.wifi?.encryption || 'WPA'} onValueChange={(val: 'WPA' | 'WEP' | 'nopass') => handleInputChange('wifi', 'encryption', val)}>
                  <SelectTrigger id="wifi-encryption" className="mt-1">
                    <SelectValue placeholder="Select encryption type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No Password (Open)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="wifi-hidden" checked={qrFormState.wifi?.hidden || false} onCheckedChange={(checked) => handleInputChange('wifi', 'hidden', Boolean(checked))} />
                <Label htmlFor="wifi-hidden" className="font-normal cursor-pointer">Hidden Network</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="event">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Calendar Event</h4>
              <div>
                <Label htmlFor="event-summary">Event Summary/Title <RequiredIndicator /></Label>
                <Input id="event-summary" value={qrFormState.event?.summary || ''} onChange={(e) => handleInputChange('event', 'summary', e.target.value)} className="mt-1" required/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-dtstart">Start Date & Time <RequiredIndicator /></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="event-dtstart"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !qrFormState.event?.dtstart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {qrFormState.event?.dtstart ? format(qrFormState.event.dtstart, qrFormState.event.allDay ? "PPP" : "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={qrFormState.event?.dtstart}
                        onSelect={(date) => handleInputChange('event', 'dtstart', date || null)}
                        initialFocus
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="event-dtend">End Date & Time <RequiredIndicator /></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="event-dtend"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !qrFormState.event?.dtend && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {qrFormState.event?.dtend ? format(qrFormState.event.dtend, qrFormState.event.allDay ? "PPP" : "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                       <Calendar
                        mode="single"
                        selected={qrFormState.event?.dtend}
                        onSelect={(date) => handleInputChange('event', 'dtend', date || null)}
                        initialFocus
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="event-allDay" checked={qrFormState.event?.allDay || false} onCheckedChange={(checked) => handleInputChange('event', 'allDay', Boolean(checked))} />
                <Label htmlFor="event-allDay" className="font-normal cursor-pointer">All-day event</Label>
              </div>
              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" value={qrFormState.event?.location || ''} onChange={(e) => handleInputChange('event', 'location', e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" value={qrFormState.event?.description || ''} onChange={(e) => handleInputChange('event', 'description', e.target.value)} className="mt-1"/>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Location</h4>
              <p className="text-sm text-muted-foreground">Enter coordinates or an address/query. At least one field or pair of coordinates is required.</p>
              <div>
                <Label htmlFor="location-latitude">Latitude</Label>
                <Input 
                  id="location-latitude" 
                  type="text"
                  placeholder="e.g., 40.7128" 
                  value={qrFormState.location?.latitude || ''} 
                  onChange={(e) => handleInputChange('location', 'latitude', e.target.value)} 
                  className="mt-1"
                />
              </div>
               <div>
                <Label htmlFor="location-longitude">Longitude</Label>
                <Input 
                  id="location-longitude" 
                  type="text"
                  placeholder="e.g., -74.0060" 
                  value={qrFormState.location?.longitude || ''} 
                  onChange={(e) => handleInputChange('location', 'longitude', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div className="text-center my-2 text-sm text-muted-foreground relative">
                <span className="bg-card px-2 z-10 relative">OR</span>
                <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-t border-border/50"></div>
              </div>
              <div>
                 <Label htmlFor="location-query">Address / Point of Interest Query</Label>
                <Input 
                  id="location-query" 
                  type="text"
                  placeholder="e.g., Eiffel Tower, Paris" 
                  value={qrFormState.location?.query || ''} 
                  onChange={(e) => handleInputChange('location', 'query', e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sms">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">SMS Message</h4>
              <div>
                <Label htmlFor="sms-recipient">Recipient Phone Number <RequiredIndicator /></Label>
                <Input 
                  id="sms-recipient" 
                  type="tel" 
                  placeholder="+1234567890" 
                  value={qrFormState.sms?.recipient || ''} 
                  onChange={(e) => handleInputChange('sms', 'recipient', e.target.value)} 
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sms-message">Message (Optional)</Label>
                <Textarea 
                  id="sms-message" 
                  placeholder="Enter your SMS message here" 
                  value={qrFormState.sms?.message || ''} 
                  onChange={(e) => handleInputChange('sms', 'message', e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">WhatsApp Message</h4>
              <div>
                <Label htmlFor="whatsapp-phone">Phone Number (International Format) <RequiredIndicator /></Label>
                <Input 
                  id="whatsapp-phone" 
                  type="tel" 
                  placeholder="e.g., 15551234567 (for +1 555-123-4567)" 
                  value={qrFormState.whatsapp?.phone || ''} 
                  onChange={(e) => handleInputChange('whatsapp', 'phone', e.target.value)} 
                  className="mt-1"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Enter digits only, without '+', '00', spaces, or dashes.</p>
              </div>
              <div>
                <Label htmlFor="whatsapp-message">Pre-filled Message (Optional)</Label>
                <Textarea 
                  id="whatsapp-message" 
                  placeholder="Enter your message here" 
                  value={qrFormState.whatsapp?.message || ''} 
                  onChange={(e) => handleInputChange('whatsapp', 'message', e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bitcoin">
            <div className={`${tabContentWrapperClasses} space-y-4`}>
              <h4 className="font-semibold text-lg text-foreground">Bitcoin Payment</h4>
              <div>
                <Label htmlFor="bitcoin-address">Bitcoin Address <RequiredIndicator /></Label>
                <Input 
                  id="bitcoin-address" 
                  placeholder="Enter Bitcoin address" 
                  value={qrFormState.bitcoin?.address || ''} 
                  onChange={(e) => handleInputChange('bitcoin', 'address', e.target.value)} 
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bitcoin-amount">Amount (BTC, Optional)</Label>
                <Input 
                  id="bitcoin-amount" 
                  type="number"
                  step="any"
                  placeholder="e.g., 0.001" 
                  value={qrFormState.bitcoin?.amount || ''} 
                  onChange={(e) => handleInputChange('bitcoin', 'amount', e.target.value)} 
                  className="mt-1"
                />
              </div>
               <div>
                <Label htmlFor="bitcoin-label">Label (Optional)</Label>
                <Input 
                  id="bitcoin-label" 
                  placeholder="e.g., Payment for Invoice #123" 
                  value={qrFormState.bitcoin?.label || ''} 
                  onChange={(e) => handleInputChange('bitcoin', 'label', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bitcoin-message">Message (Optional)</Label>
                <Textarea 
                  id="bitcoin-message" 
                  placeholder="e.g., Thanks for your purchase!" 
                  value={qrFormState.bitcoin?.message || ''} 
                  onChange={(e) => handleInputChange('bitcoin', 'message', e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>


        </Tabs>
        
        {commonOptionFields}

      </CardContent>
    </Card>
  );
};

export default QrCodeForm;
