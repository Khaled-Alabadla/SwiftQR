import Link from 'next/link';
import SwiftQrLogo from '@/components/icons/SwiftQrLogo';
import { Button, buttonVariants } from '@/components/ui/button';
// import { Moon, Sun } from 'lucide-react';
// import { useTheme } from 'next-themes'; // if you add next-themes

const Header = () => {
  // const { setTheme, theme } = useTheme(); // if you add next-themes

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
      style={{ '--header-height': '4rem' } as React.CSSProperties} // Standard height for h-16, directly set here.
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4"> {/* h-16 sets height to 4rem */}
        <Link href="/" className="flex items-center space-x-2">
          <SwiftQrLogo />
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/#features" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Features
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Pricing
          </Link>
          {/* <Link href="/blog" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Blog
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Contact
          </Link> */}
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Login
          </Link>
          <Link href="/signup" className={buttonVariants({ variant: "default", size: "sm" })}>
            Sign Up
          </Link>
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