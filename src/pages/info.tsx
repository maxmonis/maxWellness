import Link from "next/link"
import {Button} from "~/shared/components/CTA"
import {Page} from "~/shared/components/Page"
import {useAuth} from "~/shared/context/AuthContext"

/**
 * Displays text and GIFs showing how to use the app
 */
export default function InfoPage() {
  const user = useAuth()

  return (
    <Page title="Info">
      <div className="h-full max-h-[calc(100dvh-56px)] w-full overflow-y-auto md:max-h-screen">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center border-slate-700 px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold">Information</h1>
          <div className="w-full border-y border-slate-700 py-6 text-center">
            <h2 className="mb-4 text-xl font-bold">Table of Contents</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  aria-label="Scroll to the Overview section"
                  className="hover:underline"
                  href="#overview"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Scroll to the Creating Workouts section"
                  className="hover:underline"
                  href="#creating-workouts"
                >
                  Creating Workouts
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Scroll to the Managing Names section"
                  className="hover:underline"
                  href="#managing-names"
                >
                  Managing Names
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Scroll to the Managing Workouts section"
                  className="hover:underline"
                  href="#managing-workouts"
                >
                  Managing Workouts
                </Link>
              </li>
              <li>
                <Link
                  aria-label="Scroll to the Tips and Tricks section"
                  className="hover:underline"
                  href="#tips-and-tricks"
                >
                  Tips and Tricks
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6 divide-y divide-slate-700">
            <div id="overview">
              <div className="mx-auto flex flex-col gap-4 pt-6">
                <h3 className="text-center text-xl font-bold">Overview</h3>
                <p>
                  This website allows you to create a free account using your
                  Google credentials (recommended) or an email/password
                  combination. It&apos;s a handy way to keep track of your
                  weightlifting workouts and personal bests, and can be used on
                  devices of any size. You can even install it as an application
                  on your phone for easy access at the gym.
                </p>
              </div>
            </div>
            <div id="creating-workouts">
              <div className="mx-auto flex flex-col gap-4 pt-6">
                <h3 className="text-center text-xl font-bold">
                  Creating Workouts
                </h3>
                <p>
                  To create a new workout, add exercises by selecting their
                  name, sets, reps, and weight. You can drag and drop exercises
                  to reorder them, and clicking the x icon next to an exercise
                  will delete it. When you&apos;ve finished adding exercises,
                  select a name and date for your workout and click
                  &quot;Save&quot;.
                </p>
                <p>
                  Each exercise must include a weight or at least one rep. This
                  is because you could do 10 bodyweight squats or you could
                  squat 315 pounds one time, but you can&apos;t do zero reps
                  with zero weight.
                </p>
                <p>
                  Back-to-back sets with the same weight and reps will
                  automatically be combined. For example, 2(10x100) immediately
                  followed by 3(10x100) will become 5(10x100).
                </p>
                <p>
                  Personal records will be indicated with asterisks (one
                  indicates that the record has been broken, two means it&apos;s
                  still your record). These records will be automatically
                  refreshed any time you add, edit, or remove a workout.
                </p>
              </div>
            </div>
            <div id="managing-names">
              <div className="mx-auto flex flex-col gap-4 pt-6">
                <h3 className="text-center text-xl font-bold">
                  Managing Names
                </h3>
                <p>
                  The Settings page allows you to add, update, or delete the
                  names you use for workouts and exercises. Names must be unique
                  and can be deleted unless they&apos;re currently included in
                  any workout(s). You have the option of hiding names which you
                  no longer use, which will cause them to no longer appear in
                  Filters and the New/Edit Workout forms.
                </p>
              </div>
            </div>
            <div id="managing-workouts">
              <div className="mx-auto flex flex-col gap-4 pt-6">
                <h3 className="text-center text-xl font-bold">
                  Managing Workouts
                </h3>
                <p>
                  The ellipsis icon to the right of each workout in the list
                  allows you to duplicate it, copy it to clipboard, edit it, or
                  delete it. Please note that edits and deletions cannot be
                  undone once confirmed.
                </p>
              </div>
            </div>
            <div id="tips-and-tricks">
              <div className="mx-auto flex flex-col gap-4 pt-6">
                <h3 className="text-center text-xl font-bold">
                  Tips and Tricks
                </h3>
                <p>
                  While you&apos;re entering a new workout you can click on the
                  name, date, or exercise of an existing workout to copy that
                  value. The Filters page allows you to to sort or filter the
                  workouts list, and the Table page provides an alternate way to
                  view your workouts sorted by date or exercise name. If you
                  ever need help you can always return to this information page
                  by clicking the question mark icon in the navbar. That&apos;s
                  all you need to know, time to add some workouts!
                </p>
                <div className="my-8 flex w-full justify-center">
                  <Link href={user ? "/" : "/register"}>
                    <Button className="flex-grow" variant="primary">
                      {user ? "My Workouts" : "Sign Up"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
