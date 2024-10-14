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
