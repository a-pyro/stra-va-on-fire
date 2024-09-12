'use client'
import { useFormStatus } from 'react-dom'

import { Button, type ButtonProps } from '../ui/button'

type ActionFormButtonProps = Omit<ButtonProps, 'asChild' | 'type'>

export const FormButtonPending = (props: ActionFormButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button {...props} disabled={pending} type="submit">
      {pending ? '🚀🚀🚀' : null} {props.children}
    </Button>
  )
}

export const ActionFormButton = (props: ActionFormButtonProps) => {
  return (
    <form>
      <FormButtonPending {...props} />
    </form>
  )
}
