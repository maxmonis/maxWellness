import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

type ToasterToast = ToastProps & {
	action?: ToastActionElement
	description?: React.ReactNode
	id: string
	title?: React.ReactNode
}

const actionTypes = {
	ADD_TOAST: "ADD_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
} as const

let count = 0

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER
	return count.toString()
}

type ActionType = typeof actionTypes

type Action =
	| {
			toast: ToasterToast
			type: ActionType["ADD_TOAST"]
	  }
	| {
			toastId?: ToasterToast["id"]
			type: ActionType["DISMISS_TOAST"]
	  }
	| {
			toastId?: ToasterToast["id"]
			type: ActionType["REMOVE_TOAST"]
	  }
	| {
			toast: Partial<ToasterToast>
			type: ActionType["UPDATE_TOAST"]
	  }

interface State {
	toasts: Array<ToasterToast>
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) return

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId)
		dispatch({ toastId, type: "REMOVE_TOAST" })
	}, TOAST_REMOVE_DELAY)

	toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			}

		case "DISMISS_TOAST": {
			const { toastId } = action

			// ! Side effects ! - This could be extracted into a dismissToast() action,
			// but I'll keep it here for simplicity
			if (toastId) addToRemoveQueue(toastId)
			else for (const toast of state.toasts) addToRemoveQueue(toast.id)

			return {
				...state,
				toasts: state.toasts.map(toast =>
					toast.id === toastId || !toastId ? { ...toast, open: false } : toast,
				),
			}
		}

		case "REMOVE_TOAST":
			if (!action.toastId) return { ...state, toasts: [] }

			return {
				...state,
				toasts: state.toasts.filter(t => t.id !== action.toastId),
			}

		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map(toast =>
					toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
				),
			}
	}
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action)
	for (const listener of listeners) listener(memoryState)
}

function toast(toast: Omit<ToasterToast, "id">) {
	const id = genId()

	const dismiss = () => {
		dispatch({ toastId: id, type: "DISMISS_TOAST" })
	}

	const update = (toast: ToasterToast) => {
		dispatch({ toast: { ...toast, id }, type: "UPDATE_TOAST" })
	}

	dispatch({
		toast: {
			...toast,
			duration: toast.duration ?? TOAST_REMOVE_DELAY,
			id,
			onOpenChange: open => {
				if (!open) dismiss()
			},
			open: true,
		},
		type: "ADD_TOAST",
	})

	return { id, dismiss, update }
}

function useToast() {
	const [state, setState] = React.useState<State>(memoryState)

	React.useEffect(() => {
		listeners.push(setState)
		return () => {
			const index = listeners.indexOf(setState)
			if (index > -1) listeners.splice(index, 1)
		}
	}, [state])

	return {
		...state,
		dismiss: (toastId?: string) => {
			dispatch({ type: "DISMISS_TOAST", toastId })
		},
		toast,
	}
}

export { toast, useToast }
