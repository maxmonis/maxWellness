import { useAlerts } from "@/context/AlertContext"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

/**
 * Can display one or more temporary toast alerts and/or a persistent alert
 */
export function Alerts() {
	const { persistentAlert } = useAlerts()

	if (!persistentAlert) {
		return <></>
	}

	return (
		<div
			className={cn(
				"fixed bottom-0 right-0 flex h-14 items-center justify-center border-t px-4 max-md:w-screen md:rounded-tl-lg md:border-l",
				persistentAlert.type === "danger" ? "bg-destructive" : "bg-background",
			)}
		>
			<div className="mx-auto flex items-center justify-center gap-4">
				<p className="text-sm">{persistentAlert.text}</p>
				{persistentAlert.actions?.map(({ onClick, text }) => (
					<Button key={text} variant="secondary" {...{ onClick }}>
						{text}
					</Button>
				))}
			</div>
		</div>
	)
}
