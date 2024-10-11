export const buttonText = {
	login: "Sign In",
	register: "Sign Up",
	password: "Send Link",
} as const

export const fieldKeys = {
	login: ["email", "password"],
	register: ["userName", "email", "password", "password2"],
	password: ["email"],
} as const

export const fieldLabels = {
	email: "Email",
	password: "Password",
	password2: "Confirm Password",
	userName: "Username",
} as const

export const fieldTypes = {
	email: "email",
	password: "password",
	password2: "password",
	userName: "text",
} as const

export const pageTitles = {
	login: "Welcome Back!",
	password: "Reset Password",
	register: "Welcome!",
} as const
