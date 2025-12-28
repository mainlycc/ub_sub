import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Scripts } from "@/components/Scripts";
import { ClientOnlyComponents } from "@/components/ClientOnlyComponents";
import { Metadata } from "next";

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
      <body className={`${inter.className} bg-[#EAE7FC] min-h-screen flex flex-col m-0 p-0`}>
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
