// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

// LINE プロファイルの想定キーだけ拾って型定義
type LineProfile = {
  sub?: string; // OIDC subject（ユーザーID）
  userId?: string; // 互換用
  name?: string;
  displayName?: string; // 互換用
  picture?: string;
  pictureUrl?: string; // 互換用
};

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid profile' } },
      checks: ['pkce', 'state'],
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile }) {
      const p = (profile ?? {}) as LineProfile;

      if (p.sub) token.lineId = p.sub;
      if (p.name) token.name = p.name;

      const pic = p.picture ?? p.pictureUrl;
      if (pic) token.picture = pic;

      return token;
    },
    async session({ session, token }) {
      session.lineId = token.lineId ?? undefined;

      if (session.user) {
        if (token.name) session.user.name = String(token.name);
        if (token.picture) session.user.image = String(token.picture);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
