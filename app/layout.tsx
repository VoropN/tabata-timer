import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tabata Timer One',
  description: 'A simple Tabata timer for workouts',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120' },
    ],
  },
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
