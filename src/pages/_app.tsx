import { Alerts } from "@/components/Alerts"
import { Toaster } from "@/components/ui/toaster"
import { AlertContextProvider } from "@/context/AlertContext"
import { AuthContextProvider } from "@/context/AuthContext"
import "@/styles/globals.css"
import "@/styles/transitions.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import { Lato } from "next/font/google"
import Head from "next/head"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 1000 * 60 * 5,
		},
	},
})

const font = Lato({ subsets: ["latin"], weight: ["400", "700"] })

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="description" content="Workout tracker" />
				<meta name="theme-color" content="#000000" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<QueryClientProvider client={queryClient}>
				<AlertContextProvider>
					<AuthContextProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<main className={font.className}>
								<Component {...pageProps} />
								<Toaster />
							</main>
						</ThemeProvider>
						<Alerts />
					</AuthContextProvider>
				</AlertContextProvider>
			</QueryClientProvider>
		</>
	)
}
