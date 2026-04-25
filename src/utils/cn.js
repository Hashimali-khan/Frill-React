/**
 * cn() — Conditional classNames utility
 * Combines clsx (conditional classes) with
 * tailwind-merge (deduplicates conflicting Tailwind classes)
 *
 * Usage: cn('bg-purple px-4', isActive && 'bg-magenta', className)
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}