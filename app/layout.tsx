import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kristoffer Kelly | Technical Operations Manager',
  description: 'Professional portfolio - Operations leader with 10+ years experience in legal operations, compliance, and systems automation.',
  openGraph: {
    title: 'Kristoffer Kelly | Technical Operations Manager',
    description: 'Professional portfolio - Operations leader with 10+ years experience.',
    url: 'https://imkrisk.github.io/imKrisK-widget/',
    siteName: 'imKrisK Portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
