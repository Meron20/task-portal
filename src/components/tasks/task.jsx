'use client'

import React, { useEffect, useState } from 'react'
import {motion } from 'motion/react'
import { parseISO, format } from 'date-fns'


export const Task = ({ task, handleComplete, index, accentColor }) => {
    
    const deadlineDate = task.date ? parseISO(task.date) : null;
    
    return (
    <Delay delay={100 * index }>
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            transition={{
                x: {type: 'spring', bounce: 0, duration: 0.5},
                opacity: {duration: 0.4}
            }}
            animate={ {opacity: 1, x: 0, duration: 0.5 }}
            exit={{ opacity: 0, x: 100 }}
            key ={task.id}
            className='p-3 shadow-sm bg-background rounded-lg cursor-pointer'
            onClick={() => handleComplete(task)}
            style={{backgroundColor: accentColor}}
            >
            <span className='text-lg font-medium'>{task.title}</span>

            <span className="text-sm mt-1 block text-muted-foreground">
               Deadline: {format(new Date(task.date), 'yyyy-MM-dd')}
            </span>

        </motion.div>
    </Delay>
    );
  };

  export const Delay = ({ children, delay}) => {
     
   const [visible, setVisible] = useState(false)

   useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return() => clearTimeout(timer)

   },[delay])

   if(!visible) return null
    
   
   return <> { children } </>

  }
  
