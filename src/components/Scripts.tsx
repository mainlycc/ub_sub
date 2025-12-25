'use client';

import Script from 'next/script';

export function Scripts() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17791274207"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17791274207');
          `,
        }}
      />

      {/* Facebook Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
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
          alt=""
        />
      </noscript>

      {/* Hotjar Tracking Code */}
      <Script
        id="hotjar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments);};
              h._hjSettings={hjid:6580007,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      />
    </>
  );
}

