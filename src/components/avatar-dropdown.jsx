'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '../context/authContext'
import { SettingsIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'



export const AvatarDropdown = () => {
    const {user, logout, isAdmin } = useAuth()

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
        <Avatar className="size-9 cursor-pointer">
            <AvatarImage src= {user?.photoURL || ""} className='h-full w-full object-cover'/>
            <AvatarFallback className="bg-gray-700/30 capitalize">{user?.displayName?.slice(0,2) || "JD"}</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className="w-44">
              {
                isAdmin() && (
                    <>
                    <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                        <Link href="/all" className='flex items-center gap-2 text-xl md:text-base '>
                          Alla
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                            <Link href="/add" className='flex items-center gap-2 text-xl md:text-base '>
                              Lägg till uppgift
                            </Link>
                        </DropdownMenuItem>
                     
                      <DropdownMenuSeparator className='md:hidden' />
                    </>
                )
              }
            
            <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer">
              <Link href="/settings" className='flex items-center gap-2 text-xl md:text-base '>
                <SettingsIcon className='size-5 md:size-4'/> 
                Inställningar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="not-dark:hover:bg-gray-200 cursor-pointer text-xl md:text-base">
              < LogOutIcon className='size-6 md:size-4'/>
              Logga ut
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

  )
}
