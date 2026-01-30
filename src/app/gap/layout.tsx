import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kup ubezpieczenie GAP',
  description: 'Kup ubezpieczenie GAP online lub telefonicznie. Wybierz wygodny dla siebie sposób zakupu. Polisa w 5 minut.',
};

export default function GapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
