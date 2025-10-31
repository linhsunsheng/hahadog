"use client"
import Link from 'next/link'
import { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'teal' | 'outline'

interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'> {
  href?: string
  variant?: Variant
  children: ReactNode
}

export default function Button({ href, className = '', variant = 'primary', children, ...props }: ButtonProps) {
  const variantCls = variant === 'primary' ? 'btn-primary' : variant === 'teal' ? 'btn-teal' : 'btn-outline'
  const cls = `btn ${variantCls} ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
