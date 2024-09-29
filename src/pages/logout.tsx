import { Page } from "@/components/Page"
import { logOut } from "@/firebase/app"
import { useRouter } from "next/router"

/**
 * Hidden route to end the current session
 */
export default function LogoutPage() {
	const router = useRouter()

	logOut().finally(() => {
		router.replace("/login")
	})

	return <Page loading loadingText="Logging out..." />
}
