import { PageWithBackdrop } from "@/components/PageWithBackdrop"
import Link from "next/link"

export function EmailSentConfirmation({ email }: { email: string }) {
	return (
		<PageWithBackdrop title="Email Sent">
			<p className="mb-4 text-sm">
				Please check {email} for instructions on resetting your password
			</p>
			<Link className="underline" href="/login">
				Return to Login
			</Link>
		</PageWithBackdrop>
	)
}
