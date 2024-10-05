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
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import * as React from "react"
import { screens } from "tailwindcss/defaultTheme"

export function ResponsiveDialog({
	content,
	description,
	buttons,
	title,
	trigger,
}: {
	content?: JSX.Element
	description?: string
	buttons: Array<JSX.Element>
	title: string
	trigger: JSX.Element
}) {
	const dialog = useMediaQuery(`(min-width: ${screens.sm})`)
	const [open, setOpen] = React.useState(false)

	if (dialog) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					{content}
					<DialogFooter>
						{buttons.map(button => (
							<DialogClose asChild key={button.key}>
								{button}
							</DialogClose>
						))}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					{description && <DrawerDescription>{description}</DrawerDescription>}
				</DrawerHeader>
				{content}
				<DrawerFooter className="flex-col-reverse items-center">
					{buttons.map(button => (
						<DrawerClose asChild key={button.key}>
							{button}
						</DrawerClose>
					))}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
