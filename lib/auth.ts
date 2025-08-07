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
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (!loginRes.ok) {
            const errorData = await loginRes.json();
            throw new Error(errorData.message || "Failed to login");
          }

          const user = await loginRes.json();
          
          // Return user with tokens for hybrid authentication
          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
            image: user.profile?.image,
            role: user.role,
            verificationResponsibilities: user.verificationResponsibilities,
            accessToken: user.accessToken,
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
    async jwt({ token, user, trigger, session }) {
      // Initial login - store access token and user data
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
      // The session object is what's returned to the client
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
    // signOut: '/auth/logout',
    // verifyRequest: '/auth/verify-request', // For email/magic link verification
    // newUser: '/auth/register' // Optional: redirect new users (e.g. after OAuth signup) to a registration completion page
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
  secret: process.env.NEXTAUTH_SECRET,
  // Add error handling
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('NextAuth signIn event:', { user: user?.email, account: account?.provider });
    },
    async signOut({ session, token }) {
      console.log('NextAuth signOut event:', { user: session?.user?.email });
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth session event:', { user: session?.user?.email, hasToken: !!token });
      }
    },
  },
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('NextAuth Warning:', code);
      }
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    },
  },
}; 