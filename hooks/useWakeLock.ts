import { useEffect, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && enabled) {
          wakeLockRef.current = await (navigator as any).wakeLock.request(
            'screen'
          );
          console.log('✅ Wake lock acquired');
        }
      } catch (err) {
        console.warn('⚠️ Wake lock request failed:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('⛔ Wake lock released');
      }
    };

    if (enabled) requestWakeLock();
    return () => {
      releaseWakeLock();
    };
  }, [enabled]);
}
