'use client'

import React, { useEffect, useState,  useRef } from 'react'
import { cn } from '@/lib/utils'
import { TaskList } from './task-list'
import { useTasks} from '../../context/tasksContext';
import { useAuth } from '../../context/authContext';
import {Switch} from '../ui/switch'
import { Task } from './task';
import { TaskProgress } from './task-progress';
import { TaskReorder } from './task-reorder';
import { useConfetti } from '../../context/confetiiContext';
import { getReadableTextColor, shade } from '../../utils/color';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { format } from 'date-fns'



  export const TaskCard = ({ user, date, className }) => {

    const [isReordering, setIsReordering] = useState(false)
    const [localTasks, setLocalTasks] = useState([])
 
    const movedTasks = useRef([])

    const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()

    const tasks = getTasksByUserForDate(user.uid, date)

    const notCompleted = tasks.filter(task => !task.completed)

    const { isAdmin } = useAuth()
    const { showConfetti } = useConfetti()

 
  const handleComplete = async (task) => {

    completeTask(task.id)
    if(tasks.length > 0 && notCompleted.length === 1) {
      showConfetti()
    }
  }

  const startReorder = () => {
    const deep = tasks
    .filter(t => !t.completed)
    .map(t => ({ ...t}))

    movedTasks.current = []
    setLocalTasks(deep)

  }

  const handleCheckChange = (checked) => {
    if(!checked) {

      const payload = movedTasks.current.filter(mt => {
        const original = localTasks.find(t => t.id === mt.id)
        return original && original.order !== mt.newOrder
      })

      if (payload.length > 0) {
        saveReorder(localTasks, payload )
      }
    }else{
      startReorder()
    }

    setIsReordering(checked)
  }

  const bgColor = user.color ?? "#ffffff"
  const textColor = getReadableTextColor(bgColor)

  const cardStyle = user.color
  ? {
     backgroundColor: bgColor,
     color: textColor
  }
  : undefined

  const accentColor = 
    textColor === '#000000'
      ? shade(bgColor, -40)
      : shade(bgColor, 40)

  const accentColorIntense = 
    textColor === '#000000'
      ? shade(bgColor, -60)
      : shade(bgColor, 60)



  return (
     <div className={cn('bg-foreground/20 max-w-96 p-4 mx-auto rounded-xl flex flex-col', className)}
       style={cardStyle}
     >
      <TaskProgress 
        total={tasks.length} 
        user={user} 
        accentColor={accentColorIntense}
        completed={tasks.length - notCompleted.length} 
        className='mb-5'
        />
      
      {

        isAdmin() && (
          <div className='flex items-center justify-between mb-5' style={{ "--track": accentColorIntense ?? "#99a1af"}}> 
            <span className='font-medium'>Sortera</span>
            <Switch 
               checked={isReordering}
               onCheckedChange ={handleCheckChange}
               className="data-[state-unchecked]:bg-[color:var(--track)"
            />
          </div>
        )
      }
        <div className='flex-1'>

          {
            isReordering
             ? <TaskReorder tasks={localTasks} accentColor={accentColor} setTasks={setLocalTasks} movedTasks={movedTasks}/>
             : <TaskList  tasks={notCompleted} accentColor={accentColor} handleComplete={handleComplete}/>
          }
          
         </div>
           {

            isAdmin() && (
              <div className='flex itmes-center justify-center mt-6'>
                <Button asChild
                  variant='icon'
                  className='border-4 border-primary rounded-full p-2 size-12 hover:bg-[color:var(--track)] hover:text-secondary transition-colors'
                  style={{ borderColor: accentColor}}
                
                >
                  <Link href={`/add?date=${format(date, 'yyyy-MM--dd')}&userId=${user.uid}`} >
                     <PlusIcon className='size-10'/>
                  </Link>

                </Button>
             </div>

            )
          }
   

     </div>
     
     

   
  )

}
