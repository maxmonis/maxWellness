import { BackButton } from "@/components/BackButton"

/**
 * Displays a loading skeleton for the /settings route
 */
export function SettingsLoader() {
	return (
		<div className="min-h-screen lg:max-w-3xl lg:border-r">
			<div className="flex h-14 items-center justify-between border-b px-4 pt-1 sm:px-6">
				<div className="flex items-center">
					<BackButton />
					<h1 className="text-lg">Settings</h1>
				</div>
			</div>
			<div className="flex w-full flex-grow justify-center">
				<div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full justify-center border-t md:max-h-[calc(100dvh-3.5rem)]">
					<span
						aria-busy="true"
						className="mt-20 h-20 w-20 animate-spin rounded-full border-4 border-r-transparent"
					/>
				</div>
			</div>
		</div>
	)
}
