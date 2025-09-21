"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const content = contentRef.current
        if (!content) return

        // Determine transition type based on pathname
        const isPlanningFlow = pathname.includes('/planning')
        const transitionClass = isPlanningFlow ? 'planning-step-transition' : 'page-transition'

        // Reset and trigger enter animation
        content.classList.remove("page-transition", "planning-step-transition")
        content.offsetHeight // Force reflow
        content.classList.add(transitionClass)

        // Cleanup function
        return () => {
            content.classList.remove("page-transition", "planning-step-transition")
        }
    }, [pathname])

    return (
        <div
            ref={contentRef}
            className="page-transition min-h-screen"
            style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
            }}
        >
            {children}
        </div>
    )
}