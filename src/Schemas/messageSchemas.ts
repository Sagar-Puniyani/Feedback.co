import {z} from 'zod';

export const MessageSchema = z.object({
    content : z.string()
        .min(10 , {message :"Content Must be greater than 10 characters"})
        .max(500 , {message :"Content Must be lesser than 500 characters"})
})