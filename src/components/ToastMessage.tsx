import { CheckCircledIcon } from "@radix-ui/react-icons"

export function ToastMessage({
	message = "Your changes have been saved",
} = {}) {
	return (
		<div className="flex gap-2">
			<CheckCircledIcon />
			<p>{message}</p>
		</div>
	)
}
