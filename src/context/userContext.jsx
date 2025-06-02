'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { toast } from 'sonner';
import {updateDoc, doc} from 'firebase/firestore'

const { createContext, useContext } = require('react')

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const { isAdmin } = useAuth()

   useEffect(() => {
    if(!isAdmin()) return

    const q = query (collection(db, 'users'));
    const unsub = onSnapshot(q, querySnapshot => {
        const usersData = []

        querySnapshot.forEach(doc => {
            usersData.push({...doc.data(), uid: doc.id}) 
        });
        setUsers(usersData)
    })
      return () => unsub()

   }, [isAdmin])

   const changeRole = async (uid, role) => {

    if(!isAdmin()) {
        toast.error('Du har inte behörighet att göra detta')
        return
    }
    if(role !== 'admin' && role !== 'user'){
        toast.error('Ogiltig role angiven')
        return
    }

    setLoading(true)
    try {
        const userRef = doc(db, 'users', uid)
        await updateDoc(userRef, { role})
        toast.success(`Användaren har nu ${role} behörighet`)
        
    } catch (error) {
        console.error('Error updating the user role', error)
        toast.error('Någonting gick fel, försöke igen')
        
    }finally{
       setLoading(false)
    }
   }

      const value = {
     users,
     loading,
     changeRole


   }

  return (

        <UsersContext.Provider value={value} >
            {children}
        </UsersContext.Provider>
  )
}

export const useUsers = () => {
    const context = useContext(UsersContext)
    if(!context){
        throw new Error('useUsers must be used inside an UsersProvider')
    }
    return context
}
