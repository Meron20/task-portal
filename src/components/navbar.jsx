'use client'

import { Poppins } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import {Button} from './ui/button'
import { AvatarDropdown } from './avatar-dropdown'
import { useAuth } from '../context/authContext'
import { useSearchParams } from 'next/navigation'


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]

})

export const Navbar = () => {

    const  { isAdmin } = useAuth()
     
    const searchParams = useSearchParams()
    const date = searchParams.get('date')


  return (
    <nav className='flex item-center justify-between pb-10 '>
        <div>
            <h1 className='block sm:hidden sr-only'>Arbetsuppgifterportal</h1>
            <Link className={cn ("text-3xl font-bold hidden  sm:block", poppins.className)} href="/"><h1>Arbetsuppgiftsportal</h1></Link>
            <Link className={cn ("text-4xl font-bold block sm:hidden ", poppins.className)}  href="/">aup</Link>
        </div>
        <div className='flex items-center gap-2'> 
             <Button asChild varient="outline" size="lg">
                <Link href={`${date
                    ? `/?date=${date}`
                    : "/"
                    }`
                    }>Mina uppgifter</Link>
             </Button> 
        
        {
            isAdmin() && (
                <>
                  <Button asChild varient="outline" size="lg" className="hidden md:flex">
                     <Link href={`${date
                     ? `/all/?date=${date}`
                     : "/all"
                     }`
                     }>Alla</Link>
                 </Button> 
                 <Button asChild varient="outline" size="lg" className="hidden md:flex">
                     <Link href="/add">Lägg till uppgift</Link>
                 </Button> 
                </>
                
            )
        }

         <AvatarDropdown/>
      </div>
    </nav>
  )
}
