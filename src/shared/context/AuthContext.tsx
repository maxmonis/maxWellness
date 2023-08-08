import React from "react"

import {onAuthStateChanged, User} from "firebase/auth"

import {auth} from "~/firebase/client"

import Page from "../components/Page"

const AuthContext = React.createContext<User | null>(null)

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
    <AuthContext.Provider value={user}>
      {loading ? <Page loading loadingText="Authenticating..." /> : children}
    </AuthContext.Provider>
  )
}
