import {
  faEllipsis,
  faMinusCircle,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import {IconButton} from "~/shared/components/CTA"
import useKeypress from "~/shared/hooks/useKeypress"
import useOutsideClick from "~/shared/hooks/useOutsideClick"
import {EditableName} from "~/shared/resources/models"

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
        className={`rounded-lg border p-1 ${
          open ? "border-slate-300 bg-slate-100" : "border-transparent"
        }`}
        icon={<FontAwesomeIcon icon={faEllipsis} size="xl" />}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="absolute top-8 -left-24 z-10 flex w-28 flex-col items-start gap-4 rounded-lg border p-4">
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
