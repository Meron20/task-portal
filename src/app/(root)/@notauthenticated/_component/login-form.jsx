'use client'

import React, { useState } from 'react'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '../../../../context/authContext'
import { getErrorMessage } from '../../../../lib/getFirebaseError'
import { ResetPasswordDialog } from './reset-password-dialog'
import { usePasswordReset } from '@/context/password-reset-context'
 

export const loginFormSchema = z.object({
  
    email: z.string().email({ message: "Du måste ange en giltig epostadress"}),
    password:  z.string().nonempty({ message: "Du måste ha ett lösenord"})
})
  
export const LoginForm = ({ changeForm, loginForm }) => {

    const [errorMessage, setErrorMessage] = useState(null)
     const { login, loading} = useAuth()
     const {setOpen} = usePasswordReset()
    

   async function onSubmit(values){
        try {
         await login(values.email, values.password)
        } catch (error) {
          const errorMessage = getErrorMessage(error.code) 
          setErrorMessage(errorMessage)
        }
    
    }
  return (
    <>
       <h2 className='text-center font-semibold text-2xl mb-5'> Logga in </h2>
       { errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p> }
       <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8">
               
                 <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lösenord</FormLabel>
                        <FormControl>
                            <Input type="password" className='not-dark: border-gray-300' {...field} />
                        </FormControl>
                        <FormMessage />

                        <p>Glömt ditt lösenord? <span onClick={() => setOpen(true)}  className='underline cursor-pointer'>Skicka återställningslänk</span></p>
                      
                    </FormItem>
                )}
                />
                <p>Har du inget konto? <span onClick={() => changeForm("register")} className="underline cursor-pointer">Registrera dig här</span></p>
               
                <Button  disabled={loading} className="w-full sm:w-auto" type="submit">Logga in</Button>
            
            </form>
       </Form>
   </>
  )
}
