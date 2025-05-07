import Link from 'next/link';
import SwiftQrLogo from '@/components/icons/SwiftQrLogo';
// import { Moon, Sun } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useTheme } from 'next-themes'; // if you add next-themes

const Header = () => {
  // const { setTheme, theme } = useTheme(); // if you add next-themes

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <SwiftQrLogo />
        </Link>
        <nav className="flex items-center space-x-2">
          {/* Placeholder for future dark mode toggle or other nav items */}
          {/* Example dark mode toggle if next-themes is installed:
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
