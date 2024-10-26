import { useAuth } from "@/features/auth/hooks/useAuth"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { Button } from "./ui/button"

/**
 * Takes the user back to the previous page if one exists,
 * and otherwise to the home page if they're logged in or
 * to the register page if they're not
 */
export function BackButton() {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<Button
			className="mr-1 rounded-full"
			onClick={() => {
				if (history.length > 1) {
					router.back()
				} else {
					router.replace(user ? "/" : "/register")
				}
			}}
			size="icon"
			variant="ghost"
		>
			<span className="sr-only">Go back</span>
			<ArrowLeftIcon className="h-5 w-5" />
		</Button>
	)
}
