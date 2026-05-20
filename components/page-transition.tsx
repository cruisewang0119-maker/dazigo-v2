'use client'

import { ReactNode } from 'react'

interface PageTransitionProps {
  pageKey: string
  children: ReactNode
  className?: string
}

export default function PageTransition({ pageKey, children, className = '' }: PageTransitionProps) {
  return (
    <div key={pageKey} className={`h-full animate-page-fade-in ${className}`}>
      {children}
    </div>
  )
}
