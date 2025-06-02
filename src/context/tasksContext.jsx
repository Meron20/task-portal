'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from './authContext'
import { collection, query, onSnapshot, orderBy, where, addDoc, serverTimestamp, doc, updateDoc, writeBatch} from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { format } from 'date-fns'

const { createContext, useContext } = require('react')

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {
    
    const { isAdmin, authLoaded, user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        if(!authLoaded || !user) return

        setLoading(true)

        let q 

        if (isAdmin()) {
            q = query(collection(db, 'tasks'), orderBy('date'), orderBy('order'))
        }else {
            q = query(collection(db, 'tasks'), where('ownerId', '==', user.uid), orderBy('date'), orderBy('order'))
                
        }

        const unsub = onSnapshot(q, (querySnap) => {
            const updatedTasks = querySnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            
            setTasks(updatedTasks)
            setLoading(false)
        })
           return () => unsub()

    }, [isAdmin, user, authLoaded])

    const getNextOrder = () => {
        return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000

    }

    const addTask = async (taskData) => {
        if(!isAdmin()) return
          setLoading(true)

          try {
            const newTask = {
                ...taskData ,
                date: format(taskData.date, "yyyy-MM-dd"),
                order: getNextOrder(),
                completed: false,
                createdAt: serverTimestamp()
           }

          await addDoc(collection(db, 'tasks'), newTask)
          
          } catch (error) {
            console.log(error)
            throw error
          }finally{
            setLoading(false)
          }
       }  

     const completeTask = async (taskId) => {
        setLoading(true)
        try {

         const taskRef = doc(db, 'tasks', taskId)
         await updateDoc(taskRef, {
            completed: true
         })
            
        } catch (error) {
            console.error('Fel vid uppdatering av uppgift: ', error) 
        }finally{
            setLoading(false)
        }
     }

     const saveReorder = async (orderedTasks, moved) => {
        setLoading(true)

        const prevTasks = tasks 

        setTasks(orderedTasks)

        const batch = writeBatch(db)

        moved.forEach(({ id, newOrder}) => {
            batch.update(doc(db, 'tasks', id), { order: newOrder })

        })
        try {
            await batch.commit()
            
        } catch (error) {
          console.error('Batch error:', error)
          setTasks(prevTasks)
            
        }finally{
         setLoading(false)
        }

     }
    
     const getTasksByUserForDate = ( uid, dateObj) => {

        const  iso = useMemo(() => format(dateObj, 'yyyy-MM-dd'), [dateObj])
        return useMemo (() => {
            return tasks
            .filter(task => task.ownerId === uid && task.date === iso)
            .sort((a, b) => a.order - b.order)
        }, [tasks, uid, iso])
    }
 
   const value = {
     tasks,
     addTask,
     loading,
     getTasksByUserForDate,
     completeTask,
     saveReorder

   }

  return (

        <TasksContext.Provider value={value} >
            {children}
        </TasksContext.Provider>
  )
}

export const useTasks = () => {
    const context = useContext(TasksContext )
    if(!context){
        throw new Error('useTasks must be used inside an TasksProvider')
    }
    return context
 }

