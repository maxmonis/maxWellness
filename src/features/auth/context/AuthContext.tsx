import { User } from "firebase/auth"
import * as React from "react"

export const AuthContext = React.createContext<{
	setUser: (user: User | null) => void
	user: User | null
}>({
	setUser: () => {},
	user: null,
})
