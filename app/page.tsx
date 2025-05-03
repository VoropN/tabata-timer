// pages/index.tsx
import TabataTimer from '@/components/TabataTimer';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Tabata Timer</title>
        <meta name="description" content="A simple Tabata timer for workouts" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main>
        <TabataTimer />
      </main>
    </div>
  );
}
