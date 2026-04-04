import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon: Icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in duration-500",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {Icon && (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-balance text-muted-foreground line-clamp-2 max-w-[420px]">
              {description}
            </p>
          </div>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
