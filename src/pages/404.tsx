import { PageWithBackdrop } from "@/components/PageWithBackdrop"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function FourOhFourPage() {
	return (
		<PageWithBackdrop title="404 - Not Found">
			<p className="mb-4 text-sm">
				The requested page does not exist or has moved. If you typed the URL
				manually, please check your spelling.
			</p>
			<Link
				className={cn(buttonVariants({ variant: "default" }), "w-full")}
				href="/"
				replace
			>
				Return Home
			</Link>
		</PageWithBackdrop>
	)
}
