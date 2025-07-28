// Facebook Pixel Event Tracking

type FacebookPixelCommand = 'init' | 'track';
type FacebookPixelEvent = 'PageView' | 'ViewContent' | 'Lead' | 'InitiateCheckout' | 'AddToCart' | 'Purchase';

declare global {
  interface Window {
    fbq: (
      command: FacebookPixelCommand,
      eventName?: FacebookPixelEvent | string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}

// Podstawowe zdarzenia Facebook Pixel
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackViewContent = (contentName?: string, contentCategory?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
    });
  }
};

export const trackLead = (contentName?: string, contentCategory?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: contentName,
      content_category: contentCategory,
    });
  }
};

export const trackInitiateCheckout = (value?: number, currency?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: currency || 'PLN',
    });
  }
};

export const trackAddToCart = (value?: number, currency?: string, contentName?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      value: value,
      currency: currency || 'PLN',
      content_name: contentName,
    });
  }
};

export const trackPurchase = (value?: number, currency?: string, contentName?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency || 'PLN',
      content_name: contentName,
    });
  }
};

// Zdarzenia specyficzne dla ubezpieczeń
export const trackInsuranceQuote = (insuranceType?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: `Insurance Quote - ${insuranceType}`,
      content_category: 'Insurance',
      value: value,
      currency: 'PLN',
    });
  }
};

export const trackBlogView = (articleTitle?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: articleTitle,
      content_category: 'Blog',
    });
  }
};

export const trackContactForm = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Contact Form',
      content_category: 'Contact',
    });
  }
};

// Hook do automatycznego śledzenia zmian stron
export const useFacebookPixel = () => {
  const trackPageViewOnMount = () => {
    if (typeof window !== 'undefined') {
      // Śledź wyświetlenie strony po załadowaniu
      setTimeout(() => {
        trackPageView();
      }, 100);
    }
  };

  return { trackPageViewOnMount };
}; 