import React from 'react'
import { Poppins } from 'next/font/google'
import { AuthFormView } from './_component/auth-form-view'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700']
})


function AuthPage() {

  return (
    
    <div>
       <h2 className='text-center  max-w-2xl text-4xl mx-auto my-20'>
         Välkommen till <span className={poppins.className}>Arbetsuppgifterportal</span>. Logga in för att fortsätta till sidan 
        </h2>

        < AuthFormView/>
    </div>
  )
}

export default AuthPage