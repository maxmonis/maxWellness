import classNames from "classnames"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"
import { useAuth } from "~/context/AuthContext"
import { RecordsApp } from "~/features/workouts/components/RecordsApp"
import { useSession } from "~/hooks/useSession"
import { extractErrorMessage } from "~/utils/parsers"
import Navbar from "./Navbar"

/**
 * Displays a page of content or its loading state,
 * also redirecting automatically if necessary when
 * a page requires the user to be logged in or out
 */
export function Page({
	children,
	component,
	error,
	Loader,
	loading,
	loadingText,
	mustBeLoggedIn,
	mustBeLoggedOut,
	props,
	title = "Fitness First",
}: {
	error?: unknown
	title?: string
} & (
	| {
			mustBeLoggedIn?: true
			mustBeLoggedOut?: never
	  }
	| {
			mustBeLoggedIn?: never
			mustBeLoggedOut?: true
	  }
) &
	(
		| { Loader?: never; loading: boolean; loadingText?: string }
		| { Loader?: React.ElementType; loading: boolean; loadingText?: never }
		| { Loader?: never; loading?: never; loadingText?: never }
	) &
	(
		| {
				children: React.ReactNode
				component?: never
				props?: never
		  }
		| {
				children?: never
				component: React.ElementType
				props?: object
		  }
		| {
				children?: never
				component?: never
				props?: never
		  }
	)) {
	const user = useAuth()
	const router = useRouter()
	useSession()

	const [redirect, setRedirect] = React.useState(false)

	React.useEffect(() => {
		if (user && mustBeLoggedOut) {
			handleRedirect("/")
		} else if (!user && mustBeLoggedIn) {
			handleRedirect("/login")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const element = props && React.createElement(component, props)

	return (
		<>
			<Head>
				<title>{`maxWellness | ${title}`}</title>
			</Head>
			{redirect ? null : (
				<div className="relative overflow-hidden">
					<div
						className={classNames(
							"min-w-screen flex h-screen flex-col justify-between overflow-auto",
							!mustBeLoggedOut &&
								"bg-white text-gray-900 dark:bg-black dark:text-white",
						)}
					>
						<div className="mx-auto flex w-screen max-w-7xl flex-col justify-between md:flex-row-reverse md:justify-end">
							{router.pathname === "/" && router.query.view !== "table" && (
								<RecordsApp />
							)}
							<div
								className={classNames(
									"w-full",
									mustBeLoggedOut
										? "max-h-screen"
										: "max-h-[calc(100dvh-3.5rem)] md:max-h-screen",
								)}
							>
								{children ??
									element ??
									(loading && Loader ? (
										<Loader />
									) : (
										<p className="p-6 text-lg">
											{loading
												? loadingText ?? "Loading..."
												: error
												? extractErrorMessage(error)
												: null}
										</p>
									))}
							</div>
							{mustBeLoggedOut ? <Wallpaper /> : <Navbar />}
						</div>
						<footer
							className={
								mustBeLoggedOut ? "text-white" : "border-slate-700 md:hidden"
							}
						>
							<div className="flex w-full flex-col items-center justify-end gap-4 pb-2 text-center text-sm max-md:py-6 md:h-14">
								<a
									href="https://maxmonis.com/"
									rel="noopener noreferrer"
									target="_blank"
								>
									© Max Monis 2019-{new Date().getFullYear()}
								</a>
							</div>
						</footer>
					</div>
				</div>
			)}
		</>
	)

	/**
	 * Redirects to the route it receives
	 */
	function handleRedirect(route: `/${string}`) {
		setRedirect(true)
		router.replace(route)
	}
}

/**
 * Background image for select pages
 */
function Wallpaper() {
	const [error, setError] = React.useState(false)

	return error ? (
		<></>
	) : (
		<div className="fixed left-0 top-0 -z-10">
			<div className="relative h-screen w-screen">
				<Image
					alt={
						"Barbell on the Floor by Leon Ardho from Pexels: " +
						"https://www.pexels.com/photo/barbell-on-the-floor-1552252/"
					}
					className="object-cover"
					fill
					onError={() => setError(true)}
					priority
					src="/barbell.jpg"
				/>
			</div>
		</div>
	)
}
