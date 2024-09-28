import {nanoid} from "nanoid"
import React from "react"

const initialValue: {
  alerts: Array<Alert>
  persistentAlert: PersistentAlert
  setPersistentAlert: React.Dispatch<React.SetStateAction<PersistentAlert>>
  showAlert: (alert: Omit<Alert, "id">) => void
} = {
  alerts: [],
  persistentAlert: null,
  setPersistentAlert: () => {},
  showAlert: () => {},
}

const AlertContext = React.createContext(initialValue)

export const useAlerts = () => React.useContext(AlertContext)

export const AlertContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [alerts, setAlerts] = React.useState<typeof initialValue.alerts>([])
  const [persistentAlert, setPersistentAlert] =
    React.useState<typeof initialValue.persistentAlert>(null)

  return (
    <AlertContext.Provider
      value={{
        alerts,
        persistentAlert,
        setPersistentAlert,
        showAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )

  function showAlert(alert: Omit<Alert, "id">) {
    setAlerts([...alerts, {...alert, id: nanoid()}])
    setTimeout(() => {
      setAlerts(alerts.slice(1))
    }, 3000)
  }
}

interface Alert {
  id: string
  text: string
  type: "danger" | "information" | "success"
}

type PersistentAlert =
  | null
  | (Omit<Alert, "id"> & {
      actions?: Array<{
        onClick: () => void
        text: string
      }>
    })
