import {
  faGear,
  faHome,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Image from "next/image"
import {IconButton} from "./CTA"
import {UserMenu} from "./UserMenu"

export default function Navbar() {
  return (
    <div className="flex max-h-screen items-center border-slate-700 max-md:h-14 max-md:w-screen max-md:border-t md:border-r">
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-4 sm:px-6 md:h-full md:justify-between md:overflow-y-scroll">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-6 md:flex-col md:items-start md:justify-start md:py-6 md:pr-6 xl:pr-12">
          <IconButton
            className="md:mb-6"
            href="/"
            icon={
              <Image
                alt="Logo"
                className="rounded-md border"
                src="/android-chrome-192x192.png"
                height={24}
                width={24}
              />
            }
            text="maxWellness"
            textClass="max-sm:sr-only"
          />
          <IconButton
            href="/"
            icon={<FontAwesomeIcon icon={faHome} size="lg" />}
            text="Home"
            textClass="max-sm:sr-only"
          />
          <IconButton
            href="/settings"
            icon={<FontAwesomeIcon icon={faGear} size="lg" />}
            text="Settings"
            textClass="max-sm:sr-only"
          />
          <IconButton
            href="/info"
            icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />}
            text="Info"
            textClass="max-sm:sr-only"
          />
          <UserMenu className="lg:hidden" />
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
