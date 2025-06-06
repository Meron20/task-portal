import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

function NotFound() {
  return (
    <div className='mt-[35svh] flex flex-col gap-8 items-center'>
        <h1 className='text-2xl md:text-4xl text-center font-bold'> 404 - Kunde inte hitta sidan du letade efter </h1>
        <Button asChild >
            <Link href="/" replace> Tillbaka till startsidan </Link>
        </Button>
    </div>
  )
}

export default NotFound