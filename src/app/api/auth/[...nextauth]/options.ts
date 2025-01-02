import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      // Fetch the user's most used programming languages
      const res = await fetch(`https://api.github.com/users/${user.name}/repos`);
      const repos = await res.json();

      let languageCount: { [key: string]: number } = {};
      for (const repo of repos) {
        if (repo.language) {
          if (!languageCount[repo.language]) {
            languageCount[repo.language] = 0;
          }
          languageCount[repo.language]++;
        }
      }

      // Sort languages by frequency
      const sortedLanguages = Object.entries(languageCount).sort(
        (a, b) => b[1] - a[1]
      );
      const mostUsedLanguage = sortedLanguages.length
        ? sortedLanguages[0][0] ?? undefined  // Use nullish coalescing to avoid null
        : undefined;

      // Append the most used language to the session
      session.user.mostUsedLanguage = mostUsedLanguage;

      return session;
    },
  },
};

export default NextAuth(authOptions);