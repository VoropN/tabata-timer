'use client';
import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import Head from 'next/head';
import { useEffect } from 'react';
import Settings from './components/Settings';

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        // Optionally check for updates every time the page loads
        reg.update();
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SoundProvider>
          <Settings />
          <TabataTimer />
        </SoundProvider>
      </main>
    </div>
  );
}
