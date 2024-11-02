import { buttonVariants } from "@/components/ui/button"
import { UserMenu } from "@/features/profile/components/UserMenu"
import { useSession } from "@/features/session/hooks/useSession"
import { cn } from "@/lib/utils"
import {
	CalendarIcon,
	GearIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	PersonIcon,
	PlusIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

/**
 * The site's main navbar, which is displayed at the bottom of
 * the screen on narrow viewports and to the left on wider ones
 */
export default function Navbar() {
	const {
		query: { view },
		route,
	} = useRouter()
	const { loading, session } = useSession()
	const hasWorkouts = Boolean(session?.workouts.length)
	const homeHref = hasWorkouts ? "/" : session ? "/?view=create" : "/login"

	return (
		<div className="flex max-h-screen items-center max-md:h-14 max-md:w-screen max-md:border-t md:min-h-screen md:w-48 md:max-w-min md:border-r">
			<div className="items-between flex h-full w-full flex-col justify-center px-2 sm:pl-6 md:h-full md:items-center md:justify-between md:overflow-y-scroll md:pr-6">
				<nav className="flex w-full items-center justify-between md:h-full md:flex-col md:items-start md:justify-start md:gap-y-2 md:pt-5">
					<div className="md:mx-auto md:mb-4">
						<Link
							className="flex w-full items-center gap-1.5 max-sm:ml-4 max-sm:p-2"
							href={homeHref}
						>
							<Image
								alt="maxWellness logo"
								className="h-6 w-6 min-w-max rounded-md border max-sm:h-8 max-sm:w-8"
								height={28}
								priority
								src="/android-chrome-192x192.png"
								width={28}
							/>
							<span className="text-lg max-sm:sr-only" translate="no">
								maxWellness
							</span>
						</Link>
					</div>
					{loading ? (
						<></>
					) : session ? (
						<>
							<div className="flex w-full flex-col gap-y-2 max-md:hidden">
								{hasWorkouts && (
									<Link
										aria-current={route === "/" && !view ? "page" : undefined}
										className={cn(
											"flex w-full gap-2 aria-[current]:underline md:justify-start md:border-none md:shadow-none",
											buttonVariants({ variant: "outline" }),
										)}
										href={homeHref}
									>
										<HomeIcon className="h-5 w-5" />
										<span className="font-bold md:w-16">Home</span>
									</Link>
								)}
								{hasWorkouts && (
									<>
										<Link
											aria-current={
												route === "/" && view === "filters" ? "page" : undefined
											}
											className={cn(
												"flex w-full gap-2 aria-[current]:underline md:justify-start md:border-none md:shadow-none",
												buttonVariants({ variant: "outline" }),
											)}
											href="/?view=filters"
										>
											<MagnifyingGlassIcon className="h-5 w-5" />
											<span className="font-bold md:w-16">Filters</span>
										</Link>
										<Link
											aria-current={
												route === "/" && view === "calendar"
													? "page"
													: undefined
											}
											className={cn(
												"flex w-full gap-2 aria-[current]:underline md:justify-start md:border-none md:shadow-none",
												buttonVariants({ variant: "outline" }),
											)}
											href="/?view=calendar"
										>
											<CalendarIcon className="h-5 w-5" />
											<span className="font-bold md:w-16">Calendar</span>
										</Link>
									</>
								)}
							</div>
							<Link
								aria-current={route === "/settings" ? "page" : undefined}
								className={cn(
									"flex w-full gap-2 max-md:max-w-min md:justify-start md:border-none md:shadow-none md:aria-[current]:underline",
									buttonVariants({ variant: "outline" }),
								)}
								href="/settings"
							>
								<GearIcon className="h-5 w-5" />
								<span className="font-bold max-xs:sr-only md:w-16">
									Settings
								</span>
							</Link>
							<Link
								aria-current={route === "/about" ? "page" : undefined}
								className={cn(
									"flex w-full gap-2 max-md:max-w-min md:justify-start md:border-none md:shadow-none md:aria-[current]:underline",
									buttonVariants({ variant: "outline" }),
								)}
								href="/about"
							>
								<QuestionMarkCircledIcon className="h-5 w-5" />
								<span className="font-bold max-xs:sr-only md:w-16">About</span>
							</Link>
							<Link
								aria-current={
									route === "/" && view === "create" ? "page" : undefined
								}
								className={cn(
									"mt-4 flex w-full justify-start gap-2 max-md:hidden",
									buttonVariants({
										variant:
											route === "/" && view === "create"
												? "outline"
												: "default",
									}),
								)}
								href="/?view=create"
							>
								<PlusIcon className="h-5 w-5" />
								<span className="font-bold md:w-16">Create</span>
							</Link>
						</>
					) : (
						<Link
							className={cn(
								"flex w-full gap-2 aria-[current]:underline max-md:max-w-min md:justify-start md:border-none md:shadow-none",
								buttonVariants({ variant: "default" }),
							)}
							href="/register"
						>
							<PersonIcon className="h-5 w-5" />
							<span className="font-bold md:w-16">Sign Up</span>
						</Link>
					)}
					<div className="mb-6 max-md:hidden" />
					<div className="mb-0 mt-auto md:w-full">
						<UserMenu />
					</div>
				</nav>
				<footer className="flex w-full flex-col items-center justify-end gap-4 whitespace-nowrap pb-2 text-center text-sm max-md:hidden md:mt-2">
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
