import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsForm } from "../../app/(root)/@authenticated/settings/components/settings-form"


export function TaskSettingsDialog({ user }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop =  useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Avatar className="size-12 cursor-pointer">
            <AvatarImage src= {user?.photoURL || ""} className='h-full w-full object-cover'/>
            <AvatarFallback className="bg-gray-700/30 capitalize">{user?.displayName?.slice(0,2) || "JD"}</AvatarFallback>
        </Avatar>
        </DialogTrigger>
        <DialogContent className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg">
         
          <DialogHeader>
            <DialogTitle>Inställningar</DialogTitle>
        </DialogHeader>
          <SettingsForm user={user}/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
      <Avatar className="size-12 cursor-pointer">
            <AvatarImage src= {user?.photoURL || ""} className='h-full w-full object-cover'/>
            <AvatarFallback className="bg-gray-700/30 capitalize">{user?.displayName?.slice(0,2) || "JD"}</AvatarFallback>
        </Avatar>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader className="text-left">
          <DrawerTitle>Inställningar</DrawerTitle>
        </DrawerHeader>
        <div className="p-6 h-[80svh] overflow-y-auto">
          <SettingsForm user={user}/>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

