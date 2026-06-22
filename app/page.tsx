'use client';

import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import { useEffect } from 'react';
import Settings from './components/Settings';

export default function Home() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <main>
      <SoundProvider>
        <Settings />
        <TabataTimer />
      </SoundProvider>
    </main>
  );
}
