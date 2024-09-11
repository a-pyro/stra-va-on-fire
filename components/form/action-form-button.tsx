'use client'
import { useFormStatus } from 'react-dom'

import { Button, type ButtonProps } from '../ui/button'

type ActionFormButtonProps = Omit<ButtonProps, 'asChild' | 'type'>

// TODO this doesnt seems to be working

export const ActionFormButton = (props: ActionFormButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <form>
      <Button {...props} disabled={pending} type="submit">
        {pending ? '🚀🚀🚀' : null} {props.children}
      </Button>
    </form>
  )
}
