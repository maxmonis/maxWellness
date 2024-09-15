import {faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Link from "next/link"
import {useRouter} from "next/router"
import {Button, IconButton} from "~/shared/components/CTA"
import {Page} from "~/shared/components/Page"
import {useAuth} from "~/shared/context/AuthContext"

/**
 * Displays text and GIFs showing how to use the app
 */
export default function InfoPage() {
  const user = useAuth()
  const router = useRouter()

  return (
    <Page title="About">
      <div className="w-full border-slate-700 xl:max-w-5xl xl:border-r">
        <div className="flex h-14 items-end border-b border-slate-700 px-4 pb-2 sm:px-6">
          <IconButton
            aria-label="go back"
            className="mr-3 grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            onClick={() => {
              if (history.length > 1) router.back()
              else router.replace(user ? "/" : "/register")
            }}
          />
          <h1 className="text-xl font-bold">About</h1>
        </div>
        <div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full flex-col items-center overflow-y-auto border-slate-700 px-4 sm:px-6 sm:text-lg md:max-h-[calc(100dvh-3.5rem)]">
          <div className="flex flex-col gap-6 pb-12 pt-6">
            <div>
              <div className="mx-auto flex max-w-prose flex-col gap-4">
                <h3 className="text-center text-lg font-bold sm:text-xl">
                  Overview
                </h3>
                <p>
                  This website allows you to create a free account using your
                  Google credentials (recommended) or an email/password
                  combination. It&apos;s a handy way to keep track of your
                  weightlifting workouts and personal bests, and can be used on
                  devices of any size. You can even install it as an application
                  on your phone for easy access at the gym!
                </p>
              </div>
            </div>
            <div>
              <div className="mx-auto flex max-w-prose flex-col gap-4">
                <h3 className="text-center text-lg font-bold sm:text-xl">
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
                  Back-to-back sets of the same exercise with the same weight
                  and reps will automatically be combined. For example,
                  2(10x100) immediately followed by 3(10x100) will become
                  5(10x100).
                </p>
                <p>
                  Personal records will be indicated with asterisks (one
                  indicates that the record has been broken, two means it&apos;s
                  still your record). These records will be automatically
                  refreshed any time you add, edit, or remove a workout.
                </p>
              </div>
            </div>
            <div>
              <div className="mx-auto flex max-w-prose flex-col gap-4">
                <h3 className="text-center text-lg font-bold sm:text-xl">
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
            <div>
              <div className="mx-auto flex max-w-prose flex-col gap-4">
                <h3 className="text-center text-lg font-bold sm:text-xl">
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
            <div>
              <div className="mx-auto flex max-w-prose flex-col gap-4">
                <h3 className="text-center text-lg font-bold sm:text-xl">
                  Tips and Tricks
                </h3>
                <p>
                  While you&apos;re entering a new workout you can click on the
                  name, date, or exercise of an existing workout to copy that
                  value. The Filters page allows you to sort or filter the
                  workouts list, and the Table page provides an alternate way to
                  view your workouts sorted by date or exercise name. If you
                  ever need help you can always return to this About page by
                  clicking the question mark icon in the navbar. That&apos;s all
                  you need to know, time to add some workouts!
                </p>
                <div className="mt-8 flex w-full justify-center">
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
