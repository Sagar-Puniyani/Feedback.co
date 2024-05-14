import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerficationEmail";
import { ApiResponse } from "@/Types/ApiResponse";

export async function SendsVerficationEmail(
    email : string,
    username : string,
    verifycode : string
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Verification Code',
            react: VerificationEmail({username : username , otp : verifycode})
        });
        return {success : true  , message : "Sending Email"}
    } catch (error) {
        console.error("Error in sending verification Email " , error);
        return {success : false , message : "Error in Sending Email"}
    }
}