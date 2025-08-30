// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    lineId?: string;
    user?: DefaultSession['user'] & {
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    lineId?: string;
    picture?: string;
  }
}
