import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Склейка классов с разрешением конфликтов Tailwind: класс из пропа должен
 * перебивать класс по умолчанию, а не вставать рядом с ним.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
