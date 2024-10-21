import PasswordPage from "@/pages/password"
import { fireEvent, render, screen } from "@testing-library/react"
import * as firebaseAuth from "firebase/auth"
import { describe, expect, test, vi } from "vitest"

describe("password page", () => {
	test("renders initial state", () => {
		const { asFragment, unmount } = render(<PasswordPage />)
		screen.getByRole("heading", { name: "Reset Password" })
		screen.getByLabelText("Email")
		screen.getByRole("button", { name: "Send Link" })
		screen.getByRole("link", { name: "Return to Login" })
		screen.getByText("Need an account?")
		screen.getByRole("link", { name: "Sign Up" })
		expect(asFragment()).toMatchSnapshot()
		unmount()
	})

	test("validates input and handles submission", async () => {
		const sendPasswordResetEmailSpy = vi.fn()
		vi.spyOn(firebaseAuth, "sendPasswordResetEmail").mockImplementation(
			sendPasswordResetEmailSpy,
		)
		const { unmount } = render(<PasswordPage />)
		screen.getByRole("button", { name: "Send Link" }).click()
		await screen.findByText("Email is required")
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "not an email" },
		})
		expect(screen.queryByText("Email is required")).toBeNull()
		screen.getByRole("button", { name: "Send Link" }).click()
		await screen.findByText("Invalid email")
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		expect(screen.queryByText("Invalid email")).toBeNull()
		screen.getByRole("button", { name: "Send Link" }).click()
		expect(sendPasswordResetEmailSpy).toBeCalledTimes(1)
		expect(sendPasswordResetEmailSpy).toBeCalledWith(
			undefined,
			"valid@email.test",
		)
		await screen.findByRole("heading", { name: "Email Sent" })
		screen.getByText(
			"Please check valid@email.test for instructions on resetting your password",
		)
		screen.getByRole("link", { name: "Return to Login" })
		unmount()
	})

	test("handles API errors", async () => {
		vi.spyOn(firebaseAuth, "sendPasswordResetEmail").mockImplementation(() => {
			throw Error("API password reset error")
		})
		const { unmount } = render(<PasswordPage />)
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		screen.getByRole("button", { name: "Send Link" }).click()
		await screen.findByText("API password reset error")
		unmount()
	})
})
