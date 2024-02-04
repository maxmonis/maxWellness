import {useSession} from "~/shared/hooks/useSession"

/**
 * Contains a greeting and instructions on managing workouts
 */
export function WorkoutsEmptyState() {
  const {data: session} = useSession()
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h2 className="text-lg font-bold">
        Hi {session?.profile.userName}, welcome to maxWellness!
      </h2>
      <p>
        Once you&apos;ve saved workouts, they will be displayed here.
        You&apos;ll be able to filter them or view their exercises in a table,
        and they can be copied, edited, or deleted.
      </p>
      <p>
        Personal records will be marked with two asterisks (**) if they&apos;re
        unbroken, and with a single asterisk (*) if you&apos;ve subsequently
        surpassed them.
      </p>
      <p>
        While entering a new workout into the form on the left, you&apos;ll be
        able to click on existing exercises, workout names, and workout dates to
        copy them.
      </p>
      <p>
        You can always visit the settings page if you&apos;d like to update the
        names you&apos;ll use for your exercises and routines. The info page
        contains examples and additional tips and tricks.
      </p>
      <p>Get started by entering your first workout now 💪</p>
    </div>
  )
}
