import Link from "next/link"

import {faGear, faHome} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import Page from "~/components/Page"
import {useAuth} from "~/context/AuthContext"

/**
 * Text and GIFs showing how to use the app
 */
export default function InfoPage() {
  const [user] = useAuth()

  return (
    <Page title="Info">
      <div className="flex justify-center bg-black border-slate-700">
        <div className="fixed top-0 left-0 w-screen bg-black">
          <div className="flex gap-6 items-center justify-between h-16 px-6 max-w-2xl mx-auto border-slate-700 border-b sm:border-x">
            <Link
              aria-label={`Go to the ${user ? "home" : "login"} page`}
              href={user ? "/" : "/login"}
            >
              <FontAwesomeIcon cursor="pointer" icon={faHome} size="xl" />
            </Link>
            {user && (
              <Link aria-label="Go to the settings page" href="/settings">
                <FontAwesomeIcon icon={faGear} cursor="pointer" size="xl" />
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col border-slate-700 pt-16 pb-20 w-screen h-screen max-w-2xl sm:border-x overflow-y-auto">
          <div className="border-slate-700 border-b px-4 py-6 sm:px-6">
            <h2 className="text-xl mb-4">Table of Contents</h2>
            <ul className="flex flex-col gap-2">
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
                  aria-label="Scroll to the Updating Workouts section"
                  className="hover:underline"
                  href="#updating-workouts"
                >
                  Updating Workouts
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
          <div className="flex flex-col gap-6 divide-y divide-slate-700 mx-4 sm:mx-6">
            <div className="flex flex-col gap-4 pt-6" id="creating-workouts">
              <h3 className="text-xl">Creating Workouts</h3>
              <p>
                To create a new workout, navigate to the home screen by clicking
                the house icon in the navbar. You can then add exercises by
                selecting their name, sets, reps, and weight. You can drag and
                drop exercises to reorder them, and clicking the x icon next to
                an exercise will delete it. When you've finished adding
                exercises, select a name and date for your workout and click
                "Save".
              </p>
              <img
                alt="GIF of a new workout being added"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230690627-0599b38c-85b7-49ea-9bd5-e8c647ff26ad.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                Each exercise must include a weight or at least one rep. This is
                because you could do 10 bodyweight squats or you could squat 315
                pounds one time, but you can't do zero reps with zero weight.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-6" id="managing-names">
              <h3 className="text-xl">Managing Names</h3>
              <p>
                To edit the names you use for your exercises and workouts,
                navigate to the settings page by clicking the gear icon in the
                navbar. You can then update the existing names and/or add new
                ones.
              </p>
              <img
                alt="GIF of exercise and workout names being updated"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230690802-aec0e203-8250-487d-9681-f08e28342681.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                Names must be unique and can be deleted unless they're currently
                included in any workout(s). Your changes will be saved when you
                navigate away from the settings page, and your workout(s) will
                be updated accordingly.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-6" id="updating-workouts">
              <h3 className="text-xl">Updating Workouts</h3>
              <p>
                To edit an existing workout, click its pencil icon. You can then
                update the name, date, and/or exercise(s). You can cancel by
                clicking the "Discard Changes" button or by clicking the pencil
                icon again. Click save when you're satisfied with your updates.
              </p>
              <img
                alt="GIF of a workout being updated"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230691111-c505c6b2-ab1b-4476-b27b-ee4d62c88288.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                The copy icon of each workout copies its name and exercises into
                the new workout, and also copies that workout's name, date, and
                exercises to your clipboard. The trash can icon allows you to
                delete a workout. It will ask you for confirmation in case you
                clicked it accidentally, but please note that once completed
                this action cannot be undone.
              </p>
              <img
                alt="GIF of a workout being copied, then deleted"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230691774-48637151-85d6-423b-9f2e-bcf94751f344.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                Personal records will be indicated with asterisks (one indicates
                that the record has been broken, two means it's still your
                record). These records will be automatically refreshed any time
                you add, edit, or remove a workout.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-6" id="tips-and-tricks">
              <h3 className="text-xl">Tips and Tricks</h3>
              <p>Click a workout's name to copy it:</p>
              <img
                alt="GIF of a workout's name being copied"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230772260-8b134ba2-8c6d-4bbc-8acb-97fd520955b6.gif"
                }
                height="100%"
                width="100%"
              />
              <p>Click a workout's date to copy it:</p>
              <img
                alt="GIF of a workout's date being copied"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230772411-fc69b061-3206-4535-bbd0-58faf2ef8981.gif"
                }
                height="100%"
                width="100%"
              />
              <p>Click an exercise's name to copy it:</p>
              <img
                alt="GIF of an exercise's name being copied"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230772556-2523a7be-04ae-4a8d-b0fd-4ca697e46def.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                Click an exercise's printout to copy its sets, reps, and weight:
              </p>
              <img
                alt="GIF of an exercise's sets, reps, and weight being copied"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230772780-16415706-a661-4f4f-bc04-ece6557a3500.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                Double click an exercise's printout to add it to the current
                workout:
              </p>
              <img
                alt="GIF of an exercise being added to the workout"
                className="border border-slate-700"
                src={
                  "https://user-images.githubusercontent.com/51540371/" +
                  "230772980-9ed89152-b06b-4950-8734-2d2a68cc4c14.gif"
                }
                height="100%"
                width="100%"
              />
              <p>
                The navbar allows you to apply filters to the workouts list
                and/or to view your workouts in a table sorted by date or
                exercise name. If you ever need help you can always return to
                this information page by clicking the "i" icon in the navbar.
                That's all you need to know, time to add some workouts!
              </p>
              <div className="flex w-full justify-center">
                <Link href={user ? "/" : "/register"}>
                  <button className="flex flex-grow justify-center px-4 py-2 border rounded text-blue-300 border-blue-300">
                    {user ? "New Workout" : "Sign Up"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
