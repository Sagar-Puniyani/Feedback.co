import {z} from 'zod';

export const AcceptMessageSchema = z.object({
    isMessageAccepting : z.boolean()
})