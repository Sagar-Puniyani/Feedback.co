import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib";
import UserModel from "@/models/user.model";



export const  AuthOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: 'Credentials',
            name : 'Credentials',

            credentials: {
                username: { label: "Username/email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any ): Promise<any>{
                await dbConnect();
                try {
                    const UserInstance = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier} ,
                            {username : credentials.identifier}]
                    })

                    if ( !UserInstance){
                        throw new Error("No User Found");
                    }
                    if ( !UserInstance.isVerified){
                        throw new Error("Verify your Account First");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , UserInstance.password);
                    if ( !isPasswordCorrect){
                        throw new Error("You Entered wrong password");
                    }

                    return UserInstance;

                } catch (err : any ) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if (user ){
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }

            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session : {
        strategy : 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,

}