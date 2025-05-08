
'use client';

import type { Metadata } from 'next';
import type { Dispatch, SetStateAction } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { QrCodeState } from '@/types/qr';

// Placeholder for metadata
// export const metadata: Metadata = {
// title: 'Privacy Policy - SwiftQR',
// description: 'Read the Privacy Policy for SwiftQR.',
// };

const dummyQrCodeState: QrCodeState = {
  value: 'https://swiftqr.dev/privacy',
  fgColor: '#262626',
  bgColor: '#FFFFFF',
  size: 256,
  level: 'M',
  includeMargin: true,
  logoUrl: '',
  logoSizeRatio: 0.15,
  logoOpacity: 1,
  logoPadding: 4,
  qrStyleOptions: {
    dotsType: 'rounded',
    cornersSquareType: undefined,
    cornersDotType: undefined,
  },
};
const dummySetQrCodeState: Dispatch<SetStateAction<QrCodeState>> = () => {
  // Does nothing on static pages
};

export default function PrivacyPage() {
  // useEffect(() => {
  //   document.title = 'Privacy Policy - SwiftQR';
  // }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header qrCodeState={dummyQrCodeState} setQrCodeState={dummySetQrCodeState} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-lg border-border/70">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>
              Your privacy is important to us. It is SwiftQR's policy to respect your privacy regarding any
              information we may collect from you across our website, swiftqr.dev (or your deployed domain), and other sites we
              own and operate.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h3>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We
              collect it by fair and lawful means, with your knowledge and consent. We also let you know why
              we’re collecting it and how it will be used. The primary data we process is the content you provide for QR code generation. This data is processed in your browser and is not stored on our servers unless explicitly stated for a specific feature (e.g., saved QR codes if such a feature is implemented).
            </p>
             <p>
              <strong>Log Data:</strong> When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details for analytical and security purposes. This data is used in an aggregated and anonymized manner where possible.
            </p>
            <p>
              <strong>QR Code Data:</strong> The data you enter to generate QR codes (URLs, text, contact information, etc.) is processed client-side in your browser. We do not store this information on our servers by default. If future features allow for saving QR codes, you will be informed about how that data is stored.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground pt-4">2. How We Use Information</h3>
            <p>
              We use the information we collect in order to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Provide, operate, and maintain our QR code generation services.</li>
              <li>Improve, personalize, and expand our website and services.</li>
              <li>Understand and analyze how you use our website to enhance user experience.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Monitor the usage of our service for security and operational stability.</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h3 className="text-xl font-semibold text-foreground pt-4">3. Data Retention</h3>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
            <p>As QR code data is primarily processed client-side, its retention is managed by your browser unless specific server-side features are used.</p>


            <h3 className="text-xl font-semibold text-foreground pt-4">4. Cookies and Tracking Technologies</h3>
            <p>
              We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
            <p>We use cookies for:</p>
             <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Essential website functionality.</li>
                <li>Analytics to understand how our website is used (e.g., Google Analytics). These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</li>
             </ul>


            <h3 className="text-xl font-semibold text-foreground pt-4">5. Security of Your Information</h3>
            <p>
              The security of your data is important to us. While we strive
              to use commercially acceptable means to protect any personal information we might collect (like log data), remember that no method of
              transmission over the Internet, or method of electronic storage, is 100% secure. We cannot guarantee
              its absolute security. Data for QR codes is processed in your browser, enhancing privacy for that specific data.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">6. Links to Other Sites</h3>
            <p>
             Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">7. Children's Privacy</h3>
            <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.</p>


            <h3 className="text-xl font-semibold text-foreground pt-4">8. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page. We will let you know via a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
            </p>
            <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

            <h3 className="text-xl font-semibold text-foreground pt-4">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Link].
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
