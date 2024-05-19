"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/Schemas/signUpSchemas"
import axios from "axios";



const Page = () => {

    const [username , setUsername ] = useState('');
    const [usernameMessage , setUsernameMessage ] = useState('');
    const [isCheckingUsername , setisCheckingUsername] = useState(false);
    const [isSubmitting  , setisSubmitting ] = useState(false);
    const DobouncedUsername  = useDebounceValue(username, 500);
    const {toast}  = useToast();
    const router = useRouter();

    // zod implementation 
    const form = useForm <z.infer<typeof signUpValidation>>({
        resolver : zodResolver(signUpValidation),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    useEffect(()=> {
        const checkUniqueUsername = async () => {
            if (DobouncedUsername){
                setisCheckingUsername(isCheckingUsername => !isCheckingUsername);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/unique-username?username=${DobouncedUsername}`)
                } catch (error) {
                    
                }
            }
        }
    } , [])

    return (
        <div>
        
        </div>
    )
    }

export default Page;