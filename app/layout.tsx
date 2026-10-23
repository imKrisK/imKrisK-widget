import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Kristoffer Imkrisk | AI Builder & Operations Leader',
  description: 'Full-stack operations leader and AI systems builder. Explore technical innovation, AI/ML capabilities, and leadership experience.',
  keywords: ['AI', 'Operations', 'Leadership', 'Software Architecture', 'Innovation'],
  authors: [{ name: 'Kristoffer Imkrisk' }],
  robots: {
    index: true,
    follow: true,
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
