import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { Button } from "./ui/button"

/**
 * Displays a toggleable checkbox element
 */
export function Checkbox({
	checked,
	label,
	onCheckedChange,
	subtext,
}: {
	checked: boolean
	label: string
	onCheckedChange: Parameters<typeof CheckboxPrimitive>[0]["onCheckedChange"]
	subtext?: string
}) {
	return (
		<div className="items-top flex space-x-2">
			<CheckboxPrimitive id={label} {...{ checked, onCheckedChange }} />
			<div className="grid gap-1.5 leading-none">
				<label
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					htmlFor={label}
				>
					{label}
				</label>
				{subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
			</div>
		</div>
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
		<Button
			aria-label="go back"
			className="mr-2 h-min rounded-full p-1"
			onClick={() => {
				if (history.length > 1) {
					router.back()
				} else {
					router.replace(user ? "/" : "/register")
				}
			}}
			variant="ghost"
		>
			<ArrowLeftIcon className="h-5 w-5" />
		</Button>
	)
}
