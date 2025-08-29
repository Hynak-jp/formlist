import { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      // authorization: { params: { scope: "profile openid email" } }, // email要るなら
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      const p: any = profile || {};
      if (account) {
        token.lineId = p.sub || p.userId || token.lineId;
        token.name = token.name || p.name || p.displayName || token.name;
        token.picture = token.picture || p.picture || p.pictureUrl;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).lineId = (token as any).lineId;
      if (session.user && token.picture) session.user.image = token.picture as string;
      return session;
    },
  },
};
