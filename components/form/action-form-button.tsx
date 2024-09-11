'use client'
import { useFormStatus } from 'react-dom'

import { Button, type ButtonProps } from '../ui/button'

type ActionFormButtonProps = Omit<ButtonProps, 'asChild' | 'type'>

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
