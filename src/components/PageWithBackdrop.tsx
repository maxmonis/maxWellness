import Head from "next/head"
import Image from "next/image"
import * as React from "react"

export function PageWithBackdrop({
	children,
	title,
}: React.PropsWithChildren<{ title: string }>) {
	return (
		<>
			<Head>
				<title>{`maxWellness | ${title}`}</title>
			</Head>
			<div className="dark fixed left-0 top-0 -z-10 bg-[url('/barbell.jpg')] bg-cover bg-[30%] bg-no-repeat object-cover">
				<div className="relative h-screen w-screen overflow-auto px-4 pb-2 pt-10">
					<div className="flex h-full flex-col items-center justify-between gap-20">
						<div className="w-full max-w-xs rounded-lg border bg-background px-4 pb-6 pt-4 text-foreground sm:px-6">
							<div>
								<div className="mb-4 flex w-full justify-center">
									<span className="flex items-center gap-2 text-lg">
										<Image
											alt="maxWellness logo"
											className="h-6 w-6"
											height={24}
											src="/android-chrome-192x192.png"
											width={24}
										/>
										maxWellness
									</span>
								</div>
								<h1 className="mb-2 font-bold">{title}</h1>
							</div>
							{children}
						</div>
						<a
							className="text-sm text-foreground"
							href="https://maxmonis.com"
							rel="noreferrer"
							target="_blank"
						>
							© Max Monis 2019-{new Date().getFullYear()}
						</a>
					</div>
				</div>
			</div>
		</>
	)
}
