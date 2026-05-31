import { useEffect, useRef } from 'react';

type NavigatorWithWakeLock = Navigator & {
  wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinel> };
};

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const enabledRef = useRef(enabled);

  enabledRef.current = enabled;

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        const nav = navigator as NavigatorWithWakeLock;
        if ('wakeLock' in nav && enabledRef.current) {
          wakeLockRef.current = await nav.wakeLock.request('screen');
        }
      } catch {
        // Wake lock may be denied when tab is not visible
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch {
          // Already released
        }
        wakeLockRef.current = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabledRef.current) {
        requestWakeLock();
      }
    };

    if (enabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      releaseWakeLock();
    };
  }, [enabled]);
}
