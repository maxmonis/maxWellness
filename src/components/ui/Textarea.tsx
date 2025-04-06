import { cn } from "@/lib/utils"
import * as React from "react"

interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"block min-h-[5rem] w-full rounded-md border border-input bg-transparent px-3 py-1 text-inherit shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)

Textarea.displayName = "Textarea"
