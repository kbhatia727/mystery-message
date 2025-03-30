import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        await dbConnect();
        console.log({ credentials });
        try {
          const userDoc = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!userDoc) {
            throw new Error("No user found with this email");
          }
          if (!userDoc.isVerified) {
            throw new Error("Please verify your email before login");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            userDoc.password
          );
          if (isPasswordCorrect) {
            // const user = userDoc.toObject();
            // user._id = user?._id?.toString();
            return userDoc;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Authorization error:", error.message);
            return null;
          } else {
            console.error("Unknown authorization error");
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
