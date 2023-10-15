import {config} from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import {ThemeProvider} from "next-themes"
import type {AppProps} from "next/app"
import {Lato} from "next/font/google"
import Head from "next/head"
import {QueryClient, QueryClientProvider} from "react-query"
import {Alerts} from "~/shared/components/Alerts"
import {AlertContextProvider} from "~/shared/context/AlertContext"
import {AuthContextProvider} from "~/shared/context/AuthContext"
import "~/shared/styles/globals.css"
import "~/shared/styles/transitions.css"

config.autoAddCss = false

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
})

const font = Lato({subsets: ["latin"], weight: ["400", "700"]})

export default function App({Component, pageProps}: AppProps) {
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
            <ThemeProvider attribute="class">
              <main className={font.className}>
                <Component {...pageProps} />
              </main>
            </ThemeProvider>
            <Alerts />
          </AuthContextProvider>
        </AlertContextProvider>
      </QueryClientProvider>
    </>
  )
}
