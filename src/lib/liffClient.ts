// lib/liffClient.ts
'use client';

import liff from '@line/liff';

export const initLiff = async () => {
  try {
    if (!liff.isInitialized) {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
    }
  } catch (error) {
    console.error('LIFF init failed', error);
    throw error;
  }
};
