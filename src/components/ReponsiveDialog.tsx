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
import { cn } from "@/lib/utils"
import * as React from "react"
import { screens } from "tailwindcss/defaultTheme"
import { Form } from "./Form"
import { Button, ButtonProps } from "./ui/button"

export function ResponsiveDialog({
	body,
	buttons,
	description,
	onSubmit,
	title,
	trigger,
	...props
}: {
	buttons: Array<ButtonProps & { key: string }>
	description?: string
	title: string
} & (
	| {
			onOpenChange?: never
			open?: never
			trigger: React.JSX.Element
	  }
	| {
			onOpenChange: (open: boolean) => void
			open: boolean
			trigger?: never
	  }
) &
	(
		| { body: React.JSX.Element; onSubmit?: () => void }
		| { body?: never; onSubmit?: never }
	)) {
	const dialog = useMediaQuery(`(min-width: ${screens.sm})`)
	const [open, setOpen] = React.useState(false)
	const commonProps = {
		open: props.open ?? open,
		onOpenChange: (newOpen: boolean) => {
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
					<Body {...{ body, onSubmit }}>
						<DialogFooter className="flex items-center sm:flex-row-reverse sm:justify-start">
							{buttons.map(({ className, key, ...props }, i) => (
								<DialogClose asChild key={key}>
									<Button
										autoFocus={i === 0}
										className={cn("first:ml-4", className)}
										{...props}
									/>
								</DialogClose>
							))}
						</DialogFooter>
					</Body>
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
				<Body {...{ body, onSubmit }}>
					<DrawerFooter className="items-center px-0">
						{buttons.map(({ className, key, ...props }) => (
							<DrawerClose asChild key={key}>
								<Button className={cn("first:w-full", className)} {...props} />
							</DrawerClose>
						))}
					</DrawerFooter>
				</Body>
			</DrawerContent>
		</Drawer>
	)
}

function Body({
	body,
	children,
	onSubmit,
}: React.PropsWithChildren<{
	body?: React.JSX.Element
	onSubmit?: () => void
}>) {
	if (onSubmit) {
		return (
			<Form className="max-sm:px-4" {...{ onSubmit }}>
				{body}
				{children}
			</Form>
		)
	}

	return (
		<div className="max-sm:px-4">
			{body}
			{children}
		</div>
	)
}
