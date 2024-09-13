import { type ClassValue, clsx } from 'clsx'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param  type - The type of message, either 'error' or 'success'.
 * @param  path - The path to redirect to.
 * @param  message - The message to be encoded and added as a query parameter.
 * @returns  This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
) {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
