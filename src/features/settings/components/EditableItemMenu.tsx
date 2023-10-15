import {faMinusCircle, faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton} from "~/shared/components/CTA"
import {Menu} from "~/shared/components/Menu"
import {EditableName} from "~/shared/utils/models"

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
  return (
    <Menu>
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
            <FontAwesomeIcon aria-label={`Delete ${newText}`} icon={faTrash} />
          }
          onClick={onDeleteClick}
          text="Delete"
        />
      )}
    </Menu>
  )
}
