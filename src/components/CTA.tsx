import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useAuth } from "~/context/AuthContext"
import { googleLogin } from "~/firebase/app"

/**
 * A basic button which reflects its style variant (if any)
 */
export function Button({
	children,
	className,
	loading,
	type = "button",
	variant,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	variant?: "primary" | "secondary" | "danger"
}) {
	return (
		<button
			className={classNames(
				"flex items-center justify-center gap-2 rounded-lg text-lg font-bold leading-tight outline-none focus:ring-2 aria-busy:cursor-default",
				{
					"bg-blue-800 px-4 py-2 font-semibold text-white":
						variant === "primary",
					"hover:bg-blue-700": variant === "primary" && !loading,
					"border border-blue-700 bg-white px-4 py-2 font-semibold text-blue-700 dark:bg-blue-50":
						variant === "secondary",
					"hover:border-blue-800 hover:bg-blue-50 hover:text-blue-800 dark:hover:border-blue-600 dark:hover:bg-white dark:hover:text-blue-600":
						variant === "secondary" && !loading,
					"text-red-800 dark:text-red-500": variant === "danger",
					"hover:text-red-700 dark:hover:text-red-400":
						variant === "danger" && !loading,
					"text-blue-700 dark:text-blue-500": !variant,
					"hover:text-blue-600 dark:hover:text-blue-400": !variant && !loading,
				},
				className,
			)}
			{...{ type }}
			{...(loading && { "aria-busy": true })}
			{...props}
		>
			{loading && variant && ["primary", "secondary"].includes(variant) && (
				<span
					aria-busy="true"
					className={classNames(
						"h-4 w-4 animate-spin rounded-full border-2 border-r-transparent",
						variant === "primary" ? "border-white" : "border-blue-700",
					)}
					role="alert"
				/>
			)}
			{children}
		</button>
	)
}

/**
 * Displays either a link or button, with an icon and optional text
 */
export function IconButton({
	className,
	color,
	href,
	icon,
	text,
	textClass,
	textSide = "right",
	type,
	...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
	color?: "blue"
	href?: `/${string}`
	icon: React.ReactNode
} & (
		| { textClass?: string; text: string; textSide?: "left" | "right" }
		| { textClass?: never; text?: never; textSide?: never }
	)) {
	const classes = classNames(
		"flex gap-2 items-center text-lg font-bold",
		props.disabled
			? "text-gray-500 dark:text-gray-400 cursor-not-allowed"
			: color === "blue"
			? "text-blue-600 dark:text-blue-400"
			: "text-gray-700 dark:text-gray-200",
		className,
	)
	const content = (
		<>
			{text && textSide === "left" && <span className={textClass}>{text}</span>}
			{icon}
			{text && textSide === "right" && (
				<span className={textClass}>{text}</span>
			)}
		</>
	)

	if (href) {
		return (
			<Link {...{ href }}>
				<button
					className={classes}
					tabIndex={-1}
					type={type ?? "button"}
					{...props}
				>
					{content}
				</button>
			</Link>
		)
	}

	return (
		<button className={classes} type={type ?? "button"} {...props}>
			{content}
		</button>
	)
}

/**
 * Displays a toggleable checkbox element
 */
export function Checkbox({
	checked,
	onChange,
	text,
	value,
}: {
	checked: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	text: string
	value: string
}) {
	return (
		<div className="flex items-center gap-2">
			<input
				className="flex h-4 w-4 flex-shrink-0 cursor-pointer"
				id={text}
				type="checkbox"
				{...{ checked, onChange, value }}
			/>
			<label
				className="text-md cursor-pointer overflow-hidden text-ellipsis leading-tight"
				htmlFor={text}
			>
				{text}
			</label>
		</div>
	)
}

/**
 * Opens a modal which prompts the user for their Google
 * credentials, then logs them in (if they've created an
 * account with us) or creates a new account for them (if not)
 */
export function GoogleButton({
	handleError,
	setSubmitting,
	submitting,
}: {
	handleError: (error: unknown) => void
	setSubmitting: React.Dispatch<React.SetStateAction<typeof submitting>>
	submitting: boolean
}) {
	const router = useRouter()

	return (
		<button
			className="flex w-full items-center justify-center rounded border bg-white p-2 text-gray-900"
			disabled={submitting}
			onClick={async () => {
				if (submitting) return
				setSubmitting(true)
				try {
					const isNewUser = await googleLogin()
					router.push(isNewUser ? "/about" : "/")
				} catch (error) {
					handleError(error)
				} finally {
					setSubmitting(false)
				}
			}}
			type="button"
		>
			<Image
				alt="google logo"
				className="mr-3 w-6"
				height={30}
				src={
					"https://user-images.githubusercontent.com/51540371/" +
					"209448811-2b88004b-4abd-4b68-9944-9d47b350a735.png"
				}
				width={30}
			/>
			Continue with Google
		</button>
	)
}

/**
 * Takes the user back to the previous page if one exists,
 * and otherwise to the home page if they're logged in or
 * to the register page if they're not
 */
export function BackButton() {
	const user = useAuth()
	const router = useRouter()

	return (
		<IconButton
			aria-label="go back"
			className="mr-2 grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 sm:mr-3"
			icon={<FontAwesomeIcon icon={faArrowLeft} />}
			onClick={() => {
				if (history.length > 1) router.back()
				else router.replace(user ? "/" : "/register")
			}}
		/>
	)
}
