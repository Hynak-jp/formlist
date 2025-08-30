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
    async jwt({ token, account, profile }) {
      // JWT型は next-auth.d.ts で拡張済み（token.lineId / token.picture が使える）
      const p = (profile ?? {}) as LineProfile;

      if (account) {
        token.lineId = p.sub ?? p.userId ?? token.lineId;
        if (!token.name && (p.name || p.displayName)) {
          token.name = p.name ?? p.displayName;
        }
        if (!token.picture && (p.picture || p.pictureUrl)) {
          token.picture = p.picture ?? p.pictureUrl;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Session も拡張済み（session.lineId が使える）
      session.lineId = token.lineId;
      if (session.user && token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
