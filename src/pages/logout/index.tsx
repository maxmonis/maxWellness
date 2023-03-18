import {useRouter} from "next/router"

import Page from "~/components/Page"
import {logOut} from "~/firebase/client"

export default function LogOut() {
  const router = useRouter()

  logOut().finally(() => {
    router.replace("/login")
  })

  return <Page loading loadingText="Logging out..." />
}
