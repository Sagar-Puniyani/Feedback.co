import dbConnect from "@/lib";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs"
import { SendsVerficationEmail } from "@/helpers/sendRendEail";

export async function POST(request : Request){
    await dbConnect();
    try {
        const {username , email , password } = await request.json();
        const UserInstanceVerifiedByUsername  = await UserModel.findOne({
            username : username,
            isVerified : true 
        });
        
        if ( UserInstanceVerifiedByUsername){
            return Response.json(
                {
                    success : false,
                    message : "User alreadt exists"
                },{ status : 409}
            )
        }
        
        const UserInstanceVerifiedByEmail = await UserModel.findOne({email})
        let verifycode = Math.floor( 10000 + Math.random() * 90000).toString();

        if ( UserInstanceVerifiedByEmail ) {
            if (UserInstanceVerifiedByEmail.isVerified){
                return Response.json(
                    {
                        success : false,
                        message : "User is already exists"
                    } , {
                        status : 405
                    }
                )
            }
            else{
                const hashedpassword = await bcrypt.hash(password , 10);
                UserInstanceVerifiedByEmail.password = hashedpassword;
                UserInstanceVerifiedByEmail.VerificationCode = verifycode;
                UserInstanceVerifiedByEmail.VerificationCodeExpiry = new Date( Date.now() + 3600000);

                await UserInstanceVerifiedByEmail.save();
            }
        }
        else {
            const hashedpassword = await bcrypt.hash(password , 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            

            const newUserInstance = new UserModel({
                username, 
                email,
                password : hashedpassword,
                VerificationCode : verifycode,
                VerificationCodeExpiry : expiryDate,
                isVerified  : false,
                isAcceptingMessages : true,
                messages : [],
            })

            await newUserInstance.save();
        }


        const emailResponse = await SendsVerficationEmail(
            email,
            username,
            verifycode
        )

        if ( !emailResponse.success){
            return Response.json({
                success : false,
                message : emailResponse.message
            } , {status : 500 })
        }

        return Response.json(
            {
                success : true,
                message : "User Registered Verify Your Account"
            },{status : 201 }
        )


    } catch (error) {
        console.error("Error in Registering User : " , error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            {
                status : 500
            }
        )
    }
}