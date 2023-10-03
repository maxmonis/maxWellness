import {faEllipsis} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {IconButton} from "~/shared/components/CTA"
import {useKeypress} from "~/shared/hooks/useKeypress"
import {useOutsideClick} from "~/shared/hooks/useOutsideClick"

/**
 * Allows the user to update/hide a name, and also to delete it if it's unused
 */
export function Menu({children}: {children: React.ReactNode}) {
  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      <IconButton
        aria-label="Toggle menu"
        className="flex items-center justify-center rounded-lg border-2 border-slate-300 p-1 dark:border-slate-700"
        icon={<FontAwesomeIcon icon={faEllipsis} size="lg" />}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="absolute top-6 -left-20 z-10 flex w-24 flex-col gap-4 rounded-lg border border-slate-700 p-4">
          {children}
        </dialog>
      )}
    </div>
  )
}
