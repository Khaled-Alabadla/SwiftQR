import type React from 'react';

const SwiftQrLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 180 40"
    className="h-10 w-auto"
    {...props}
  >
    <defs>
      <linearGradient id="swiftqr-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="28"
      fontWeight="bold"
      fill="url(#swiftqr-gradient)"
      fontFamily="var(--font-inter, Arial), sans-serif"
    >
      SwiftQR
    </text>
  </svg>
);

export default SwiftQrLogo;
