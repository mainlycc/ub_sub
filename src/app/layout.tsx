import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Scripts } from "@/components/Scripts";
import { ClientOnlyComponents } from "@/components/ClientOnlyComponents";
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  || 'https://gapauto.pl';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ubezpieczenie GAP - Kalkulator Online | GapAuto.pl',
    template: '%s | GapAuto.pl'
  },
  description: 'Kalkulator ubezpieczenia GAP online. Porównaj oferty ubezpieczeń GAP, OC i AC. Kompleksowa ochrona przed utratą wartości pojazdu. Szybkie obliczenie składki i wygodna polisa online. Sprawdź już dziś!',
  keywords: [
    'ubezpieczenie GAP',
    'ubezpieczenie GAP online',
    'kalkulator GAP',
    'ubezpieczenie samochodu',
    'OC AC',
    'ubezpieczenie OC',
    'ubezpieczenie AC',
    'ochrona wartości pojazdu',
    'ubezpieczenie komunikacyjne',
    'polisa GAP',
    'GapAuto.pl'
  ],
  authors: [{ name: 'GapAuto.pl' }],
  creator: 'GapAuto.pl',
  publisher: 'GapAuto.pl',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: baseUrl,
    siteName: 'GapAuto.pl',
    title: 'Ubezpieczenie GAP - Kalkulator Online | GapAuto.pl',
    description: 'Kalkulator ubezpieczenia GAP online. Porównaj oferty ubezpieczeń GAP, OC i AC. Kompleksowa ochrona przed utratą wartości pojazdu. Szybkie obliczenie składki i wygodna polisa online.',
    images: [
      {
        url: `${baseUrl}/BC.png`,
        width: 1200,
        height: 630,
        alt: 'GapAuto.pl - Ubezpieczenie GAP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubezpieczenie GAP - Kalkulator Online | GapAuto.pl',
    description: 'Kalkulator ubezpieczenia GAP online. Porównaj oferty ubezpieczeń GAP, OC i AC. Kompleksowa ochrona przed utratą wartości pojazdu.',
    images: [`${baseUrl}/BC.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    // Możesz dodać weryfikację Google Search Console tutaj
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="h-full">
      <head>
        <Script
          id="gtm-consent-default"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});
            `.trim(),
          }}
        />

        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQXB4X9V');
            `.trim(),
          }}
        />
      </head>

      <body className={`${inter.className} bg-[#EAE7FC] min-h-screen flex flex-col m-0 p-0`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NQXB4X9V"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Scripts />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <ClientOnlyComponents />
        <Analytics />
      </body>
    </html>
  );
}
