import React from "react"

import {TransitionGroup, CSSTransition} from "react-transition-group"

import {useAlerts} from "~/shared/context/AlertContext"

const bgColors = {
  danger: "bg-red-100 dark:bg-red-700 border-red-700 border",
  information: "bg-blue-100 dark:bg-blue-700 border-blue-700 border",
  success: "bg-green-100 dark:bg-green-700 border-green-700 border",
}

const textColors = {
  danger: "text-red-500",
  information: "text-blue-500",
  success: "text-green-500",
}

/**
 * Can display one or more temporary toast alerts and/or a persistent alert
 */
export default function Alerts() {
  const {alerts, persistentAlert} = useAlerts()

  return (
    <>
      {/* temporary alerts slide in and out using an animation, and are
      automatically removed from the UI after 200 ms */}
      <TransitionGroup>
        {alerts.map(({id, text, type}) => (
          <CSSTransition classNames="slide-in" key={id} timeout={200}>
            <div
              className={`px-4 py-2 rounded-lg fixed top-16 right-4 ${bgColors[type]}`}
            >
              <p>{text}</p>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>

      {/* the persistent alert appears until it is removed from context */}
      {persistentAlert && (
        <div
          className={`fixed bottom-0 left-0 w-screen flex justify-center gap-4 ${
            textColors[persistentAlert.type]
          }`}
        >
          <div className="px-4 py-2 w-screen flex items-center justify-end gap-4 border-t bg-slate-50 dark:bg-black border-slate-700 max-w-2xl sm:border-x">
            <p className="font-bold">{persistentAlert.text}</p>
            {persistentAlert.actions?.map(({onClick, text}) => (
              <button
                className="py-1 px-2 rounded-md border"
                key={text}
                {...{onClick}}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
