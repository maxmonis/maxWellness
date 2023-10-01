import {NextApiRequest, NextApiResponse} from "next"
import {deleteWorkout, saveWorkout, updateWorkout} from "~/firebase/server"
import {extractErrorMessage} from "~/shared/functions/parsers"
import {
  hasChars,
  isUnsavedWorkout,
  isWorkout,
} from "~/shared/functions/validators"

/**
 * Handles requests to add, update, or remove a workout
 */
export default async function workoutsApi(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const payload: unknown = req.body && JSON.parse(req.body)
  const {workoutId} = req.query

  switch (req.method) {
    case "POST": {
      try {
        if (isWorkout(payload)) {
          return res.status(400).json("Workout has already been saved")
        }
        if (!isUnsavedWorkout(payload)) {
          return res.status(422).json("Invalid workout payload")
        }
        await saveWorkout(payload)
        return res.status(200).json("Workout saved to database")
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    case "PUT": {
      try {
        if (!isWorkout(payload)) {
          return res.status(422).json("Invalid workout payload")
        }
        await updateWorkout(payload)
        return res.status(200).json("Workout updated in database")
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    case "DELETE": {
      if (!hasChars(workoutId)) {
        return res.status(400).json("workoutId is required")
      }
      try {
        await deleteWorkout(workoutId)
        return res.status(200).json("Workout deleted from database")
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    default: {
      return res.status(405).json(`${req.method} not allowed in workoutsApi`)
    }
  }
}
