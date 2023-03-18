import React from "react"

import {TransitionGroup, CSSTransition} from "react-transition-group"

import {useAlerts} from "~/context/AlertContext"

const bgColors = {
  danger: "bg-red-700",
  information: "bg-blue-700",
  success: "bg-green-700",
}

const textColors = {
  danger: "text-red-500",
  information: "text-blue-500",
  success: "text-green-500",
}

export default function Alerts() {
  const {alerts, persistentAlert} = useAlerts()

  return (
    <>
      <TransitionGroup>
        {alerts.map(({id, text, type}) => (
          <CSSTransition classNames="slide-in" key={id} timeout={200}>
            <div
              className={`px-4 py-2 rounded-lg fixed top-16 left-4 ${bgColors[type]}`}
            >
              <p>{text}</p>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
      {persistentAlert && (
        <div className="fixed bottom-0 left-0 w-screen flex justify-center gap-4">
          <div className="px-4 py-2 w-screen flex items-center justify-end gap-4 bg-black border-t border-slate-700 max-w-2xl sm:border-x">
            <p className={`font-bold ${textColors[persistentAlert.type]}`}>
              {persistentAlert.text}
            </p>
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
