"use client"

import dynamic from "next/dynamic";

const CallToActionPopup = dynamic(() => import("@/components/CallToActionPopup").then(mod => ({ default: mod.CallToActionPopup })), {
  ssr: false,
});

const CookieBanner = dynamic(() => import("@/components/CookieBanner").then(mod => ({ default: mod.CookieBanner })), {
  ssr: false,
});

export function ClientOnlyComponents() {
  return (
    <>
      <CallToActionPopup />
      <CookieBanner />
    </>
  );
}

