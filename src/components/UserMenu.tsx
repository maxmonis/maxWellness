import { Input } from "@/components/Input"
import { logOut } from "@/firebase/app"
import { useSession } from "@/hooks/useSession"
import { useUpdateProfile } from "@/hooks/useUpdateProfile"
import { ExitIcon, MoonIcon, Pencil2Icon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import * as React from "react"
import { ResponsiveDialog } from "./ReponsiveDialog"
import { UserImage } from "./UserImage"
import { Button } from "./ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu"

/**
 * This menu allows the user to toggle dark mode,
 * update their profile, or log out
 */
export function UserMenu() {
	const { loading, session } = useSession()
	const router = useRouter()
	const [editing, setEditing] = React.useState(false)

	if (loading) {
		return <></>
	}

	if (!session) {
		return (
			<div className="max-lg:pr-4">
				<DarkModeToggle />
			</div>
		)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="h-min gap-2 max-md:flex-row-reverse md:w-full md:px-2"
						variant="ghost"
					>
						<UserImage />
						<span className="w-32 whitespace-normal text-right text-sm leading-tight max-sm:sr-only md:text-left">
							{session.profile.userName}
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
						{session.profile.userName}
					</p>
				</DropdownMenuContent>
			</DropdownMenu>
			<ProfileDialog onOpenChange={setEditing} open={editing} {...session} />
		</>
	)
}

function DarkModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="outline">
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
	profile,
}: {
	onOpenChange: (open: boolean) => void
	open: boolean
} & NonNullable<ReturnType<typeof useSession>["session"]>) {
	const { mutate: updateProfile } = useUpdateProfile()
	const [newName, setNewName] = React.useState(profile.userName)
	const [newPhotoURL, setNewPhotoURL] = React.useState(profile.photoURL)

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
				<Button key="cancel" variant="ghost">
					Cancel
				</Button>,
				<Button className="max-sm:w-full" key="save" type="submit">
					Save changes
				</Button>,
			]}
			description={`Update your username or upload a ${
				profile.photoURL ? "new " : ""
			}profile image`}
			onSubmit={() => {
				const userName = newName.trim()
				const args = {
					...(userName && userName !== profile.userName && { userName }),
					...(newPhotoURL &&
						newPhotoURL !== profile.photoURL && { photoURL: newPhotoURL }),
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
