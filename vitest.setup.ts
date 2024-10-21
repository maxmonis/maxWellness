import { vi } from "vitest"

vi.mock(import("firebase/app"), async importOriginal => {
	const app = await importOriginal()
	return {
		...app,
		initializeApp: vi.fn(),
	}
})

vi.mock(import("firebase/auth"), async importOriginal => {
	const auth = await importOriginal()
	return {
		...auth,
		getAuth: vi.fn(),
	}
})

vi.mock(import("firebase/firestore"), async importOriginal => {
	const firestore = await importOriginal()
	return {
		...firestore,
		getFirestore: vi.fn(),
	}
})

vi.mock(import("firebase/storage"), async importOriginal => {
	const storage = await importOriginal()
	return {
		...storage,
		getStorage: vi.fn(),
	}
})

vi.mock("next/router", () => ({
	useRouter: vi.fn(),
}))
