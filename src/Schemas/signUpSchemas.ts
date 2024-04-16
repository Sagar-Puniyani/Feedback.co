import {z} from 'zod';

export const usernameValidation =  z.string()
                .min(3 , "UserName Atleast 3 Characters")
                .max(20 , "Not More than 20 characters")
                .regex(/^[a-zA-Z0-9]{3,30}$/ , "special charactes are Not allowed")

export const signUpValidation = z.object({
    username : usernameValidation,
    email : z.string().email({message : 'Email is Not Valid'}),
    password : z.string().min(6 , {message : "Password should be more than 6-digit"})
})