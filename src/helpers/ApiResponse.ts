import { ApiResponse } from "@/Types/ApiResponse";
import { Message } from "@/models/user.model";

class ApiResponseMessage  {

    success : boolean;
    message : string;
    isAcceptingMessages ?: boolean;
    Messages ?: Array<Message>; 


    constructor(success : boolean,
        message : string,
        isAcceptingMessages ?: boolean,
        Messages ?: Array<Message> ) {
        this.success = success;
        this.message = message;
        this.isAcceptingMessages = isAcceptingMessages;
        this.Messages = Messages;
    }
}

export {ApiResponseMessage}