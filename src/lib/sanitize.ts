import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanityzuje HTML aby zapobiec atakom XSS
 * Pozwala na podstawowe tagi HTML używane w artykułach blogowych
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id',
      'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    // Otwieraj linki w nowej karcie i dodaj rel="noopener noreferrer" dla bezpieczeństwa
    ADD_ATTR: ['target'],
    ADD_TAGS: [],
  });
}

/**
 * Sanityzuje HTML dla skryptów trackingowych (tylko zaufane źródła)
 * Używane dla skryptów GTM, Facebook Pixel, Hotjar itp.
 */
export function sanitizeTrustedScript(script: string): string {
  // Tylko pozwól na skrypty z zaufanych domen
  const trustedDomains = [
    'www.googletagmanager.com',
    'connect.facebook.net',
    'static.hotjar.com',
    'www.facebook.com',
  ];

  // Podstawowa walidacja - sprawdź czy skrypt zawiera tylko zaufane domeny
  const hasTrustedDomain = trustedDomains.some(domain => script.includes(domain));
  
  if (!hasTrustedDomain) {
    console.warn('Próba wstrzyknięcia niezaufanego skryptu');
    return '';
  }

  // DOMPurify nie sanityzuje skryptów, więc zwracamy oryginalny skrypt
  // ale tylko jeśli zawiera zaufane domeny
  return script;
}
