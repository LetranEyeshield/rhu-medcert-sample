import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";


function euclideanDistance(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
    updateAge: 0, // do NOT extend session on activity
  },

  jwt: {
    maxAge: 12 * 60 * 60,
  },

  cookies: {
  sessionToken: {
    name:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",

      // ⭐ IMPORTANT
      maxAge: undefined, // session cookie -> deleted on browser close
    },
  },
},

  providers: [
    Credentials({
      name: "Face Login",
      credentials: {
        // fullName: { label: "Full Name", type: "text" },
        faceDesc: { label: "Face Descriptor", type: "text" },
      },

      async authorize(credentials) {
        // if (!credentials?.fullName || !credentials?.faceDesc) return null;
          if (!credentials?.faceDesc) return null;

        const faceDescArray = JSON.parse(credentials.faceDesc);

        await connectDB();
        const users = await User.find();

        let matchedUser = null;

        for (const user of users) {
          const distance = euclideanDistance(faceDescArray, user.faceDesc);
          if (distance < 0.6) {
            matchedUser = user;
            break;
          }
        }

        if (!matchedUser) return null;

        return {
          id: matchedUser._id.toString(),
          fullName: matchedUser.fullName,
        };
      },
    }),
  ],

  // ⭐ THIS IS THE IMPORTANT PART
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.fullName = user.fullName;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.fullName = token.fullName as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };