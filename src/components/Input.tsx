import { cn } from "@/lib/utils"
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { XIcon } from "lucide-react"
import * as React from "react"
import { Label } from "./ui/label"

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>

interface InputProps
	extends Omit<InputAttributes, "id" | "name" | "placeholder" | "type"> {
	clearErrors?: () => void
	error?: string
	helperText?: string
	id: string
	inputClass?: string
	inputRef?: React.RefObject<HTMLInputElement>
	name: string
}

export function Input({
	className,
	clearErrors,
	error,
	helperText,
	inputClass,
	id,
	inputRef,
	label,
	labelProps,
	name,
	onBlur,
	onChange,
	reset,
	type = "text",
	...props
}: InputProps &
	(
		| {
				label: string
				labelProps?: Omit<Parameters<typeof Label>[0], "htmlFor">
				placeholder?: string
		  }
		| { label?: never; labelProps?: never; placeholder: string }
	) &
	(
		| {
				type?: Exclude<InputAttributes["type"], "password">
				reset?: () => void
		  }
		| { type: "password"; reset?: never }
	)) {
	const secondaryText = error || helperText
	const [visible, setVisible] = React.useState(false)

	return (
		<div className={cn("relative", className)}>
			{label && (
				<Label htmlFor={id} {...labelProps}>
					{label}
				</Label>
			)}
			<input
				className={cn(
					"flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm text-inherit shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					error ? "border-red-600 dark:border-red-500" : "border-input",
					type === "password" ? "pr-10" : reset && "pr-9",
					inputClass,
				)}
				id={id}
				type={type === "password" && visible ? "text" : type}
				{...{ name }}
				{...((clearErrors || onBlur) && {
					onBlur: e => {
						clearErrors?.()
						onBlur?.(e)
					},
				})}
				{...((clearErrors || onChange) && {
					onChange: e => {
						clearErrors?.()
						if (e.target.inputMode === "numeric")
							e.target.value = e.target.value.replace(/[^0-9]/g, "")
						onChange?.(e)
					},
				})}
				{...(inputRef && { ref: inputRef })}
				{...props}
			/>
			{type === "password" ? (
				<button
					className="absolute right-3 top-8"
					onClick={() => {
						setVisible(!visible)
					}}
					type="button"
				>
					<span className="sr-only">Toggle password visibility</span>
					{visible ? (
						<EyeNoneIcon className="h-5 w-5" />
					) : (
						<EyeOpenIcon className="h-5 w-5" />
					)}
				</button>
			) : (
				reset &&
				props.value && (
					<button
						className={cn("absolute right-2 pt-0.5", label ? "top-7" : "top-1")}
						onClick={reset}
						type="button"
					>
						<span className="sr-only">Clear input</span>
						<XIcon />
					</button>
				)
			)}
			{secondaryText && (
				<p
					className={cn(
						"mx-1 text-xs leading-snug",
						error && "text-red-600 dark:text-red-500",
					)}
				>
					{secondaryText}
				</p>
			)}
		</div>
	)
}
