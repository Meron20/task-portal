import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '../context/authContext'
import { UsersProvider } from '../context/userContext'
import { TasksProvider } from '../context/tasksContext'
import { ConfettiProvider } from '../context/confetiiContext'

function Providers( { children}) {
  return (
      <AuthProvider>
        <UsersProvider >
          <TasksProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ConfettiProvider>
                 {children}
              </ConfettiProvider>
           </ThemeProvider>
          </TasksProvider>
        </UsersProvider>
      </AuthProvider>
        
  )
}

export default Providers