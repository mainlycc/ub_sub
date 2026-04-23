import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://gapauto.pl";

const gapDescription =
  "Oblicz i kup GAP w kilka minut – wszystko w jednym miejscu.";

export const metadata: Metadata = {
  description: gapDescription,
  openGraph: {
    description: gapDescription,
    url: `${baseUrl}/gap`,
  },
  twitter: {
    description: gapDescription,
  },
  alternates: {
    canonical: `${baseUrl}/gap`,
  },
};

export default function GapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
