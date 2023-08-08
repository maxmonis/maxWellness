import {useRouter} from "next/router"

import Page from "~/shared/components/Page"
import {useAuth} from "~/shared/context/AuthContext"

export default function FourOhFourPage() {
  const user = useAuth()
  const router = useRouter()

  router.replace(user ? "/" : "/login")

  return <Page loading loadingText="Redirecting..." />
}
