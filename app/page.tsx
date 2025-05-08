'use client';
import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import Head from 'next/head';
import VolumeControl from './components/VolumeControl/VolumeControl';

export default function Home() {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <main>
        <SoundProvider>
          <VolumeControl />
          <TabataTimer />
        </SoundProvider>
      </main>
    </div>
  );
}
