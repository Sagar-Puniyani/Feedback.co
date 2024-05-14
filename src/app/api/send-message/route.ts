import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";
import { ApiResponseMessage } from "@/helpers/ApiResponse";
import mongoose from "mongoose";

export async function POST(request : Request){
    await dbConnect();

    const {username , content } = await request.json();
    try {
        
        const userInstance = await UserModel.findOne(username);

        if(!userInstance){
            return Response.json(
                new ApiResponseMessage(false , 'User is Not Found' ),
                { status: 404 }
            )
        }

        if (!userInstance.isAcceptingMessages){
            return Response.json(
                new ApiResponseMessage(false , 'User is Not Accepting Messages' ),
                { status: 403 }
            )
        }

        const newMessages = { content ,createdAt : new Date() };
        userInstance.messages.push(newMessages as Message);

        await userInstance.save();

        return Response.json(
            new ApiResponseMessage(true , 'Message is send successfully' ),
            { status: 205 }
        )

    } catch (error) {
        return Response.json(
            new ApiResponseMessage(false , 'Error in sending Message' ),
            { status: 501 }
        )
    }
}
