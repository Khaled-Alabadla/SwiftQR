const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 py-8 md:h-20 md:flex-row md:py-0">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Built by Your Name/Company. The source code is available on GitHub.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
