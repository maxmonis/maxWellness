import {useRouter} from "next/router"
import {Page} from "~/components/Page"
import {useAuth} from "~/context/AuthContext"

export default function FourOhFourPage() {
  const user = useAuth()
  const router = useRouter()

  router.replace(user ? "/" : "/login")

  return <Page loading loadingText="Redirecting..." />
}
