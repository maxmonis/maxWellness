import { Button } from "@/components/CTA"
import { uploadImage } from "@/firebase/app"
import { useSession } from "@/hooks/useSession"
import { useUpdateImage } from "@/hooks/useUpdateImage"
import { extractErrorMessage } from "@/utils/parsers"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import Image from "next/image"
import React from "react"

/**
 * Displays the user's profile image, allowing them to
 * upload a new one if they're in the editable view
 */
export function UserImage({ editable = false }) {
	const { data: session } = useSession()
	const [newUrl, setNewUrl] = React.useState("")
	const { mutate: updateImage } = useUpdateImage()
	const [uploading, setUploading] = React.useState(false)
	const [error, setError] = React.useState("")
	const inputRef = React.useRef<HTMLInputElement>(null)

	if (!session) return <></>

	const { photoURL, userId, userName } = session.profile
	const src = newUrl || photoURL

	return (
		<div>
			<div
				className={classNames(
					"relative flex items-center",
					src && (editable ? "h-24 w-24" : "h-8 w-8"),
				)}
			>
				{uploading ? (
					<span
						aria-busy="true"
						className="h-24 w-24 animate-spin rounded-full border-2 border-slate-700 border-r-transparent"
						role="alert"
					/>
				) : src ? (
					<Wrapper {...(editable && { onClick })}>
						<Image
							alt={`${userName} profile image`}
							className="flex flex-shrink-0 rounded-full border border-slate-700 object-cover"
							fill
							sizes="10rem"
							priority
							{...{ src }}
						/>
					</Wrapper>
				) : editable ? (
					<Button className="whitespace-nowrap text-sm" {...{ onClick }}>
						Add profile image
					</Button>
				) : (
					<FontAwesomeIcon icon={faUser} size="lg" />
				)}
				{editable && (
					<input
						accept="image/*"
						className="hidden"
						onChange={async e => {
							const file = e.target.files?.[0]
							if (uploading || !file) return
							setUploading(true)
							try {
								const url = await uploadImage(
									file,
									`profile/${userId}/${file.name}`,
								)
								setNewUrl(url)
								updateImage(url)
							} catch (error) {
								setError(extractErrorMessage(error))
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
	if (!onClick) return <>{children}</>
	return (
		<button title="Update profile image" {...{ onClick }}>
			{children}
		</button>
	)
}
