'use client'
import Image from 'next/image';
import React, { useState, use, useEffect} from 'react'
import {  Button } from '@/components/ui/button'
import { useAuth } from '../../../../../context/authContext';
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {db, storage} from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { Loader2Icon } from "lucide-react"




const MAX_MB = 5;
const MAX_B = MAX_MB * 1024 * 1024
const MIME_RX = /^image\/(png|jpe?g|webp)$/i

export const ProfileImageUploader = ({ user, isOwn}) => {

 const [preview, setPreview] = useState(user?.photoURL || null)
 const [file, setFile] = useState(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState(null)
 const [imageUploaded, setImageUploaded] = useState(false)

  const { setUser } = useAuth()

  useEffect(() => {
    return () => preview?.startsWith('blob: ') && URL.revokeObjectURL(preview)

  }, [preview])

 const onPickImage = async (e) => {
   const pickedFile = e.target.files[0]
   if(!pickedFile) return

   if(!MIME_RX.test (pickedFile.type)) {
    setError('Välj PNG / JPEG / WEBP')
    return
   }
   if(pickedFile.size >  MAX_B){
    setError(`Max ${MAX_MB} MB`)
    return
   }
   setError(null)
   setFile(pickedFile)
   setPreview(URL.createObjectURL(pickedFile))
   setImageUploaded(false)
 }

  const handelUpload = async () => {
    if(!file || !user) return
    setLoading(true)

    try {

      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file, {contentType: file.type })

      const photoURL = await getDownloadURL(storageRef)

      const userRef = doc(db, 'users', user.uid)
      await updateDoc( userRef, { photoURL })
      
      setFile(null)
      setPreview(photoURL)
      setImageUploaded(true)
      if(isOwn){
        setUser(prev => ({ ...prev, photoURL}))
      }


    } catch (error) {
      console.error(error)
      setError('Fel vid uppladning - försök igen.')
    }finally {
      setLoading(false)
    }

  }

  return (
    <div>
       {
        preview
          ? (
            <>
            <div className="relative">
              <label htmlFor='image-pick' className='block rounded-lg aspect-square sm:w-80 overflow-hidden '> 
                <Image
                  alt ='Profilbild'
                  src={preview}
                  width={320}
                  height={320}
                  className='object-cover w-full h-full'
                 />
                 <div className='absolute top-0 left-0 w-full h-full pointer-events-none bg:radial from-transparent from-70% to-black/60 to-70%' />
              </label>
              {
                loading && (
                  <div className='absolute flex items-center justify-center inset-0 bg:black/40 pointer-events-auto'>
                    <Loader2Icon className='size-20 animate-spin' />
                  </div>
                )
              }
            </div>

              <div> 
                {
                  file && !imageUploaded && (

                    <Button className='mt-4' disabled={loading} onClick={handelUpload}>
                       {loading ? 'Laddar upp...' : 'Spara'}
                    </Button>
                  )
                }
              </div>
            </>
           
          )
          : (
            <label htmlFor='image-pick' className='border border-foreground/30 rounded-lg aspect-square flex items-center justify-center bg-gray-500/20 hover:bg-foreground/30 transition-colors cursor-pointer sm:w-80 group' >
              <p className=' text-muted-foreground group-hover:text-foreground transition-colors'>Lägg till en bild</p>
            </label>
          )
       }
       { error && <p className='text-red-500 text-sm'>{ error }</p>}
       <input  type='file' id='image-pick' accept="image/*" className='hidden' onChange={onPickImage} />

    </div>
  )
}
