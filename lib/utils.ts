import { type ClassValue, clsx } from 'clsx'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

/**
 * Builds a path with an encoded message as a query parameter.
 * @param type - The type of message, either 'error' or 'success'.
 * @param  path - The base path to append the query parameter to.
 * @param  message - The message to be encoded and added as a query parameter.
 * @returns  The constructed path with the encoded message.
 */
export function buildPathWithMessage(
  type: 'error' | 'success',
  path: string,
  message: string,
): string {
  return `${path}?${type}=${encodeURIComponent(message)}`
}

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
  const fullPath = buildPathWithMessage(type, path, message)
  return redirect(fullPath)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
