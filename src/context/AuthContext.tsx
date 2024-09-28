import { auth } from "@/firebase/app"
import { onAuthStateChanged, User } from "firebase/auth"
import React from "react"

const AuthContext = React.createContext<User | null>(null)

export const useAuth = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
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
