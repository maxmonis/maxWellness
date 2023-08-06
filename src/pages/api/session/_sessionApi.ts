import {NextApiRequest, NextApiResponse} from "next"

import {getUserProfile, getUserWorkouts} from "~/firebase/server"
import {Profile, Workout} from "~/resources/models"
import {extractErrorMessage} from "~/utils/parsers"
import {generateSession} from "~/utils/session"
import {hasChars} from "~/utils/validators"

/**
 * Handles requests to load the current session
 */
export default async function sessionApi(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {userId} = req.query

  switch (req.method) {
    case "GET": {
      if (!hasChars(userId)) {
        return res.status(400).json("Missing required field: userId")
      }

      try {
        const [profile, workouts]: [
          Profile | undefined,
          Workout[] | undefined,
        ] = await Promise.all([getUserProfile(userId), getUserWorkouts(userId)])

        if (!profile || !workouts) {
          return res.status(404).json(`No session found for user ID: ${userId}`)
        }

        const session = generateSession(profile, workouts)
        return res.json(session)
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    default: {
      return res.status(405).json(`${req.method} not allowed in sessionApi`)
    }
  }
}
