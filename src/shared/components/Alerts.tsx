import classNames from "classnames"
import {CSSTransition, TransitionGroup} from "react-transition-group"
import {useAlerts} from "~/shared/context/AlertContext"
import {Button} from "./CTA"

const bgColors = {
  danger: "bg-red-700",
  information: "bg-blue-700",
  success: "bg-green-700",
}

/**
 * Can display one or more temporary toast alerts and/or a persistent alert
 */
export function Alerts() {
  const {alerts, persistentAlert} = useAlerts()

  return (
    <>
      {/* temporary alerts slide in and out using an animation,
      and are automatically removed from the UI after 200 ms */}
      <TransitionGroup>
        {alerts.map(({id, text, type}) => (
          <CSSTransition classNames="slide-in" key={id} timeout={200}>
            <div
              className={classNames(
                "fixed top-16 right-4 rounded-lg px-4 py-2 text-white",
                bgColors[type],
              )}
            >
              <p>{text}</p>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>

      {/* the persistent alert appears until it is removed from context */}
      {persistentAlert && (
        <div
          className={classNames(
            "fixed bottom-0 right-0 flex justify-center gap-4 py-1 pl-2 pr-1 text-white max-lg:w-screen lg:rounded-tl-lg",
            bgColors[persistentAlert.type],
          )}
        >
          <div className="mx-auto flex items-center justify-center gap-4">
            <p className="font-bold">{persistentAlert.text}</p>
            {persistentAlert.actions?.map(({onClick, text}) => (
              <Button key={text} variant="secondary" {...{onClick}}>
                {text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
