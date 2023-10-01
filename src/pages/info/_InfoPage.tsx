import {faHome} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import {Button, IconButton, UserMenu} from "~/shared/components/CTA"
import Page from "~/shared/components/Page"
import {useAuth} from "~/shared/context/AuthContext"

/**
 * Text and GIFs showing how to use the app
 */
export default function InfoPage() {
  const user = useAuth()

  return (
    <Page title="Info">
      <div className="flex max-h-screen flex-col items-center overflow-hidden border-slate-700">
        <div className="w-screen border-b border-slate-700">
          <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 px-6">
            <IconButton
              aria-label={`Go to the ${user ? "home" : "login"} page`}
              href={user ? "/" : "/login"}
              icon={
                <FontAwesomeIcon cursor="pointer" icon={faHome} size="xl" />
              }
              text="Home"
              textClass="max-sm:sr-only"
            />
            <UserMenu />
          </div>
        </div>
        <div className="flex w-screen max-w-screen-md flex-col overflow-y-auto border-slate-700 pb-10">
          <div className="border-b border-slate-700 px-4 py-6 text-center sm:px-6">
            <h2 className="mb-4 text-xl">Table of Contents</h2>
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
          <div className="mx-4 flex flex-col gap-6 divide-y divide-slate-700 sm:mx-6">
            <div id="creating-workouts">
              <div className="mx-auto flex max-w-sm flex-col gap-4 pt-6">
                <h3 className="text-center text-xl">Creating Workouts</h3>
                <p>
                  To create a new workout, navigate to the home screen by
                  clicking the house icon in the navbar. You can then add
                  exercises by selecting their name, sets, reps, and weight. You
                  can drag and drop exercises to reorder them, and clicking the
                  x icon next to an exercise will delete it. When you&apos;ve
                  finished adding exercises, select a name and date for your
                  workout and click &quot;Save&quot;.
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of a new workout being added"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230690627-0599b38c-85b7-49ea-9bd5-e8c647ff26ad.gif"
                    }
                  />
                </div>
                <p>
                  Each exercise must include a weight or at least one rep. This
                  is because you could do 10 bodyweight squats or you could
                  squat 315 pounds one time, but you can&apos;t do zero reps
                  with zero weight.
                </p>
              </div>
            </div>
            <div id="managing-names">
              <div className="mx-auto flex max-w-sm flex-col gap-4 pt-6">
                <h3 className="text-center text-xl">Managing Names</h3>
                <p>
                  To edit the names you use for your exercises and workouts,
                  navigate to the settings page by clicking the gear icon in the
                  navbar. You can then update the existing names and/or add new
                  ones.
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of exercise and workout names being updated"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230690802-aec0e203-8250-487d-9681-f08e28342681.gif"
                    }
                  />
                </div>
                <p>
                  Names must be unique and can be deleted unless they&apos;re
                  currently included in any workout(s). Your changes will be
                  saved when you navigate away from the settings page, and your
                  workout(s) will be updated accordingly.
                </p>
              </div>
            </div>
            <div id="updating-workouts">
              <div className="mx-auto flex max-w-sm flex-col gap-4 pt-6">
                <h3 className="text-center text-xl">Updating Workouts</h3>
                <p>
                  To edit an existing workout, click its pencil icon. You can
                  then update the name, date, and/or exercise(s). You can cancel
                  by clicking the &quot;Discard Changes&quot; button or by
                  clicking the pencil icon again. Click save when you&apos;re
                  satisfied with your updates.
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of a workout being updated"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230691111-c505c6b2-ab1b-4476-b27b-ee4d62c88288.gif"
                    }
                  />
                </div>
                <p>
                  The copy icon of each workout copies its name and exercises
                  into the new workout, and also copies that workout&apos;s
                  name, date, and exercises to your clipboard. The trash can
                  icon allows you to delete a workout. It will ask you for
                  confirmation in case you clicked it accidentally, but please
                  note that once completed this action cannot be undone.
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of a workout being copied, then deleted"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230691774-48637151-85d6-423b-9f2e-bcf94751f344.gif"
                    }
                  />
                </div>
                <p>
                  Personal records will be indicated with asterisks (one
                  indicates that the record has been broken, two means it&apos;s
                  still your record). These records will be automatically
                  refreshed any time you add, edit, or remove a workout.
                </p>
              </div>
            </div>
            <div id="tips-and-tricks">
              <div className="mx-auto flex max-w-sm flex-col gap-4 pt-6">
                <h3 className="text-center text-xl">Tips and Tricks</h3>
                <p>Click a workout&apos;s name to copy it:</p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of a workout's name being copied"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230772260-8b134ba2-8c6d-4bbc-8acb-97fd520955b6.gif"
                    }
                  />
                </div>
                <p>Click a workout&apos;s date to copy it:</p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of a workout's date being copied"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230772411-fc69b061-3206-4535-bbd0-58faf2ef8981.gif"
                    }
                  />
                </div>
                <p>Click an exercise&apos;s name to copy it:</p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of an exercise's name being copied"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230772556-2523a7be-04ae-4a8d-b0fd-4ca697e46def.gif"
                    }
                  />
                </div>
                <p>
                  Click an exercise&apos;s printout to copy its sets, reps, and
                  weight:
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of an exercise's sets, reps, and weight being copied"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230772780-16415706-a661-4f4f-bc04-ece6557a3500.gif"
                    }
                  />
                </div>
                <p>
                  Double click an exercise&apos;s printout to add it to the
                  current workout:
                </p>
                <div className="relative h-96">
                  <Image
                    alt="GIF of an exercise being added to the workout"
                    className="object-contain"
                    fill
                    src={
                      "https://user-images.githubusercontent.com/51540371/" +
                      "230772980-9ed89152-b06b-4950-8734-2d2a68cc4c14.gif"
                    }
                  />
                </div>
                <p>
                  The navbar allows you to apply filters to the workouts list
                  and/or to view your workouts in a table sorted by date or
                  exercise name. If you ever need help you can always return to
                  this information page by clicking the &quot;i&quot; icon in
                  the navbar. That&apos;s all you need to know, time to add some
                  workouts!
                </p>
                <div className="flex w-full justify-center">
                  <Link href={user ? "/" : "/register"}>
                    <Button className="flex-grow" variant="primary">
                      {user ? "New Workout" : "Sign Up"}
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
