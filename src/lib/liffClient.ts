// lib/liffClient.ts
'use client';

import liff from '@line/liff';

let liffInitialized = false;

export const initLiff = async () => {
  try {
    if (!liffInitialized) {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
      liffInitialized = true;
    }
  } catch (error) {
    console.error('LIFF init failed', error);
    throw error;
  }
};
