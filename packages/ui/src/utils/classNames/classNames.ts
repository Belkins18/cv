import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class joining with Tailwind conflict resolution: a class coming in through a
 * prop must override the default one, not sit next to it.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
