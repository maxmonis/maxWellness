import {
  faEllipsis,
  faMinusCircle,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import React from "react"
import {IconButton} from "~/components/CTA"
import {useKeypress} from "~/hooks/useKeypress"
import {useOutsideClick} from "~/hooks/useOutsideClick"
import {EditableName} from "~/utils/models"

/**
 * Allows the user to update/hide a name, and also to delete it if it's unused
 */
export function EditableItemMenu({
  canHide,
  editableName: {canDelete, isHidden},
  newText,
  onDeleteClick,
  onEditClick,
  onHideClick,
}: {
  canHide: boolean
  editableName: EditableName
  newText: string
  onDeleteClick: () => void
  onEditClick: () => void
  onHideClick: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      <IconButton
        aria-label="Toggle menu"
        className={classNames(
          "flex items-center justify-center rounded-lg border-2 p-1 hover:border-slate-300 dark:hover:border-slate-700",
          open
            ? "border-slate-300 dark:border-slate-700"
            : "border-transparent",
        )}
        icon={<FontAwesomeIcon icon={faEllipsis} size="lg" />}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="absolute -left-24 top-8 z-10 flex flex-col gap-4 rounded-lg border border-slate-700 p-4">
          <IconButton
            aria-label={`Edit ${newText}`}
            icon={<FontAwesomeIcon icon={faPen} />}
            onClick={onEditClick}
            text="Edit"
            textClass="whitespace-nowrap"
          />
          {((canHide && !isHidden) || isHidden) && (
            <IconButton
              aria-label={`${isHidden ? "Unhide" : "Hide"} ${newText}`}
              icon={<FontAwesomeIcon icon={faMinusCircle} />}
              onClick={onHideClick}
              text={isHidden ? "Unhide" : "Hide"}
            />
          )}
          {canDelete && (
            <IconButton
              icon={
                <FontAwesomeIcon
                  aria-label={`Delete ${newText}`}
                  icon={faTrash}
                />
              }
              onClick={onDeleteClick}
              text="Delete"
            />
          )}
        </dialog>
      )}
    </div>
  )
}
