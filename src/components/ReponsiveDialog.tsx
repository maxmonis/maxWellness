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
	body,
	buttons,
	description,
	onSubmit,
	title,
	trigger,
	...props
}: {
	buttons: Array<JSX.Element>
	description?: string
	title: string
} & (
	| {
			onOpenChange?: never
			open?: never
			trigger: JSX.Element
	  }
	| {
			onOpenChange: (open: boolean) => void
			open: boolean
			trigger?: never
	  }
) &
	(
		| { body: JSX.Element; onSubmit?: () => void }
		| { body?: never; onSubmit?: never }
	)) {
	const dialog = useMediaQuery(`(min-width: ${screens.sm})`)
	const [open, setOpen] = React.useState(false)
	const commonProps = {
		open: props.open ?? open,
		onOpenChange: newOpen => {
			props.onOpenChange ? props.onOpenChange(newOpen) : setOpen(newOpen)
		},
	}

	if (dialog) {
		return (
			<Dialog {...commonProps}>
				{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					<Body {...{ body, onSubmit }} />
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
		<Drawer {...commonProps}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					{description && <DrawerDescription>{description}</DrawerDescription>}
				</DrawerHeader>
				<Body {...{ body, onSubmit }} />
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

function Body({
	body,
	onSubmit,
}: {
	body?: JSX.Element
	onSubmit?: () => void
}) {
	if (!body) {
		return <></>
	}

	if (onSubmit) {
		return (
			<form
				className="max-sm:px-4"
				onSubmit={e => {
					e.preventDefault()
					onSubmit()
				}}
			>
				{body}
			</form>
		)
	}

	return <div className="max-sm:px-4">{body}</div>
}
