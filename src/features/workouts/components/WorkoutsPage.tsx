import {Page} from "~/shared/components/Page"
import {useSession} from "~/shared/hooks/useSession"
import {WorkoutsApp} from "./WorkoutsApp"
import {WorkoutsLoader} from "./WorkoutsLoader"

/**
 * Landing page which allows user to view and manage workouts
 */
export default function WorkoutsPage() {
  const {data, isLoading, error} = useSession()

  return (
    <Page
      component={WorkoutsApp}
      Loader={WorkoutsLoader}
      loading={isLoading}
      mustBeLoggedIn
      props={data}
      title="Workouts"
      {...{error}}
    />
  )
}
