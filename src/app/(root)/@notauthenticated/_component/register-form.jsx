'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '../../../../context/authContext'
import { getErrorMessage } from '../../../../lib/getFirebaseError'
 

export const registerFormSchema = z.object({
    displayName: z.string()
    .nonempty({ message: "Du måste ange ett användarnamn"})
    .min(3, {message: "Användarnamnet måste vara minst 3 tecken långt"})
    .max(50, {message: "Användarnamnet får inte vara längre än 50 tecken"}),
    email: z.string().email({ message: "Du måste ange en giltig epostadress"}),
    password:  z.string().nonempty({ message: "Du måste ha ett lösenord"})
    .min(6, {message: "Lösenordet måste vara minst 6 tecken lång"}),
    confirmPassword: z.string().nonempty({ message: "Du måste bekräfta lösenordet"})
}).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword']
})
  
export const RegisterForm = ({ changeForm, registerForm}) => {

    const [errorMessage, setErrorMessage] = useState(null)
   
    const { register, loading} = useAuth()
    
   

   async function onSubmit(values){

    try {
        const {email, password, displayName } = values
        await register (email, password, displayName) 
        
    } catch (error) {
      const errorMessage = getErrorMessage(error.code)
        setErrorMessage(errorMessage)
       
    } 
    console.log(values)
    }
  return (
    <>
       <h2 className='text-center font-semibold text-2xl mb-5'> Registrera nytt konto </h2>
       { errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p> }
       <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Användarnamn</FormLabel>
                        <FormControl>
                            <Input className='not-dark: border-gray-300' {...field} />
                        </FormControl>
                        <FormDescription> Detta kommer att vara ditt publika användarnamn på plattformen</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Epost</FormLabel>
                        <FormControl>
                            <Input type="email" className='not-dark: border-gray-300' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lösenord</FormLabel>
                        <FormControl>
                            <Input type="password" className='not-dark: border-gray-300' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel> Bekräfta Lösenord</FormLabel>
                        <FormControl>
                            <Input type="password" className='not-dark: border-gray-300' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                 <p>Har du redan ett konto? <span onClick={() => changeForm("login")} className='underline cursor-pointer'>Logga in här</span></p>
    
                <Button disabled ={loading} className='w-full sm:w-auto' type="submit">Registrera</Button>
            </form>
       </Form>
   </>
  )
}
