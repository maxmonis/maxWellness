import {getPrintout} from "~/features/workouts/workoutsFunctions"
import {getDateText, getLiftName} from "../functions/parsers"
import {useSession} from "../hooks/useSession"
import {UserMenu} from "./UserMenu"

/**
 * Displays the user's personal records (if any exist)
 */
export function RecordsApp() {
  const {data: session, isLoading} = useSession()
  const records =
    session?.workouts.flatMap(w => w.routine.filter(e => e.recordStartDate)) ??
    []
  return (
    <div className="h-full max-h-screen w-96 max-w-xs overflow-hidden border-l border-slate-700 p-6 max-lg:hidden xl:w-full">
      <UserMenu showName />
      <div className="h-full overflow-hidden pb-14">
        <div className="mt-8 flex h-full flex-col gap-6 overflow-y-auto rounded-lg bg-gray-100 px-6 py-4 dark:bg-gray-900">
          <h2 className="text-xl font-bold">Records</h2>
          {isLoading ? (
            <p>Loading records...</p>
          ) : records.length === 0 ? (
            <p>You haven&apos;t set any records yet</p>
          ) : (
            records.map(exercise => (
              <div key={exercise.id}>
                <p>
                  {getLiftName(
                    exercise.liftId,
                    session?.profile.liftNames ?? [],
                  )}
                  : {getPrintout(exercise)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getDateText(exercise.recordStartDate ?? "")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
