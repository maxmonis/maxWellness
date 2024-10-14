import { auth } from "@/firebase/app"
import { onAuthStateChanged, User } from "firebase/auth"
import * as React from "react"
import { AuthContext } from "./AuthContext"

export function AuthContextProvider({ children }: React.PropsWithChildren) {
	const [user, setUser] = React.useState<User | null>(null)
	const [loading, setLoading] = React.useState(true)

	const unsubscribe = onAuthStateChanged(auth, user => {
		setUser(user)
		setLoading(false)
	})

	React.useEffect(() => {
		return () => {
			unsubscribe()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<AuthContext.Provider value={user}>
			{loading ? null : children}
		</AuthContext.Provider>
	)
}
