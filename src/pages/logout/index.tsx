import {useRouter} from "next/router"

import {logOut} from "~/firebase/client"
import Page from "~/shared/components/Page"

/**
 * Hidden route to end the current session
 */
export default function LogOut() {
  const router = useRouter()

  logOut().finally(() => router.replace("/login"))

  return <Page loading loadingText="Logging out..." />
}
