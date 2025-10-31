"use client"
import { ComponentProps } from 'react'

export function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
    </div>
  )
}

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={`input ${props.className ?? ''}`} />
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={`input ${props.className ?? ''}`} />
}

