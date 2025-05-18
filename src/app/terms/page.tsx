"use client";

import type { Metadata } from "next";
import type { Dispatch, SetStateAction } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QrCodeState } from "@/types/qr";

// This is a placeholder for metadata that would typically be in a server component or layout.
// For client components, document title can be set with useEffect if needed, but metadata API is preferred.
// export const metadata: Metadata = {
// title: 'Terms of Service - SwiftQR',
// description: 'Read the Terms of Service for SwiftQR.',
// };
// Since this is a client component due to Header potentially using client features,
// we'll manage title via useEffect if truly needed, or rely on a RootLayout metadata for general site title.
// For now, we assume metadata is handled at a higher level or this page doesn't critically need unique metadata tags via this file.

// Minimal state for Header, as it's not the primary focus of this static page.
const dummyQrCodeState: QrCodeState = {
  value: "https://swiftqr.dev/terms",
  fgColor: "#262626", // Using a default dark color
  bgColor: "#FFFFFF", // Using a default light color
  size: 256,
  level: "M",
  includeMargin: true,
  logoUrl: "",
  logoSizeRatio: 0.15,
  logoOpacity: 1,
  logoPadding: 4,
  qrStyleOptions: {
    dotsType: "rounded",
    cornersSquareType: undefined,
    cornersDotType: undefined,
  },
};
const dummySetQrCodeState: Dispatch<SetStateAction<QrCodeState>> = () => {
  // This function does nothing on static pages like Terms of Service.
};

export default function TermsPage() {
  // If dynamic title setting is needed for client component:
  // useEffect(() => {
  //   document.title = 'Terms of Service - SwiftQR';
  // }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        qrCodeState={dummyQrCodeState}
        setQrCodeState={dummySetQrCodeState}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-lg border-border/70">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              Welcome to SwiftQR! These terms and conditions outline the rules
              and regulations for the use of SwiftQR's Website, accessible at
              swiftqr.dev (or your deployed domain).
            </p>
            <p>
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use SwiftQR if you do not agree to
              take all of the terms and conditions stated on this page.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">
              1. License to Use Website
            </h3>
            <p>
              Unless otherwise stated, SwiftQR and/or its licensors own the
              intellectual property rights for all material on SwiftQR. All
              intellectual property rights are reserved. You may access this
              from SwiftQR for your own personal use subjected to restrictions
              set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                Republish material from SwiftQR without proper attribution.
              </li>
              <li>Sell, rent or sub-license material from SwiftQR.</li>
              <li>
                Reproduce, duplicate or copy material from SwiftQR for
                commercial purposes without explicit permission.
              </li>
              <li>
                Redistribute content from SwiftQR unless content is specifically
                made for redistribution.
              </li>
            </ul>
            <h3 className="text-xl font-semibold text-foreground pt-4">
              2. Acceptable Use
            </h3>
            <p>
              You must not use this website in any way that causes, or may
              cause, damage to the website or impairment of the availability or
              accessibility of SwiftQR or in any way which is unlawful, illegal,
              fraudulent or harmful, or in connection with any unlawful,
              illegal, fraudulent or harmful purpose or activity.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">
              3. User Content
            </h3>
            <p>
              In these terms and conditions, means material (including without
              limitation text, images, audio material, video material and
              audio-visual material) that you submit to this website, for
              whatever purpose (e.g., data for QR code generation). You grant to
              SwiftQR a worldwide, irrevocable, non-exclusive, royalty-free
              license to use, reproduce, adapt, publish, translate and
              distribute your user content in any existing or future media
              solely for the purpose of providing the QR code generation
              service.
            </p>
            <p>
              Your user content must not be illegal or unlawful, must not
              infringe any third party's legal rights, and must not be capable
              of amounting to a criminal offense or give rise to a civil
              liability, or otherwise be contrary to the law of any country or
              territory where it is or may be published or received.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">
              4. No Warranties
            </h3>
            <p>
              This website is provided “as is,” with all faults, and SwiftQR
              expresses no representations or warranties, of any kind related to
              this website or the materials contained on this website. Also,
              nothing contained on this website shall be interpreted as advising
              you.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              5. Limitation of Liability
            </h3>
            <p>
              In no event shall SwiftQR, nor any of its officers, directors and
              employees, be held liable for anything arising out of or in any
              way connected with your use of this website whether such liability
              is under contract. SwiftQR, including its officers, directors and
              employees shall not be held liable for any indirect, consequential
              or special liability arising out of or in any way related to your
              use of this website.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              6. Indemnification
            </h3>
            <p>
              You hereby indemnify to the fullest extent SwiftQR from and
              against any and/or all liabilities, costs, demands, causes of
              action, damages and expenses arising in any way related to your
              breach of any of the provisions of these terms.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              7. Severability
            </h3>
            <p>
              If any provision of these terms is found to be invalid under any
              applicable law, such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              8. Variation of Terms
            </h3>
            <p>
              SwiftQR is permitted to revise these terms at any time as it sees
              fit, and by using this website you are expected to review these
              terms on a regular basis.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              9. Governing Law & Jurisdiction
            </h3>
            <p>
              These terms will be governed by and interpreted in accordance with
              the laws of the jurisdiction in which SwiftQR is based, and you
              submit to the non-exclusive jurisdiction of the state and federal
              courts located in that jurisdiction for the resolution of any
              disputes.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              Contact Us
            </h3>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at [ Contact Email/Link].
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
