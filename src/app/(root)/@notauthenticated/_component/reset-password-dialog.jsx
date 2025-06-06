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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
    
import { usePasswordReset } from "@/context/password-reset-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useAuth } from "@/context/authContext"

export function ResetPasswordDialog() {
    
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { open ,setOpen} = usePasswordReset()

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DrawerTitle>Ange din epostadress</DrawerTitle>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='top-[40%]'>
        <DrawerHeader className="text-left">
          <DrawerTitle>Ange din epostadress</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Avbryt</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const formSchema = z.object ({
    email: z.string().email({ message: 'Ogitlig epostadress'})

})


function ProfileForm({ className }) {

    const {loading, sendPasswordReset } = useAuth()
    const [submitted, setSubmitted] = React.useState(false)
    const [message, setMessasge] = React.useState('')

    const  form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

   const onSubmit = async (values ) => {
    const msg = await  sendPasswordReset(values.email)
    setMessasge(msg)
    setSubmitted(true)

   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epost</FormLabel>
              <FormControl>
                <Input type= 'email' className='not-dark:border-gray-300'  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && <p className="tex-sm">{ message }</p> }
        <Button disabled={loading || submitted} type="submit" className='w-full'>{loading ? 'Skickar...' : 'Skicka'}</Button>
      </form>
    </Form>
  )
}
