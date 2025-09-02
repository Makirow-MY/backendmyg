import connectToDatabase from "@/lib/mongodb";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
    providers:[
         Credentials({
            name:'credentials',
            credentials: {
                fullName: {label: 'Full Name', type: 'text'},
                email: {label: 'Email', type:'text'},
                password: {label: 'Password', type: 'password'},
               
            },
            async authorize(credentials, req) {
                  const db = await connectToDatabase();
                  const collection = db.collection('admin')
            
                    const user = await collection.findOne({email: credentials.email});

                    
                    if (user && user.password === credentials.password) {
                        return {_id: user._id, email: user.email, name: user.fullName, image: user.image, phoneNumber: user.phoneNumber, Country: user.Country};
                    }

                    return null

                }
         })
    ],
    database: process.env.MONGODB_URI,

    callbacks:{
       async jwt({token, user}) {
           if (user) {
                token._id = user._id;              
                       
           }
                      return token
        },

        async session({session, token}) {
            session.user._id = token._id;
            return session ; 
        }
    },
    pages: {
        signIn: '/auth/signin',

    }
})