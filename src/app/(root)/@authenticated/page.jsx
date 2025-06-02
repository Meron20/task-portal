'use client'

import React from 'react'
import { Header } from '../../../components/header'
import { TaskCard} from '../../../components/tasks/tasks-card'
import { parse, isValid, format, addDays} from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/authContext'

function HomePage() {

  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()

  const selectedDate = isValid(parsed) ? parsed : new Date()

  const { user } = useAuth()

  return (
    <>
      < Header/>
      <div className='mt-10 pb-20'>
        {
          user ? (
            <TaskCard date={selectedDate} user={user} />

          ) : (
            <p className='text-center text-muted'> Loading tasks..</p>
          )
        }
       
      </div>
    
    </>
  )
}

export default  HomePage