import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import {z} from 'zod';
import { verifySchema } from "@/Schemas/verifySchemas"; 
import { ApiResponseMessage } from "@/helpers/ApiResponse";
import { User } from "next-auth";


export async function POST(request : Response){
    await dbConnect();

    try {
        const {username , code } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const UserInstance  = await UserModel.findOne({
            username : decodedUsername
        });

        if (!UserInstance){
            new ApiResponseMessage(false ,"User Not Found" ),
            { status : 405}
        }
        
        const isCorrectCode = code === UserInstance?.VerificationCode;
        const isNotExpired = new Date(UserInstance?.VerificationCodeExpiry!) > new Date();

        if (isCorrectCode && !isNotExpired){
            (UserInstance as User).isVerified = true;
            await UserInstance?.save();

            return new ApiResponseMessage(true ,"verification code" ),
        { status : 405}
        }
        
        else if (!isNotExpired){
            new ApiResponseMessage(false ,"Verification time limit is expired" ),
            { status : 405}            
        }
        if (!isCorrectCode){
            new ApiResponseMessage(false ,"Incorrect Verification Code" ),
            { status : 405}            
        }

        

    } catch (error) {
        console.error("Error checking User name " , error);
        return Response.json(
            new ApiResponseMessage(false , "Error Checking User Name" ),
            { status : 506}
        )
    }
}