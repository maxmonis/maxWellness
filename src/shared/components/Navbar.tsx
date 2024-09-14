import {
  faCirclePlus,
  faFilter,
  faGear,
  faHome,
  faQuestionCircle,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Image from "next/image"
import {useSession} from "../hooks/useSession"
import {IconButton} from "./CTA"
import {UserMenu} from "./UserMenu"

/**
 * The site's main navbar, which is displayed at the bottom of
 * the screen on narrow viewports and to the left on wider ones
 */
export default function Navbar() {
  const {data: session} = useSession()
  const hasWorkouts = Boolean(session?.workouts.length)
  const homeHref = hasWorkouts ? "/" : session ? "/?view=create" : "/login"

  return (
    <div className="flex max-h-screen items-center border-slate-700 max-md:h-14 max-md:w-screen max-md:border-t md:border-r md:pl-2">
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-4 sm:px-6 md:h-full md:justify-between md:overflow-y-scroll">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-x-6 gap-y-4 sm:py-6 md:flex-col md:items-start md:justify-start">
          <div className="md:mb-6">
            <IconButton
              href={homeHref}
              icon={
                <Image
                  alt="Logo"
                  className="h-6 w-6 min-w-max rounded-md border"
                  src="/android-chrome-192x192.png"
                  height={24}
                  width={24}
                />
              }
              text="maxWellness"
              textClass="max-sm:sr-only"
            />
          </div>
          <div className="flex flex-col gap-x-6 gap-y-4 max-md:hidden">
            <IconButton
              className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              href={homeHref}
              icon={<FontAwesomeIcon icon={faHome} size="lg" />}
              text="Home"
            />
            <IconButton
              className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              color="blue"
              href={session ? "/?view=create" : homeHref}
              icon={<FontAwesomeIcon icon={faCirclePlus} size="lg" />}
              text="Create"
            />
            {(!session || hasWorkouts) && (
              <>
                <IconButton
                  className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  href={session ? "/?view=filters" : homeHref}
                  icon={<FontAwesomeIcon icon={faFilter} size="lg" />}
                  text="Filters"
                />
                <IconButton
                  className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  href={session ? "/?view=table" : homeHref}
                  icon={<FontAwesomeIcon icon={faTable} size="lg" />}
                  text="Table"
                />
              </>
            )}
          </div>
          <IconButton
            className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 md:dark:hover:bg-gray-800"
            href={session ? "/settings" : homeHref}
            icon={<FontAwesomeIcon icon={faGear} size="lg" />}
            text="Settings"
            textClass="max-xs:sr-only"
          />
          <IconButton
            className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 md:dark:hover:bg-gray-800"
            href="/info"
            icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />}
            text="Info"
            textClass="max-xs:sr-only"
          />
          <UserMenu className="md:mt-10" />
        </div>
        <footer className="flex w-full flex-col items-center justify-end gap-4 whitespace-nowrap pb-2 text-center text-sm max-md:hidden">
          <a
            href="https://maxmonis.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            © Max Monis 2019-{new Date().getFullYear()}
          </a>
        </footer>
      </div>
    </div>
  )
}
