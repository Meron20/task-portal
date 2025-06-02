'use client'

import { parse, isValid } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useUsers } from '../../../../../../context/userContext'
import { TaskCard } from '../../../../../../components/tasks/tasks-card'

export const AllUsersTaskList = () => {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()

  const selectedDate = isValid(parsed) ? parsed : new Date()

  const { users } = useUsers()

  return (
    <>
        {
            users.length && users.map(user => {
                if(user.verified){
                  return <TaskCard  key={user.uid} date={selectedDate} user={user} className='w-72'/>

                }
            })
        }
    </>

    
  )
}
