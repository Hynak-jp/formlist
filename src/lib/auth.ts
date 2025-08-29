import { NextAuthOptions, type Session } from "next-auth";
import LineProvider from "next-auth/providers/line";
import type { JWT } from "next-auth/jwt";

type MyJWT = JWT & { lineId?: string; picture?: string };
type LineProfile = Partial<{
  sub: string;
  userId: string;
  name: string;
  displayName: string;
  picture: string;
  pictureUrl: string;
}>;

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }): Promise<MyJWT> {
      const p = (profile ?? {}) as LineProfile;
      const t = token as MyJWT;

      if (account) {
        t.lineId = p.sub || p.userId || t.lineId;
        if (!t.name) t.name = p.name || p.displayName || t.name;
        t.picture = t.picture || p.picture || p.pictureUrl;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as MyJWT;
      (session as Session & { lineId?: string }).lineId = t.lineId;
      if (session.user && t.picture) session.user.image = t.picture;
      return session;
    },
  },
};
