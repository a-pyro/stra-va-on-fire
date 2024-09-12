'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

import { TypographyH2 } from '@/components/typography'
import { Button } from '@/components/ui/button'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console -- implment something else
    console.error(error)
  }, [error])

  return (
    <div>
      <TypographyH2>Something went wrong!</TypographyH2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}

export default Error
