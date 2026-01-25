// Google Analytics 4 event tracking helpers

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Specific event trackers
export const trackCalculatePremium = (data: {
  carPrice: number;
  insuranceType: string;
  premium: number;
}) => {
  trackEvent('calculate_premium', {
    car_price: data.carPrice,
    insurance_type: data.insuranceType,
    premium: data.premium,
    event_category: 'engagement',
    event_label: 'Insurance Calculator',
  });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
    event_category: 'engagement',
  });
};

export const trackFormSubmit = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    event_category: 'conversion',
  });
};

export const trackPhoneClick = (location: string) => {
  trackEvent('phone_click', {
    location: location,
    event_category: 'engagement',
    event_label: 'Contact',
  });
};
