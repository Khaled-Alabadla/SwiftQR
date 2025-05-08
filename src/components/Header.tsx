
import type React from 'react';
import Link from 'next/link';
import SwiftQrLogo from '@/components/icons/SwiftQrLogo';
import { buttonVariants, Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import QrTemplates from '@/components/QrTemplates';
import { LayoutGrid } from 'lucide-react';
import type { QrCodeState } from '@/types/qr';
import type { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  qrCodeState: QrCodeState;
  setQrCodeState: Dispatch<SetStateAction<QrCodeState>>;
}

const Header: React.FC<HeaderProps> = ({ qrCodeState, setQrCodeState }) => {
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
      style={{ '--header-height': '4rem' } as React.CSSProperties}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <SwiftQrLogo />
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/#features" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Features
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <LayoutGrid className="mr-1.5 h-4 w-4" />
                Templates
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[calc(100vw-2rem)] max-w-[800px] sm:w-[600px] md:w-[700px] lg:w-[800px] p-0 mt-2 shadow-2xl" 
              align="end"
              sideOffset={8}
            >
              <QrTemplates setQrCodeState={setQrCodeState} />
            </PopoverContent>
          </Popover>
        </nav>
      </div>
    </header>
  );
};

export default Header;
