import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logOut } from "@/firebase/app"
import { useSession } from "@/hooks/useSession"
import { useUpdateProfile } from "@/hooks/useUpdateProfile"
import { ExitIcon, MoonIcon, Pencil2Icon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useRouter } from "next/router"
import React from "react"
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
	const { mutate: updateProfile } = useUpdateProfile()
	const router = useRouter()
	const buttonRef = React.createRef<HTMLButtonElement>()

	if (loading) {
		return <></>
	}

	if (!session) {
		return (
			<div className="max-sm:pr-4">
				<DarkModeToggle />
			</div>
		)
	}

	return (
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
				<ProfileDialog
					handleClose={() => {
						buttonRef.current?.click()
					}}
					{...session}
				/>
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
				<DropdownMenuItem className="hidden">
					<button ref={buttonRef} />
				</DropdownMenuItem>
				<p className="w-32 p-2 text-sm leading-tight sm:hidden">
					{session.profile.userName}
				</p>
			</DropdownMenuContent>
		</DropdownMenu>
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
	handleClose,
	profile,
}: { handleClose: () => void } & NonNullable<
	ReturnType<typeof useSession>["session"]
>) {
	const { mutate: updateProfile } = useUpdateProfile()
	const [newName, setNewName] = React.useState(profile.userName)
	const [newPhotoURL, setNewPhotoURL] = React.useState(profile.photoURL)

	return (
		<Dialog
			onOpenChange={open => {
				if (!open) {
					handleClose()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					className="w-full cursor-default justify-start gap-2 px-2 py-1.5 font-normal"
					variant="ghost"
				>
					<Pencil2Icon />
					<span className="leading-tight">Edit profile</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="gap-6">
				<form
					onSubmit={e => {
						e.preventDefault()
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
				>
					<DialogHeader>
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>
							Update your username or upload a&nbsp;
							{profile.photoURL ? "new " : ""}profile image
						</DialogDescription>
					</DialogHeader>
					<div className="my-4 grid gap-4">
						<div>
							<Label className="ml-1" htmlFor="name">
								Name
							</Label>
							<Input
								autoFocus
								className="col-span-3"
								id="name"
								onChange={e => {
									setNewName(e.target.value)
								}}
								value={newName}
							/>
						</div>
						<div className="grid place-items-center">
							<UserImage editable handleNewUrl={setNewPhotoURL} />
						</div>
					</div>
					<DialogFooter className="gap-y-2">
						<DialogClose asChild>
							<Button type="button" variant="ghost">
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button type="submit">Save changes</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
