import { Page } from "@/components/Page"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/router"

export default function FourOhFourPage() {
	const user = useAuth()
	const router = useRouter()

	router.replace(user ? "/" : "/login")

	return <Page loading loadingText="Redirecting..." />
}
