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
      <head>
        {/* Facebook Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)}
              ;if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0
              ';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window,document, 'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2207464152992298');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2207464152992298&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Facebook Pixel Code */}
      </head>
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
