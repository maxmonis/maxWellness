import {NextPageContext} from "next"
import Link from "next/link"
import {Button} from "~/shared/components/CTA"
import {useAuth} from "~/shared/context/AuthContext"

export default function ErrorPage({
  message,
  statusCode,
}: {
  message?: string
  statusCode?: number
}) {
  const user = useAuth()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-xl font-bold">
        Error{statusCode && `: ${statusCode}`}
      </h1>
      <p>{message ?? "Something went wrong in an unexpected way"}</p>
      <Link href={user ? "/" : "/login"}>
        <Button className="flex-grow" variant="primary">
          {user ? "Return home" : "Log in"}
        </Button>
      </Link>
    </div>
  )
}

ErrorPage.getInitialProps = ({res, err}: NextPageContext) => {
  return {message: err?.message, statusCode: res?.statusCode ?? err?.statusCode}
}
