import LoginPage from "@/pages/login"
import { fireEvent, render, screen } from "@testing-library/react"
import * as firebaseAuth from "firebase/auth"
import { describe, expect, test, vi } from "vitest"

describe("login page", () => {
	test("renders initial state", () => {
		const { asFragment, unmount } = render(<LoginPage />)
		screen.getByRole("heading", { name: "Welcome Back!" })
		screen.getByLabelText("Email")
		screen.getByLabelText("Password")
		screen.getByRole("button", { name: "Sign In" })
		screen.getByRole("button", { name: "google logo Continue with Google" })
		screen.getByRole("link", { name: "Forgot Password" })
		screen.getByText("Need an account?")
		screen.getByRole("link", { name: "Sign Up" })
		screen.getByRole("link", { name: "Learn More" })
		expect(asFragment()).toMatchSnapshot()
		unmount()
	})

	test("validates inputs and handles submission", async () => {
		const signInSpy = vi.fn()
		vi.spyOn(firebaseAuth, "signInWithEmailAndPassword").mockImplementation(
			signInSpy,
		)
		const { unmount } = render(<LoginPage />)
		screen.getByRole("button", { name: "Sign In" }).click()
		await screen.findByText("Email is required")
		screen.getByText("Password is required")
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "not an email" },
		})
		expect(screen.queryByText("Email is required")).toBeNull()
		expect(screen.queryByText("Password is required")).toBeNull()
		screen.getByRole("button", { name: "Sign In" }).click()
		await screen.findByText("Invalid email")
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		expect(screen.queryByText("Invalid email")).toBeNull()
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "123" },
		})
		screen.getByRole("button", { name: "Sign In" }).click()
		await screen.findByText("Minimum password length is 6")
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password with spaces" },
		})
		expect(screen.queryByText("Minimum password length is 6")).toBeNull()
		screen.getByRole("button", { name: "Sign In" }).click()
		await screen.findByText("Password cannot include spaces")
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		})
		expect(screen.queryByText("Password cannot include spaces")).toBeNull()
		screen.getByRole("button", { name: "Sign In" }).click()
		expect(signInSpy).toBeCalledTimes(1)
		expect(signInSpy).toBeCalledWith(
			undefined,
			"valid@email.test",
			"password123",
		)
		unmount()
	})

	test("allows login with google", async () => {
		const signInWithPopupSpy = vi.fn()
		vi.spyOn(firebaseAuth, "signInWithPopup").mockImplementation(
			signInWithPopupSpy,
		)
		const { unmount } = render(<LoginPage />)
		screen
			.getByRole("button", { name: "google logo Continue with Google" })
			.click()
		expect(signInWithPopupSpy).toBeCalledTimes(1)
		unmount()
	})

	test("handles API errors", async () => {
		vi.spyOn(firebaseAuth, "signInWithEmailAndPassword").mockImplementation(
			() => {
				throw Error("API login error")
			},
		)
		const { unmount } = render(<LoginPage />)
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		})
		screen.getByRole("button", { name: "Sign In" }).click()
		await screen.findByText("API login error")
		unmount()
	})
})
