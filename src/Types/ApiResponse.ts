import { Message } from "@/models/user.model";

export interface ApiResponse {
    success : boolean;
    messages : string;
    isAcceptingMessages ?: boolean;
    Messages ?: Array<Message>;
}