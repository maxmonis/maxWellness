import React from "react"

const initialValue: {
	persistentAlert: PersistentAlert
	setPersistentAlert: React.Dispatch<React.SetStateAction<PersistentAlert>>
} = {
	persistentAlert: null,
	setPersistentAlert: () => {},
}

const AlertContext = React.createContext(initialValue)

export const useAlerts = () => React.useContext(AlertContext)

export const AlertContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [persistentAlert, setPersistentAlert] =
		React.useState<typeof initialValue.persistentAlert>(null)

	return (
		<AlertContext.Provider
			value={{
				persistentAlert,
				setPersistentAlert,
			}}
		>
			{children}
		</AlertContext.Provider>
	)
}

type PersistentAlert = null | {
	actions?: Array<{
		onClick: () => void
		text: string
	}>
	text: string
	type: "danger" | "information" | "success"
}
