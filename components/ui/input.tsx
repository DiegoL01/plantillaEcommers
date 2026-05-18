import * as React from 'react'

import { cn } from '../../lib/utils'
import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Input({
  className,
  type,
  label,
  error,
  leftIcon,
  rightIcon,
  ...props
}: FormInputProps) {
  return (
    <label htmlFor={props.name} className="space-y-1.5">
      {label && <span className="block text-sm font-medium text-foreground">{label}</span>}
      <span className="relative block">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </span>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </label>
  )
}

export { Input }
