import {useSession} from "~/shared/hooks/useSession"

/**
 * Contains a greeting and instructions on managing workouts
 */
export function WorkoutsEmptyState() {
  const {data: session} = useSession()
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 sm:text-lg">
      <h2 className="text-lg font-bold sm:text-xl">
        Hi {session?.profile.userName}, welcome to maxWellness!
      </h2>
      <p>
        Use the New Workout page to add your first workout by selecting the
        name, sets, reps, and weight of each exercise. After picking a name and
        date for the workout, click the save button.
      </p>
      <p>
        Visit the Settings page if you&apos;d like to update the names
        you&apos;ll use for your exercises and routines.
      </p>
      <p>
        The About page contains helpful videos and additional tips and tricks.
      </p>
      <p>
        Your workouts will be displayed in a scrollable list and you&apos;ll be
        able to copy, edit, or delete them. Filters and a sortable table view
        will make it a snap to visualize your data.
      </p>
      <p>
        Personal bests will be marked with two asterisks (**) if they&apos;re
        unbroken, and with a single asterisk (*) if you&apos;ve subsequently
        surpassed them.
      </p>
      <p>
        While entering a new workout into the form on the left, you&apos;ll be
        able to click on existing exercises, workout names, and workout dates to
        copy them. You can drag and drop to reorder the exercises.
      </p>
      <p>Get started by entering your first workout now 💪</p>
    </div>
  )
}
