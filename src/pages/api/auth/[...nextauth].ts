import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials &&
          credentials.username === process.env.ADMIN_USER &&
          credentials.password === process.env.ADMIN_PASS
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" as const }
};

export default NextAuth(authOptions);