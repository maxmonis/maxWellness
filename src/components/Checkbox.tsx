import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox"

type CheckboxPrimitiveProps = React.ComponentProps<typeof CheckboxPrimitive>

interface CheckboxProps
	extends Omit<CheckboxPrimitiveProps, "checked" | "onCheckedChange"> {
	checked: boolean
	label: string
	onCheckedChange: NonNullable<CheckboxPrimitiveProps["onCheckedChange"]>
	subtext?: string
}

/**
 * Displays a toggleable checkbox element
 */
export function Checkbox({ label, subtext, ...props }: CheckboxProps) {
	return (
		<div className="items-top flex space-x-2">
			<CheckboxPrimitive id={label} {...props} />
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
