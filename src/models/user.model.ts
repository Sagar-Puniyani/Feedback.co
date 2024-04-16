import mongoose , {Schema , Document, Model} from "mongoose";

export interface Message extends Document {
    content : string;
    createdAt : Date;
}


const MessageSchema : Schema<Message> = new mongoose.Schema( {
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
})

export interface User extends Document {
    username : string; 
    email : string;
    password : string;
    VerificationCode : string;
    VerificationCodeExpiry : Date;
    isVerified  : boolean;
    isAcceptingMessages : boolean;
    messages : Message[]
}


const UserSchema : Schema<User> = new mongoose.Schema( {
    username :{
        type : String,
        required : [true , "username is required"],
        trim : true,
        unique :true
    },
    email : {
        type : String,
        required : [true , "Email is Required"],
        trim : true,
        unique : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Use valid Email"]
    },
    password :{
        type : String,
        required : [true , "Password is Required"],
    },
    VerificationCode : {
        type : String,
        required : [true , "Verification Code is Required"],
    },
    VerificationCodeExpiry :{
        type : Date,
        required : [true , "Expiry Date is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>( "User" , UserSchema);

export default UserModel;