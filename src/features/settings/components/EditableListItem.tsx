import {faXmarkSquare} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import React from "react"
import {Button, IconButton} from "~/shared/components/CTA"
import {EditableName} from "~/shared/utils/models"
import {isTextAlreadyInList} from "../settingsFunctions"
import {EditableItemMenu} from "./EditableItemMenu"

/**
 * Allows the user to edit or delete a lift/workout name
 */
export function EditableListItem({
  editableName,
  editableNameList,
  updateOptions,
}: {
  editableName: EditableName
  editableNameList: EditableName[]
  updateOptions: (newValue: EditableName, previousValue: EditableName) => void
}) {
  const [newText, setNewText] = React.useState(editableName.text)
  const [editing, setEditing] = React.useState(false)

  const isDuplicate = isTextAlreadyInList(newText, editableNameList)
  const canHide = editableNameList.filter(n => !n.isHidden).length > 1

  return (
    <li className="mt-4 flex items-center justify-between gap-4">
      {editing ? (
        <form className="w-full" {...{onSubmit}}>
          <div className="flex items-center justify-center gap-4 px-1">
            <input autoFocus value={newText} {...{onChange, onKeyUp}} />
            <IconButton
              aria-label="Discard changes"
              className="max-sm:hidden"
              icon={<FontAwesomeIcon icon={faXmarkSquare} size="lg" />}
              onClick={handleReset}
            />
          </div>
          {newText !== editableName.text && (
            <div className="mb-2 flex justify-center">
              {isDuplicate ? (
                <p className="mt-1 text-center text-red-500">Duplicate name</p>
              ) : newText ? (
                <Button
                  className="mt-3 w-fit"
                  type="submit"
                  variant="secondary"
                >
                  Update Name
                </Button>
              ) : editableName.canDelete ? (
                <Button className="mt-3 w-fit" type="submit" variant="danger">
                  Delete Name
                </Button>
              ) : (
                <p className="mt-1 text-center text-sm text-red-500">
                  Can&apos;t delete, used in workout(s)
                </p>
              )}
            </div>
          )}
        </form>
      ) : (
        <>
          <span
            aria-label={`Edit ${newText}`}
            className={classNames(
              "leading-tight",
              editableName.isHidden && "line-through",
            )}
            onClick={() => setEditing(true)}
          >
            {newText}
          </span>
          <EditableItemMenu
            onDeleteClick={handleDelete}
            onEditClick={() => setEditing(true)}
            {...{canHide, editableName, newText, onHideClick}}
          />
        </>
      )}
    </li>
  )

  /**
   * Handles form updates, sanitizing the value
   */
  function onChange({target: {value}}: React.ChangeEvent<HTMLInputElement>) {
    if (!value || /^[A-Za-z ]+$/.test(value)) {
      setNewText(value.trimStart().replace(/\s/, " "))
    }
  }

  /**
   * Cancels editing if the user presses the escape key
   */
  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setEditing(false)
      setNewText(editableName.text)
    }
  }

  /**
   * Attempts to save the user's changes
   */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isDuplicate) {
      setNewText(editableName.text)
    } else if (!newText.trim()) {
      handleDelete()
    } else {
      updateOptions({...editableName, text: newText.trim()}, editableName)
    }
    setEditing(false)
  }

  /**
   * Deletes the name (if allowed)
   */
  function handleDelete() {
    if (editableName.canDelete && editableNameList.length > 1) {
      updateOptions({...editableName, text: ""}, editableName)
    } else {
      handleReset()
    }
  }

  /**
   * Updates whether a name is hidden (if possible)
   */
  function onHideClick() {
    const newHidden = !editableName.isHidden
    if ((canHide && newHidden) || !newHidden) {
      updateOptions({...editableName, isHidden: newHidden}, editableName)
    }
  }

  /**
   * Resets the component
   */
  function handleReset() {
    setEditing(false)
    setNewText(editableName.text)
  }
}
