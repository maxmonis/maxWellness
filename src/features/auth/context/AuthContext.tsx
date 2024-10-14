import { User } from "firebase/auth"
import * as React from "react"

export const AuthContext = React.createContext<User | null>(null)
