import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from './metadata';
import { ClientLayout } from '@/components/ClientLayout';

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
