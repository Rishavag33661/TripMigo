"use client"

export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8"
    }

    return (
        <div className="flex items-center justify-center">
            <div
                className={`animate-spin rounded-full border-2 border-muted-foreground border-t-primary smooth-transition ${sizeClasses[size]}`}
                style={{
                    animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
            />
        </div>
    )
}