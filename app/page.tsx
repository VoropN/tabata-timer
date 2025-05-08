'use client';
import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import Head from 'next/head';
import Settings from './components/Settings';

export default function Home() {
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
