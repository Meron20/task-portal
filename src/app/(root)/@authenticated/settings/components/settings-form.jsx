import React from 'react'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { UserInfoForm } from './user-info-form'
import { ProfileImageUploader } from './profile-image-uploader'
import {  ChangePasswordForm } from './change-password-form'
import { ColorPicker } from './color-picker'
import { UserRolesManager } from './user-roles-manger'

export const SettingsForm = ( { user , isOwn}) => {
return (

  <>
    <div className='flex flex-col gap-10 justify-between lg:flex-row'>
      <div className='space-y-10 w-full '>
        {
            isOwn && (
                <div className='flex items-center justify-between lg:justify-stretch gap-10'>
                    <p className='font-semibold text-lg'> Färgtema: </p>
                    <ModeToggle />
                </div>
            )
        }
           <div className='flex items-center justify-between lg:justify-stretch gap-10'>
                <p className='font-semibold text-lg'> Kortfärg: </p>
                <ColorPicker user={user}/>
            </div>
            <UserInfoForm  user={user}/>

            <div className='flex justify-between lg:justify-stretch gap-10'>
              <p className='font-semibold text-lg'> Profilbild:</p>
               <ProfileImageUploader user={user} isOwn={isOwn} />
            </div>

      </div>
           {
              isOwn && ( <ChangePasswordForm className='w-full'/>)
                   
            } 
            {
              isOwn && <UserRolesManager/>
            }
    </div>
  </>

         
  )
}
