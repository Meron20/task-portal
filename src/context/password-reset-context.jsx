'use  client '
import React, { useState } from 'react'

const { createContext, useContext } = require("react")

const PasswordResetContext = createContext()



export const PasswordResetProvider = ({ children }) => {

  const [open, setOpen] = useState(false)



  return <PasswordResetContext.Provider value={{open, setOpen}}>
    { children }
  </PasswordResetContext.Provider>
  
}

export const usePasswordReset = () => useContext(PasswordResetContext)
  
