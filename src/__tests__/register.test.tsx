import RegisterPage from "@/pages/register"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import * as firebaseAuth from "firebase/auth"
import { User } from "firebase/auth"
import { describe, expect, test, vi } from "vitest"

const mockUser = {
	displayName: null,
	email: "valid@email.test",
	uid: "uid",
} as User

describe("register page", () => {
	test("renders initial state", () => {
		const { asFragment, unmount } = render(<RegisterPage />)
		screen.getByRole("heading", { name: "Welcome!" })
		screen.getByLabelText("Username")
		screen.getByLabelText("Email")
		screen.getByLabelText("Password")
		screen.getByLabelText("Confirm Password")
		screen.getByRole("button", { name: "Sign Up" })
		screen.getByRole("button", { name: "google logo Continue with Google" })
		screen.getByText("Already a member?")
		screen.getByRole("link", { name: "Sign In" })
		screen.getByRole("link", { name: "Learn More" })
		expect(asFragment()).toMatchSnapshot()
		unmount()
	})

	test("validates inputs and handles submission", async () => {
		const createUserWithEmailAndPasswordSpy = vi.fn()
		vi.spyOn(firebaseAuth, "createUserWithEmailAndPassword").mockImplementation(
			(...args: Array<unknown>) => {
				createUserWithEmailAndPasswordSpy(...args)
				return Promise.resolve({
					operationType: "signIn",
					providerId: "providerId",
					user: mockUser,
				})
			},
		)
		const updateProfileSpy = vi.fn()
		vi.spyOn(firebaseAuth, "updateProfile").mockImplementation(updateProfileSpy)
		const { unmount } = render(<RegisterPage />)
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("Username is required")
		screen.getByText("Email is required")
		screen.getByText("Password is required")
		screen.getByText("Password confirmation is required")
		fireEvent.change(screen.getByLabelText("Username"), {
			target: { value: "my username" },
		})
		expect(screen.queryByText("Username is required")).toBeNull()
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "not an email" },
		})
		expect(screen.queryByText("Email is required")).toBeNull()
		expect(screen.queryByText("Password is required")).toBeNull()
		expect(screen.queryByText("Password confirmation is required")).toBeNull()
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("Invalid email")
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		expect(screen.queryByText("Invalid email")).toBeNull()
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "123" },
		})
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("Minimum password length is 6")
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password with spaces" },
		})
		expect(screen.queryByText("Minimum password length is 6")).toBeNull()
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("Password cannot include spaces")
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		})
		expect(screen.queryByText("Password cannot include spaces")).toBeNull()
		screen.getByRole("button", { name: "Sign Up" }).click()
		fireEvent.change(screen.getByLabelText("Confirm Password"), {
			target: { value: "not the same password" },
		})
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("Passwords must match")
		fireEvent.change(screen.getByLabelText("Confirm Password"), {
			target: { value: "password123" },
		})
		expect(screen.queryByText("Passwords must match")).toBeNull()
		screen.getByRole("button", { name: "Sign Up" }).click()
		expect(createUserWithEmailAndPasswordSpy).toBeCalledTimes(1)
		expect(createUserWithEmailAndPasswordSpy).toBeCalledWith(
			undefined,
			"valid@email.test",
			"password123",
		)
		await waitFor(() => {
			expect(updateProfileSpy).toBeCalledTimes(1)
		})
		expect(updateProfileSpy).toBeCalledWith(mockUser, {
			displayName: "my username",
		})
		unmount()
	})

	test("allows login with google", async () => {
		const signInWithPopupSpy = vi.fn()
		vi.spyOn(firebaseAuth, "signInWithPopup").mockImplementation(
			signInWithPopupSpy,
		)
		const { unmount } = render(<RegisterPage />)
		screen
			.getByRole("button", { name: "google logo Continue with Google" })
			.click()
		expect(signInWithPopupSpy).toBeCalledTimes(1)
		unmount()
	})

	test("handles API errors", async () => {
		vi.spyOn(firebaseAuth, "createUserWithEmailAndPassword").mockImplementation(
			() => {
				throw Error("API sign up error")
			},
		)
		const { unmount } = render(<RegisterPage />)
		fireEvent.change(screen.getByLabelText("Username"), {
			target: { value: "my username" },
		})
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "valid@email.test" },
		})
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		})
		fireEvent.change(screen.getByLabelText("Confirm Password"), {
			target: { value: "password123" },
		})
		screen.getByRole("button", { name: "Sign Up" }).click()
		await screen.findByText("API sign up error")
		unmount()
	})
})
