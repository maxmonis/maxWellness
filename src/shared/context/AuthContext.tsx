import React from "react"

import {onAuthStateChanged, User} from "firebase/auth"

import Page from "~/shared/components/Page"
import {auth} from "~/firebase/client"

const AuthContext = React.createContext<[User | null, boolean]>([null, true])

export const useAuth = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  const unsubscribe = onAuthStateChanged(auth, user => {
    setUser(user)
    setLoading(false)
  })

  React.useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={[user, loading]}>
      {loading ? <Page loading loadingText="Authenticating..." /> : children}
    </AuthContext.Provider>
  )
}
