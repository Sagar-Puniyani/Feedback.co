import {z} from 'zod';
import { usernameValidation } from './signUpSchemas';

export const signInSchema = z.object({
    username : usernameValidation,
    password : z.string().min(6 , {message : "Password should be more than 6-digit"})
})