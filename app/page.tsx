'use client';
import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import Head from 'next/head';
import VolumeControl from './components/VolumeControl/VolumeControl';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Tabata Timer</title>
        <meta name="description" content="A simple Tabata timer for workouts" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/apple-touch-icon-120x120.png"
        />
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
