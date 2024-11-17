import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { uploadImage } from "@/firebase/uploadImage"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/utils/parsers"
import { PersonIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import * as React from "react"
import { screens } from "tailwindcss/defaultTheme"

/**
 * Displays the user's profile image, allowing them to
 * upload a new one if they're in the editable view
 */
export function UserImage({
	editable,
	handleNewUrl,
}:
	| { editable?: never; handleNewUrl?: never }
	| { editable: true; handleNewUrl: (url: string) => void }) {
	const { user } = useAuth()
	const [newUrl, setNewUrl] = React.useState("")
	const [uploading, setUploading] = React.useState(false)
	const [error, setError] = React.useState("")
	const inputRef = React.useRef<HTMLInputElement>(null)

	if (!user) {
		return <></>
	}

	const { displayName, photoURL, uid } = user
	const src = newUrl || photoURL

	return (
		<div>
			<div
				className={cn(
					"relative flex items-center",
					src && (editable ? "h-40 w-40" : "h-10 w-10 md:h-12 md:w-12"),
				)}
			>
				{uploading ? (
					<span
						aria-busy="true"
						className="h-40 w-40 animate-spin rounded-full border-2 border-r-transparent"
						role="alert"
					/>
				) : (
					<Wrapper {...(editable && { onClick })}>
						<Avatar className="h-full w-full border">
							{src && (
								<Image
									alt={`${displayName} profile image`}
									className="bg-secondary object-cover"
									fill
									sizes={
										editable ? "160px" : `(min-width: ${screens.md}) 48px, 40px`
									}
									src={src}
									{...(!editable && { priority: true })}
								/>
							)}
							<AvatarFallback>
								<PersonIcon
									className={cn(
										editable ? "h-40 w-40" : "h-10 w-10 md:h-12 md:w-12",
									)}
								/>
							</AvatarFallback>
						</Avatar>
					</Wrapper>
				)}
				{editable && (
					<input
						accept="image/*"
						className="hidden"
						onChange={async e => {
							const file = e.target.files?.[0]
							if (uploading || !file) {
								return
							}
							setUploading(true)
							try {
								const url = await uploadImage(
									file,
									`users/${uid}/images/${file.name}`,
								)
								setNewUrl(url)
								handleNewUrl(url)
							} catch (error) {
								setError(getErrorMessage(error))
								setTimeout(() => {
									setError("")
								}, 3000)
							} finally {
								setUploading(false)
							}
						}}
						ref={inputRef}
						type="file"
					/>
				)}
			</div>
			{error && <p className="text-sm leading-tight text-red-500">{error}</p>}
		</div>
	)

	/**
	 * Opens the file input, allowing the user to select an image
	 */
	function onClick() {
		inputRef.current?.click()
	}
}

/**
 * If they're in the editable view, wraps the user's profile image
 * in a button which will allow them to upload a new one
 */
function Wrapper({
	children,
	onClick,
}: React.PropsWithChildren<{ onClick?: () => void }>) {
	if (!onClick) {
		return <>{children}</>
	}
	return (
		<button
			className="rounded-full"
			title="Upload new profile image"
			type="button"
			{...{ onClick }}
		>
			{children}
		</button>
	)
}
