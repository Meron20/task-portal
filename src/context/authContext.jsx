"use client"
import { toast } from 'react-hot-toast'
import { auth, db} from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile,  onAuthStateChanged, signInWithEmailAndPassword, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp, updateDoc} from 'firebase/firestore'
import { useRouter } from 'next/navigation'



const { createContext, useContext, useState, useEffect} = require('react')

const AuthContext= createContext()

 export const AuthProvider = ({ children }) => {
   
    const [user, setUser] = useState(null )
    const [loading, setLoading] = useState(false)
    const [authLoaded, setAuthLoaded] = useState(false)


     const router = useRouter()
   

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if(!firebaseUser){
            setUser(null)
            setAuthLoaded(true)
            return
          }

          const docRef = doc(db, 'users', firebaseUser.uid)

          if(firebaseUser?.emailVerified){
            await updateDoc(docRef, { 
              verified: firebaseUser.emailVerified
            })
          }


          const getUserDocWithRetry = async( retries = 5, delay = 300) => {
            let docSnap = null
            for (let i = 0; i < retries; i++){
              docSnap = await getDoc(docRef)
              if(docSnap.exists()) break

              await new Promise(resolve => setTimeout(resolve, delay) )
            }

            return docSnap
          }
           const  docSnap = await getUserDocWithRetry()

           if(docSnap && docSnap.exists()){
             setUser(docSnap.data())

           }else {
            console.warn('Användardokument kunde inte hämtas')
            setUser(null)
           }

         setAuthLoaded(true)
        })

        return () => unsub()
    }, [])
    
   
 const register = async ( email, password, displayName) => {
    setLoading(true)

     try {
       
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(res.user, {displayName})

        if (!res.user){
            console.log('no user')
            return 
        }

        await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName,
            role: "user",
            createdAt: Timestamp.now(),
            photoURL: null,
            verified: false,
            color: '#9dedcc'

        })

        await  verifyEmail()
   
        
     } catch (error) {
        console.log('Error registering the user: ', error)
        throw error
     } finally {
        setLoading(false)
     }
    
 }
   const logout = async () => {
    router.replace("/")
    await signOut(auth)

   }

  const login = async (email, password) => {
    setLoading(true)

    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log("Error in signing: " , error)
        throw error
        
    } finally {
        setLoading(false)
    }

  }

    const isAdmin = () => {
      if(!user) return false
      return user.role === "admin"

    }

    const updateUser = async (user, newUserData) => {
      setLoading(true)
      const toastId = toast.loading('Laddar...') 

      try {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, newUserData)
        setUser((prevUser) => ({...prevUser, ...newUserData }))
        toast.success('profilen uppdaterad', {id: toastId})
        
      } catch (error) {
        toast.error(" Någonting gick fel, försök igen ", {id: toastId})
        console.error('Error updating the user:' , error)
        
      }finally{
        setLoading(false)
      }
    }

    const verifyEmail = async () => {
       const toastId = toast.loading('Skicar länk...')
       const user = auth.currentUser

      if(!user){
        console.error('No user currently signed in')
        toast.error('Någonting gick fel, försök igen,', {id: toastId})
        return
      }

      try {

        await sendEmailVerification(user, {
          url: `${window.location.origin}/`,
          handleCodeInApp: false
        })
        toast.success('Verifieringslänk skickad, kolla din epost', { id : toastId })

      } catch (error) {
        console.error('error sending email verification: ', error)
        toast.error('Någonting gick fel, försök igen.', { id : toastId })
        
      }

      
    }



    const changePassword = async (currentPassword, newPassword) => {
      setLoading(true)
      const toastId = toast.loading('Laddar...')
      const user = auth.currentUser

      if(!user) {
        console.error ('Ingen användare är inloggad')
        toast.error('Ingen användare är inloggad'), {id: toastId}
        return
      }

      try {
        const userCredential = await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword))
        await updatePassword(userCredential.user, newPassword)
        toast.success('Lösenordet har uppdaterats', {id: toastId})
      } catch (error) {
        console.error('Error reauthenticating user ', error)
        if (error.code === 'auth/invalid-credential'){
          toast.error('felaktigt lösenord', {id: toastId })
        }else if(error.code === 'auth/weak-password'){
          toast.error('Lösenordet är för svagt', {id: toastId} )
        }else {
          toast.error('Någonting gick fel, försök igen', {id: toastId})
        }
      }finally{
        setLoading(false)
      }
    }

    const sendPasswordReset = async(email) => {
      setLoading(true)
      const toastId = toast.loading('laddar...')
   
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Återställningslänk skickad',  {id: toastId})
      return 'Återställningslänk skickad'
      
    } catch (error) {
      console.error('error sending password reset email: ', error)
      toast.error('Någonting gick fel, försök igen', {id : toastId})
      return 'Någonting gick fel, försök igen'
    }finally{
      setLoading(false)
    }
  }

   const value = {
        user,
        loading,
        authLoaded,
        setUser,
        register,
        logout,
        login,
        isAdmin,
        updateUser,
        changePassword,
        verifyEmail,
        sendPasswordReset




    }

    return (
        <AuthContext.Provider value={value}>
            { children}
        </AuthContext.Provider>
    )
 }

 export const useAuth = () => {
    const context = useContext(AuthContext)
      if(!context){
        throw new Error ("useAuth must be used inside an AuthProvider")
      }
      return context
 }