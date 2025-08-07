import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/api";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: credentials.email, 
              password: credentials.password 
            }),
          });

          if (!loginRes.ok) {
            const errorData = await loginRes.json();
            throw new Error(errorData.message || "Failed to login");
          }

          const user = await loginRes.json();
          
          // For hybrid auth, we'll also create a session on the backend
          // The access token will be stored in the JWT, refresh token handled separately
          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
            image: user.profile?.image,
            role: user.role,
            verificationResponsibilities: user.verificationResponsibilities,
            accessToken: user.accessToken,
            // We'll handle refresh token storage separately
          };
        } catch (e: any) {
          console.error(e);
          throw new Error(e.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes (short-lived access tokens)
    updateAge: 5 * 60, // 5 minutes - refresh before expiry
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.verificationResponsibilities = user.verificationResponsibilities;
        token.accessToken = user.accessToken;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        session.user.verificationResponsibilities = token.verificationResponsibilities as string[];
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth?error=CredentialsSignin",
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
