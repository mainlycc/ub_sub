import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się z nami. Telefon: 796 148 577, Email: biuro@gapauto.pl. Odpowiadamy na pytania o ubezpieczenia GAP.',
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
