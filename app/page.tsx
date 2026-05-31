'use client';

import TabataTimer from '@/app/components/TabataTimer';
import { SoundProvider } from '@/app/contexts';
import Settings from './components/Settings';

export default function Home() {
  return (
    <main>
      <SoundProvider>
        <Settings />
        <TabataTimer />
      </SoundProvider>
    </main>
  );
}
