import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import {z} from 'zod';
import { usernameValidation } from "@/Schemas/signUpSchemas";
import { ApiResponseMessage } from "@/helpers/ApiResponse";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
        
    await dbConnect();
    try {
        const  {searchParams} = new URL(request.url);
        const queryParams = {
            username : searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log("Result validation : " , result); 
        

        if ( !result.success){
            const userNameError = result.error.format().username?._errors || [];
            const respondingError = userNameError?.length>=0 
                                    ? userNameError.join(", ") 
                                    : "invalid user name"
            return Response.json(
                new ApiResponseMessage(false ,respondingError ),
                { status : 407}
            )
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username , isVerified : true});

        if (existingVerifiedUser){
            return Response.json(
                new ApiResponseMessage(false ,"Username Already Taken" ),
                { status : 407}
            )
        }
        
        
        return Response.json(
            new ApiResponseMessage(true ,"Username is Avaliable" ),
            { status : 205}
        )


    } catch (error) {
        console.error("Error checking User name " , error);
        return Response.json(
            new ApiResponseMessage(false , "Error Checking User Name" ),
            { status : 506}
        )
    }
}