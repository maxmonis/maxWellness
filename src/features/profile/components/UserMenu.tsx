import { Input } from "@/components/Input"
import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/auth/firebase/logOut"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { ExitIcon, MoonIcon, Pencil2Icon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import * as React from "react"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import { UserImage } from "./UserImage"

/**
 * This menu allows the user to toggle dark mode,
 * update their profile, or log out
 */
export function UserMenu() {
	const { user } = useAuth()
	const router = useRouter()
	const [editing, setEditing] = React.useState(false)

	if (!user) {
		return (
			<div className="py-2 pr-4">
				<DarkModeToggle />
			</div>
		)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="h-min gap-2 py-1 max-md:flex-row-reverse sm:w-44 sm:px-1 md:-ml-4"
						variant="ghost"
					>
						<UserImage />
						<span className="whitespace-normal text-right text-sm leading-tight max-sm:sr-only md:text-left">
							{user.displayName}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<div className="p-1">
						<DarkModeToggle />
					</div>
					<DropdownMenuItem
						className="gap-2"
						onClick={() => {
							setEditing(true)
						}}
					>
						<Pencil2Icon />
						<span className="leading-tight">Edit Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={() => {
							logOut().then(() => {
								router.push("/login")
							})
						}}
					>
						<ExitIcon />
						<span className="leading-tight">Logout</span>
					</DropdownMenuItem>
					<p className="w-32 p-2 text-sm leading-tight sm:hidden">
						{user.displayName}
					</p>
				</DropdownMenuContent>
			</DropdownMenu>
			<ProfileDialog onOpenChange={setEditing} open={editing} user={user} />
		</>
	)
}

function DarkModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative" size="icon" variant="outline">
					<SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => {
						setTheme("light")
					}}
				>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme("dark")
					}}
				>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme("system")
					}}
				>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function ProfileDialog({
	onOpenChange,
	open,
	user,
}: {
	onOpenChange: (open: boolean) => void
	open: boolean
	user: NonNullable<ReturnType<typeof useAuth>["user"]>
}) {
	const { mutate: updateProfile } = useUpdateProfile(user)
	const [newName, setNewName] = React.useState(user.displayName ?? "")
	const [newPhotoURL, setNewPhotoURL] = React.useState(user.photoURL ?? "")

	return (
		<ResponsiveDialog
			body={
				<div className="flex flex-col gap-4 sm:mb-4">
					<Input
						className="col-span-3"
						id="username"
						label="Name"
						name="username"
						onChange={e => {
							setNewName(e.target.value)
						}}
						value={newName}
					/>
					<div className="grid w-full place-items-center">
						<UserImage editable handleNewUrl={setNewPhotoURL} />
					</div>
				</div>
			}
			buttons={[
				{
					children: "Save",
					key: "save",
					type: "submit",
				},
				{
					children: "Cancel",
					key: "cancel",
					variant: "ghost",
				},
			]}
			description={`Update your username or upload a ${
				user.photoURL ? "new " : ""
			}profile image`}
			onSubmit={() => {
				const updatedName = newName.trim()
				const args = {
					...(updatedName &&
						updatedName !== user.displayName && { displayName: updatedName }),
					...(newPhotoURL &&
						newPhotoURL !== user.photoURL && { photoURL: newPhotoURL }),
				}
				if (Object.keys(args).length) {
					updateProfile(args)
				}
			}}
			title="Edit profile"
			{...{ onOpenChange, open }}
		/>
	)
}
