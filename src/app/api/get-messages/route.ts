import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "@/models/user.model";
import { ApiResponseMessage } from "@/helpers/ApiResponse";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect();
    
    const session = await getServerSession(AuthOptions);
    const UsersessionInstance = session?.user as User;
    
    if (!session || !session.user) {
        return Response.json(
            new ApiResponseMessage(false , 'Not authenticated' ),
            { status: 401 }
        )
    }
    
    const userId = new mongoose.Types.ObjectId( UsersessionInstance?._id);

    try {
        
        const userInstance = await UserModel.aggregate([
            {$match : { _id : userId }},
            {$unwind :  "$messages" },
            {$sort : {'messages.createdAt' : -1 }},
            {$group : { _id: '$_id', messages: { $push: '$messages' } }}
        ]).exec()

        if (!userInstance || userInstance.length === 0){
            return Response.json(
                new ApiResponseMessage(false , 'User Not Found' ),
                { status: 401 }
            )
        }

        return Response.json(
            new ApiResponseMessage(true  , 
                                    'Messages Found Successfully' , 
                                    userInstance[0].messages ),
            { status: 206 }
        )

    } catch (error) {
        return Response.json(
            new ApiResponseMessage(false , 'Not authenticated' ),
            { status: 401 }
        )
    }
}