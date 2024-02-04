import {
  faCirclePlus,
  faFilter,
  faGear,
  faHome,
  faQuestionCircle,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import Image from "next/image"
import {useSession} from "../hooks/useSession"
import {IconButton} from "./CTA"
import {UserMenu} from "./UserMenu"

/**
 * The site's main navbar, which is displayed at the bottom of
 * the screen on narrow viewports and to the left on wider ones
 */
export default function Navbar() {
  const {data: session = {workouts: []}} = useSession()
  const hasWorkouts = session.workouts.length > 0
  const homeHref = hasWorkouts ? "/" : "/?view=create"

  return (
    <div className="flex max-h-screen items-center border-slate-700 max-md:h-14 max-md:w-screen max-md:border-t md:border-r md:pl-2">
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-4 md:h-full md:justify-between md:overflow-y-scroll">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-x-6 gap-y-4 md:flex-col md:items-start md:justify-start md:py-6">
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
              className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 dark:md:hover:bg-gray-800"
              href={homeHref}
              icon={<FontAwesomeIcon icon={faHome} size="lg" />}
              text="Home"
            />
            <IconButton
              className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 dark:md:hover:bg-gray-800"
              color="blue"
              href="/?view=create"
              icon={<FontAwesomeIcon icon={faCirclePlus} size="lg" />}
              text="Create"
            />
            <IconButton
              className={classNames(
                "rounded-full md:-ml-3 md:px-3 md:py-2",
                hasWorkouts && "md:hover:bg-gray-100 dark:md:hover:bg-gray-800",
              )}
              disabled={!hasWorkouts}
              href={hasWorkouts ? "/?view=filters" : undefined}
              icon={<FontAwesomeIcon icon={faFilter} size="lg" />}
              text="Filters"
            />
            <IconButton
              className={classNames(
                "rounded-full md:-ml-3 md:px-3 md:py-2",
                hasWorkouts && "md:hover:bg-gray-100 dark:md:hover:bg-gray-800",
              )}
              disabled={!hasWorkouts}
              href={hasWorkouts ? "/?view=table" : undefined}
              icon={<FontAwesomeIcon icon={faTable} size="lg" />}
              text="Table"
            />
          </div>
          <IconButton
            className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 dark:md:hover:bg-gray-800"
            href="/settings"
            icon={<FontAwesomeIcon icon={faGear} size="lg" />}
            text="Settings"
            textClass="max-xs:sr-only"
          />
          <IconButton
            className="rounded-full md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 dark:md:hover:bg-gray-800"
            href="/info"
            icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />}
            text="Info"
            textClass="max-xs:sr-only"
          />
          <UserMenu className="md:mt-10 lg:hidden" />
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
