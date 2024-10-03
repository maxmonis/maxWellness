import { useAlerts } from "@/context/AlertContext"
import { cn } from "@/lib/utils"
import { Button } from "./CTA"

const bgColors = {
	danger: "bg-red-700",
	information: "bg-blue-700",
	success: "bg-green-700",
}

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
				"fixed bottom-0 right-0 flex h-14 items-center justify-center px-4 text-white max-md:w-screen md:rounded-tl-lg",
				bgColors[persistentAlert.type],
			)}
		>
			<div className="mx-auto flex items-center justify-center gap-4">
				<p className="font-bold">{persistentAlert.text}</p>
				{persistentAlert.actions?.map(({ onClick, text }) => (
					<Button key={text} variant="secondary" {...{ onClick }}>
						{text}
					</Button>
				))}
			</div>
		</div>
	)
}
