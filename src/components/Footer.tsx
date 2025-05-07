import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} SwiftQR. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
