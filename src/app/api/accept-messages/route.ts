import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "@/models/user.model";
import { ApiResponseMessage } from "@/helpers/ApiResponse";

export async function POST(request : Request){
    await dbConnect();
    
    const session = await getServerSession(AuthOptions);
    const UsersessionInstance = session?.user as User;
    
    if (!session || !session.user) {
        return Response.json(
            new ApiResponseMessage(false , 'Not authenticated' ),
            { status: 401 }
        )
    }
    
    const userId = UsersessionInstance?._id;
    const {acceptMessages } = await request.json();
    
    
    try {
        const UserUpdatedInstance = UserModel.findByIdAndUpdate(userId , 
                                {isVerified : acceptMessages } , 
                                {new : true});

            
        
        if ( !UserUpdatedInstance){
            return Response.json(
                new ApiResponseMessage(false , "Error while getting the status of acceptance of Messages"),
                {status : 406}
            )
        }

        return Response.json(
            {
                success : true,
                message : "Successfully update the status of Accepting Messages",
                UserUpdatedInstance
            },
            {status : 203}
        )

    } catch (error) {
        console.log("Error in handling the Accept messages " , error);
        return  Response.json(
            new ApiResponseMessage(false , 'Error retrieving message acceptance status' ),
            { status: 501 }
        )
    }

}

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
    
    const userId = UsersessionInstance?._id;

    try {
        const UserInstance: User | null = await UserModel.findById(userId);

        if (!UserInstance){
            return Response.json(
                new ApiResponseMessage(false , "Error while getting the status of acceptance of Messages"),
                {status : 406}
            )
        }

        return Response.json(
            {
                success : true,
                message : "Successfully update the status of Accepting Messages",
                isAcceptingMessages : UserInstance?.isAcceptingMessages,
                UserInstance
            },
            {status : 203}
        )


    } catch (error) {
        console.log("Error in handling the Accept messages " , error);
        return  Response.json(
            new ApiResponseMessage(false , 'Error retrieving message acceptance status' ),
            { status: 501 }
        )
    }
}