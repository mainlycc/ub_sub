import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Scripts } from "@/components/Scripts";
import { ClientOnlyComponents } from "@/components/ClientOnlyComponents";
import StickyCTA from "@/components/StickyCTA";
import { Metadata } from "next";
import { generateInsuranceAgencySchema } from "@/lib/structured-data";

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
  description: 'Kalkulator ubezpieczenia GAP online. Kompleksowa ochrona przed utratą wartości pojazdu. Szybka wycena i polisa online w 5 minut.',
  keywords: [
    'ubezpieczenie GAP',
    'ubezpieczenie GAP online',
    'kalkulator GAP',
    'ubezpieczenie samochodu',
    'ochrona wartości pojazdu',
    'ubezpieczenie komunikacyjne',
    'polisa GAP',
    'GAP fakturowy',
    'GAP casco',
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
    description: 'Kalkulator ubezpieczenia GAP online. Kompleksowa ochrona przed utratą wartości pojazdu. Szybka wycena i polisa online w 5 minut.',
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
    description: 'Kalkulator ubezpieczenia GAP online. Kompleksowa ochrona przed utratą wartości pojazdu. Szybka wycena i polisa online.',
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
  const insuranceAgencySchema = generateInsuranceAgencySchema();
  
  return (
    <html lang="pl" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(insuranceAgencySchema),
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#EAE7FC] min-h-screen flex flex-col m-0 p-0`}>
        <Scripts />
        <Navbar />
        <StickyCTA />
        <main className="flex-grow">
          {children}
        </main>
        <ClientOnlyComponents />
        <Analytics />
      </body>
    </html>
  );
}
