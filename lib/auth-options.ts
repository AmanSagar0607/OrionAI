import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';

// Extend the Session interface to include the user role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role?: string;
    hashedPassword?: string;
  }
}

export const authOptions: AuthOptions = {
  // Configure the MongoDB adapter
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB,
  }),
  
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const client = await clientPromise;
        const db = client.db();
        
        const user = await db.collection('users').findOne({ 
          email: credentials.email 
        });
        
        if (!user || !user.hashedPassword) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  
  callbacks: {
    async session({ session, token, user }) {
      console.log('Session callback - token:', token);
      console.log('Session callback - user:', user);
      
      if (session.user) {
        // Create a new session object with the required properties
        const sessionUser = {
          ...session.user,
          id: token.sub || '',
          role: (token.role as string) || 'user',
        };
        
        // Add optional properties if they exist
        if (token.name) sessionUser.name = token.name as string;
        if (token.email) sessionUser.email = token.email as string;
        if (token.image) sessionUser.image = token.image as string;
        
        // Assign back to session.user
        session.user = sessionUser;
      }
      
      console.log('Session callback - final session:', session);
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback - token:', token);
      console.log('JWT callback - user:', user);
      
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      
      // Update token with user data if available
      if (user) {
        token = {
          ...token,
          ...(user.id && { id: user.id }),
          ...(user.name && { name: user.name }),
          ...(user.email && { email: user.email }),
          ...(user.image && { image: user.image }),
          ...(user.role && { role: user.role })
        };
      }
      
      console.log('JWT callback - final token:', token);
      return token;
    },
  },
  
  session: {
    strategy: 'jwt',
    // Use a secure, HTTP-only cookie for the session
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  } as const,
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Enable debug logging in development
  logger: {
    error(code: string, metadata: any) {
      console.error('Auth Error:', code, metadata);
    },
    warn(code: string) {
      console.warn('Auth Warning:', code);
    },
    debug(code: string, metadata: any) {
      console.log('Auth Debug:', code, metadata);

    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
