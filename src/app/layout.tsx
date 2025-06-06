import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CallToActionPopup } from "@/components/CallToActionPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Ubezpieczenie GAP',
  description: 'Platforma ubezpieczeniowa do obsługi ubezpieczeń GAP',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="h-full">
      <body className={`${inter.className} bg-[#EAE7FC] min-h-screen flex flex-col m-0 p-0`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <CallToActionPopup />
      </body>
    </html>
  );
}
