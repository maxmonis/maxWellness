import React from "react"
import Link from "next/link"

import {
  faHome,
  faPen,
  faTrash,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import sortBy from "lodash/sortBy"
import {nanoid} from "nanoid"

import Page from "~/shared/components/Page"
import {useAlerts} from "~/shared/context/AlertContext"
import useSession from "~/shared/hooks/useSession"
import useUpdateProfile from "~/shared/hooks/useUpdateProfile"
import {EditableName, Profile} from "~/shared/resources/models"
import {Button, IconButton, UserMenu} from "~/shared/components/CTA"

/**
 * Allows the user to manage the names of workouts and exercises
 */
export default function SettingsPage() {
  const [session, loading, error] = useSession()

  return (
    <Page
      component={SettingsApp}
      Loader={SettingsLoader}
      mustBeLoggedIn
      props={session && {profile: session.profile}}
      title="Settings"
      {...{error, loading}}
    />
  )
}

function SettingsLoader() {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden border-slate-700">
      <div className="w-screen">
        <div className="bg-slate-50 dark:bg-black flex gap-6 items-center justify-between h-16 px-6 border-slate-700 border-b max-w-2xl mx-auto sm:border-x">
          {Array.from({length: 2}).map((_, i) => (
            <span
              className="h-7 w-7 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center divide-x divide-slate-700 border-slate-700 w-screen min-h-full max-w-2xl sm:border-x">
        {Array.from({length: 2}).map((_, i) => (
          <div
            className="flex flex-col flex-grow items-center w-full overflow-hidden"
            key={i}
          >
            <div className="flex border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
              <span className="h-7 w-24 rounded bg-slate-300 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="flex flex-col w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
              <div className="flex">
                <span className="h-9 w-full rounded bg-slate-300 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="flex flex-col gap-5 h-full pt-6 pb-20">
                {Array.from({length: i === 0 ? 2 : 1}).map((_, j) => (
                  <div className="flex flex-col gap-5" key={`${i}${j}`}>
                    {[24, 20, 20, 24].map(width => (
                      <div className="flex justify-between items-center">
                        <span
                          className={`h-5 w-${width} rounded bg-slate-300 dark:bg-slate-700 animate-pulse`}
                        />
                        <div className="flex gap-4">
                          <span className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsApp({profile}: {profile: Profile}) {
  const {showAlert} = useAlerts()

  const updateProfile = useUpdateProfile({
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess() {
      showAlert({
        text: "Settings updated",
        type: "success",
      })
    },
  })

  const [liftNames, setLiftNames] = React.useState(profile.liftNames)
  const [workoutNames, setWorkoutNames] = React.useState(profile.workoutNames)

  const [submitting, setSubmitting] = React.useState(false)
  const [values, setValues] = React.useState({lift: "", workout: ""})
  const {lift, workout} = values

  const liftNamesRef = React.useRef(liftNames)
  const workoutNamesRef = React.useRef(workoutNames)

  React.useEffect(() => {
    liftNamesRef.current = liftNames
  }, [liftNames])

  React.useEffect(() => {
    workoutNamesRef.current = workoutNames
  }, [workoutNames])

  React.useEffect(() => {
    return () => {
      saveChanges()
    }
  }, [])

  return (
    <div className="flex justify-center border-slate-700 h-screen">
      <div className="fixed top-0 left-0 w-screen">
        <div className="bg-slate-50 dark:bg-black flex gap-6 items-center justify-between h-16 px-6 max-w-2xl mx-auto border-slate-700 border-b sm:border-x">
          <Link aria-label="Go to the home page" href="/">
            <IconButton
              hideSm
              icon={<FontAwesomeIcon icon={faHome} size="xl" />}
              side="right"
              text="Home"
            />
          </Link>
          <UserMenu />
        </div>
      </div>
      <div className="flex justify-center divide-x divide-slate-700 border-slate-700 pt-16 w-screen max-w-2xl sm:border-x">
        <div className="flex flex-col flex-grow items-center w-full overflow-hidden">
          <div className="border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
            <h3 className="text-xl">Exercises</h3>
          </div>
          <div className="flex flex-col w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
            <form onSubmit={handleLiftSubmit}>
              <div className="flex gap-4 items-center justify-center text-lg">
                <input
                  name="lift"
                  value={lift}
                  placeholder="New exercise"
                  {...{onChange}}
                />
                {lift && (
                  <button
                    className="hidden sm:block"
                    onClick={() => setValues({...values, lift: ""})}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faXmarkSquare} size="xl" />
                  </button>
                )}
              </div>
              {lift && (
                <>
                  {liftNames.some(
                    ({text}) => text.toLowerCase() === lift.toLowerCase(),
                  ) ? (
                    <p className="text-red-500 text-center mt-1">
                      Duplicate name
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        className="mt-3 w-fit"
                        type="submit"
                        variant="secondary"
                      >
                        Add Name
                      </Button>
                    </div>
                  )}
                </>
              )}
            </form>
            <ul className="h-full overflow-y-scroll pt-2 pb-20">
              {sortBy(liftNames, "text").map(liftName => (
                <EditableListItem
                  editableName={liftName}
                  editableNameList={liftNames}
                  key={liftName.id}
                  updateOptions={updateLiftNames}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center w-full overflow-hidden">
          <div className="border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
            <h3 className="text-xl">Workouts</h3>
          </div>
          <div className="flex flex-col w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
            <form onSubmit={handleWorkoutSubmit}>
              <div className="flex gap-4 items-center justify-center text-lg">
                <input
                  name="workout"
                  value={workout}
                  placeholder="New workout"
                  {...{onChange}}
                />
                {workout && (
                  <button
                    className="hidden sm:block"
                    onClick={() => setValues({...values, workout: ""})}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faXmarkSquare} size="xl" />
                  </button>
                )}
              </div>
              {workout && (
                <>
                  {workoutNames.some(
                    ({text}) => text.toLowerCase() === workout.toLowerCase(),
                  ) ? (
                    <p className="text-red-500 text-center mt-1">
                      Duplicate name
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        className="mt-3 w-fit"
                        type="submit"
                        variant="secondary"
                      >
                        Add Name
                      </Button>
                    </div>
                  )}
                </>
              )}
            </form>
            <ul className="h-full overflow-y-scroll pt-2 pb-20">
              {sortBy(workoutNames, "text").map(workoutName => (
                <EditableListItem
                  key={workoutName.id}
                  editableName={workoutName}
                  editableNameList={workoutNames}
                  updateOptions={updateWorkoutNames}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Saves the profile unless it is unchanged
   */
  async function saveChanges() {
    if (submitting) {
      return
    }

    if (
      isEqual(
        workoutNamesRef.current.map(name => omit(name, "canDelete")),
        profile.workoutNames.map(name => omit(name, "canDelete")),
      ) &&
      isEqual(
        liftNamesRef.current.map(name => omit(name, "canDelete")),
        profile.liftNames.map(name => omit(name, "canDelete")),
      )
    ) {
      return
    }

    updateProfile({
      ...profile,
      liftNames: liftNamesRef.current.map(({id, text}) => ({id, text})),
      workoutNames: workoutNamesRef.current.map(({id, text}) => ({
        id,
        text,
      })),
    })
  }

  /**
   * Handles updates to the form inputs, sanitizing the values
   */
  function onChange({
    target: {name, value},
  }: React.ChangeEvent<HTMLInputElement>) {
    if (!value || /^[A-Za-z ]+$/.test(value)) {
      setValues({
        ...values,
        [name]: value.trimStart().replace(/\s/, " ").substring(0, 36),
      })
    }
  }

  /**
   * Saves a lift name unless it is a duplicate
   */
  function handleLiftSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      lift &&
      !liftNames.some(
        ({text}) =>
          text.toLowerCase().replace(/\s/g, "") ===
          lift.toLowerCase().replace(/\s/g, ""),
      )
    ) {
      setLiftNames([
        ...liftNames,
        {
          id: nanoid(),
          text: lift.trim(),
          canDelete: true,
        },
      ])
      setValues({...values, lift: ""})
    }
  }

  /**
   * Saves a workout name unless it is a duplicate
   */
  function handleWorkoutSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      workout &&
      !workoutNames.some(
        ({text}) =>
          text.toLowerCase().replace(/\s/g, "") ===
          workout.toLowerCase().replace(/\s/g, ""),
      )
    ) {
      setWorkoutNames([
        ...workoutNames,
        {
          id: nanoid(),
          text: workout.trim(),
          canDelete: true,
        },
      ])
      setValues({...values, workout: ""})
    }
  }

  /**
   * Handles deleted or updated workout names
   */
  function updateWorkoutNames(newText: string, workoutName: EditableName) {
    if (!newText && workoutName.canDelete && workoutNames.length > 1) {
      setWorkoutNames(workoutNames.filter(({id}) => id !== workoutName.id))
    } else if (newText && !isTextAlreadyInList(newText, workoutNames)) {
      setWorkoutNames(
        workoutNames.map(name =>
          name.id === workoutName.id ? {...name, text: newText} : name,
        ),
      )
    }
  }

  /**
   * Handles deleted or updated lift names
   */
  function updateLiftNames(newText: string, liftName: EditableName) {
    if (!newText && liftName.canDelete && liftNames.length > 1) {
      setLiftNames(liftNames.filter(({id}) => id !== liftName.id))
    } else if (newText && !isTextAlreadyInList(newText, liftNames)) {
      setLiftNames(
        liftNames.map(name =>
          name.id === liftName.id ? {...name, text: newText} : name,
        ),
      )
    }
  }
}

/**
 * Allows the user to edit and delete a lift/workout name
 */
function EditableListItem({
  editableName,
  editableNameList,
  updateOptions,
}: {
  editableName: EditableName
  editableNameList: EditableName[]
  updateOptions: (newText: string, previousValue: typeof editableName) => void
}) {
  const [newText, setNewText] = React.useState(editableName.text)
  const [editing, setEditing] = React.useState(false)

  const isDuplicate = isTextAlreadyInList(newText, editableNameList)

  return (
    <li className="mt-4 flex justify-between gap-4 leading-tight">
      {editing ? (
        <form className="w-full" {...{onSubmit}}>
          <div className="flex gap-4 items-center justify-center">
            <input autoFocus value={newText} {...{onChange, onKeyUp}} />
            <button
              aria-label="discard"
              className="hidden sm:block"
              onClick={handleReset}
              type="button"
            >
              <FontAwesomeIcon
                aria-label="cancel"
                icon={faXmarkSquare}
                size="xl"
              />
            </button>
          </div>
          {newText !== editableName.text && (
            <div className="flex justify-center mb-2">
              {isDuplicate ? (
                <p className="text-red-500 text-center mt-1">Duplicate name</p>
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
                <p className="text-red-500 text-center mt-1 text-sm">
                  Name cannot be deleted
                </p>
              )}
            </div>
          )}
        </form>
      ) : (
        <>
          <span aria-label={`Edit ${newText}`} onClick={() => setEditing(true)}>
            {newText}
          </span>
          <span className="flex gap-4 items-center justify-center flex-col sm:flex-row">
            {editableName.canDelete && (
              <FontAwesomeIcon
                aria-label="delete"
                className="hidden sm:block"
                cursor="pointer"
                icon={faTrash}
                onClick={handleDelete}
              />
            )}
            <span className="flex items-center gap-4">
              <FontAwesomeIcon
                aria-label="edit"
                cursor="pointer"
                icon={faPen}
                onClick={() => setEditing(true)}
              />
            </span>
          </span>
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
      updateOptions(newText.trim(), editableName)
    }
    setEditing(false)
  }

  /**
   * Deletes the name (if allowed)
   */
  function handleDelete() {
    if (editableName.canDelete && editableNameList.length > 1) {
      updateOptions("", editableName)
    } else {
      handleReset()
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

/**
 * Evaluates whether text exists in a list of names (case insensitive)
 */
function isTextAlreadyInList(newText: string, allNames: EditableName[]) {
  return allNames.some(
    ({text}) =>
      text.toLowerCase().replace(/\s/g, "") ===
      newText.toLowerCase().replace(/\s/g, ""),
  )
}
