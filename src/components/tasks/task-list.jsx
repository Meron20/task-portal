'use client'
import React from 'react'

import { Task } from './task'
import {motion, AnimatePresence } from 'motion/react'

export const TaskList = ({ tasks,  handleComplete, accentColor }) => {
  return (
    <>

      {tasks.length === 0 
        ? ( <p>No tasks to show</p>)
        : (
      < motion.div className='space-y-3 w-full'>
        <AnimatePresence mode='popLayout'>
          {
              tasks.map((task, index) => (
                <Task  key={task.id} task={task} accentColor={accentColor}  handleComplete={ handleComplete} index={index}/>
              ) )
            }

        </AnimatePresence>
        
        </motion.div>
      )}
  </>
 )
}
