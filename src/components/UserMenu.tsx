import { Button, IconButton } from "@/components/CTA"
import { logOut } from "@/firebase/app"
import { useKeypress } from "@/hooks/useKeypress"
import { useOutsideClick } from "@/hooks/useOutsideClick"
import { useSession } from "@/hooks/useSession"
import { useUpdateProfile } from "@/hooks/useUpdateProfile"
import {
	faEdit,
	faMoon,
	faSignOut,
	faSun,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import React from "react"
import { UserImage } from "./UserImage"

/**
 * This menu allows the user to toggle dark mode,
 * update their profile image, or log out
 */
export function UserMenu({ className = "" }) {
	const { loading, session } = useSession()
	const router = useRouter()

	const [open, setOpen] = React.useState(false)
	const ref = useOutsideClick(closeDialogs)
	useKeypress("Escape", closeDialogs)

	const [newName, setNewName] = React.useState("")
	const [editingName, setEditingName] = React.useState(false)
	const { mutate: updateProfile } = useUpdateProfile()

	const dialogRef = React.useRef<HTMLDialogElement>(null)
	React.useLayoutEffect(() => {
		if (dialogRef.current?.open && !editingName) {
			dialogRef.current?.close()
		} else if (!dialogRef.current?.open && editingName) {
			dialogRef.current?.showModal()
		}
	}, [editingName])

	if (loading) {
		return <></>
	}

	if (!session) {
		return (
			<div className={classNames("max-sm:pr-4", className)}>
				<DarkModeToggle />
			</div>
		)
	}

	return (
		<div className={classNames("relative", className)} {...{ ref }}>
			<dialog
				ref={dialogRef}
				className="fixed bottom-0 left-0 z-10 rounded-br-lg border-b border-r border-slate-700 p-6"
			>
				<form
					onSubmit={e => {
						e.preventDefault()
						const userName = newName.trim()
						if (userName && userName !== session.profile.userName) {
							updateProfile({ userName })
						}
						closeDialogs()
					}}
				>
					<h1 className="mb-4 text-xl font-bold">Update Name</h1>
					<label htmlFor="userName">Name</label>
					<input
						autoFocus
						id="userName"
						maxLength={40}
						onChange={e => {
							setNewName(e.target.value.trim())
						}}
						value={newName}
					/>
					<div className="mt-6 flex justify-end gap-4">
						<Button type="submit">Save Changes</Button>
						<Button onClick={closeDialogs} type="button" variant="danger">
							Cancel
						</Button>
					</div>
				</form>
			</dialog>
			<IconButton
				className="max-md:flex-row-reverse max-sm:p-2"
				icon={<UserImage />}
				text={session.profile.userName}
				textClass="max-sm:sr-only text-right md:text-left leading-tight max-md:w-32 text-sm"
				onClick={() => {
					setOpen(!open)
				}}
			/>
			{open && (
				<dialog
					className={classNames(
						"absolute -left-28 bottom-10 z-10 flex w-40 flex-col items-start gap-4 rounded-lg border border-slate-700 p-4 text-left sm:-left-2",
						editingName && "hidden",
					)}
				>
					<DarkModeToggle />
					<UserImage editable />
					<IconButton
						icon={<FontAwesomeIcon icon={faEdit} />}
						onClick={() => {
							setNewName(session.profile.userName)
							setEditingName(true)
						}}
						text="Edit Name"
						textClass="leading-tight"
					/>
					<IconButton
						icon={<FontAwesomeIcon aria-label="Sign out" icon={faSignOut} />}
						onClick={() => {
							logOut().then(() => {
								router.push("/login")
							})
						}}
						text="Logout"
						textClass="leading-tight"
					/>
					<p className="text-sm leading-tight sm:hidden">
						{session.profile.userName}
					</p>
				</dialog>
			)}
		</div>
	)

	function closeDialogs() {
		setOpen(false)
		setNewName("")
		setEditingName(false)
	}
}

/**
 * Allows the user to toggle light/dark mode
 */
function DarkModeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const dark = resolvedTheme === "dark"

	return (
		<div className="flex items-center gap-2">
			<FontAwesomeIcon icon={faSun} />
			<label className="relative inline-flex cursor-pointer items-center">
				<input
					aria-label="Toggle dark mode"
					checked={dark}
					className="peer sr-only"
					onChange={() => {
						setTheme(dark ? "light" : "dark")
					}}
					type="checkbox"
				/>
				<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
			</label>
			<FontAwesomeIcon icon={faMoon} />
		</div>
	)
}
