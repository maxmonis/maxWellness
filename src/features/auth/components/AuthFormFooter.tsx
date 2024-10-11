import Link from "next/link"
import { AuthRoute } from "../utils/models"

export function AuthFormFooter({ route }: { route: AuthRoute }) {
	return (
		<footer className="mt-4 grid gap-2 text-sm">
			{route === "login" && (
				<div>
					<Link className="underline" href="/password">
						Forgot Password
					</Link>
				</div>
			)}
			{route === "password" && (
				<div>
					<Link className="underline" href="/login">
						Return to Login
					</Link>
				</div>
			)}
			<div className="flex flex-wrap gap-x-1.5">
				<p className="whitespace-nowrap">
					{route === "register" ? "Already a member?" : "Need an account?"}
				</p>
				<Link
					className="underline"
					href={route === "register" ? "/login" : "/register"}
				>
					{route === "register" ? "Sign In" : "Sign Up"}
				</Link>
			</div>
			{route !== "password" && (
				<div>
					<Link className="underline" href="/about">
						Learn More
					</Link>
				</div>
			)}
		</footer>
	)
}
