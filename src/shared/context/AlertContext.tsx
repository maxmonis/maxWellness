import {nanoid} from "nanoid"
import React from "react"

const AlertContext = React.createContext<{
  alerts: Alert[]
  persistentAlert: PersistentAlert | null
  setPersistentAlert: React.Dispatch<
    React.SetStateAction<PersistentAlert | null>
  >
  showAlert: (alert: Omit<Alert, "id">) => void
}>({
  alerts: [],
  persistentAlert: null,
  setPersistentAlert: returnVoid,
  showAlert: returnVoid,
})

export const useAlerts = () => React.useContext(AlertContext)

export const AlertContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [persistentAlert, setPersistentAlert] =
    React.useState<PersistentAlert | null>(null)

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

function returnVoid() {}

interface Alert {
  id: string
  text: string
  type: "danger" | "information" | "success"
}

interface PersistentAlert extends Omit<Alert, "id"> {
  actions?: {
    onClick: () => void
    text: string
  }[]
}
