import {useRouter} from "next/router"

import Page from "~/shared/components/Page"
import {logOut} from "~/firebase/client"

/**
 * Hidden route to end the current session
 */
export default function LogOut() {
  const router = useRouter()

  logOut().finally(() => router.replace("/login"))

  return <Page loading loadingText="Logging out..." />
}
