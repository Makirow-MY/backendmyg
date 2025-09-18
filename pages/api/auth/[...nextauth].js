import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { neon } from '@netlify/neon';
import { mongooseConnect } from "@/lib/mongoose";
import { Profile } from "@/models/Profile";

 const sql = neon(); // Use process.env.DATABASE_URL if needed

export default NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        fullName: { label: 'Full Name', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
     
        let user = null;
        
        // Try Neon first
        try {
          const pgUsers = await sql`SELECT * FROM profiles WHERE email = ${credentials.email}`;
          if (pgUsers.length > 0 && pgUsers[0].password === credentials.password) {
            const pgUser = pgUsers[0];
            user = {
              _id: pgUser.id,
              email: pgUser.email,
              name: pgUser.fullname,
              image: pgUser.image,
              phoneNumber: pgUser.phonenumber,
              Country: pgUser.country
            };
          }
        } catch (neonError) {
          console.error('Neon auth failed:', neonError);
        }

        // // Fallback to Mongo
        // if (!user) {
        //   const mongoUser = await Profile.findOne({ email: credentials.email });
        //   if (mongoUser && mongoUser.password === credentials.password) {
        //     user = {
        //       _id: mongoUser._id,
        //       email: mongoUser.email,
        //       name: mongoUser.fullName,
        //       image: mongoUser.image,
        //       phoneNumber: mongoUser.phoneNumber,
        //       Country: mongoUser.Country
        //     };
        //   }
        // }

        return user || null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
});