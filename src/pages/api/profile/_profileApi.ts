import {NextApiRequest, NextApiResponse} from "next"

import {getUserProfile, getUserWorkouts, updateProfile} from "~/firebase/server"
import {Profile, Workout} from "~/resources/models"
import {extractErrorMessage} from "~/utils/parsers"
import {isProfile} from "~/utils/validators"

/**
 * Handles requests to update the user's profile
 */
export default async function profileApi(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const payload: unknown = req.body && JSON.parse(req.body)

  switch (req.method) {
    case "PUT": {
      if (!isProfile(payload)) {
        return res.status(422).json("Invalid profile payload")
      }

      const {userId} = payload

      try {
        const [profile, workouts]: [
          Profile | undefined,
          Workout[] | undefined,
        ] = await Promise.all([getUserProfile(userId), getUserWorkouts(userId)])

        if (!profile || !workouts) {
          return res.status(404).json(`No profile found for user ID: ${userId}`)
        }

        const updatedLiftNames = payload.liftNames
        const updatedWorkoutNames = payload.workoutNames

        const liftIds = new Set<string>()
        const nameIds = new Set<string>()

        for (const {nameId, routine} of workouts) {
          nameIds.add(nameId)
          for (const {liftId} of routine) {
            liftIds.add(liftId)
          }
        }

        for (const liftId of Array.from(liftIds)) {
          if (!updatedLiftNames.some(({id}) => id === liftId)) {
            const liftName = profile.liftNames.find(({id}) => id === liftId)
            if (
              liftName &&
              !updatedLiftNames.some(({text}) => text === liftName.text)
            ) {
              updatedLiftNames.push(liftName)
            }
          }
        }
        for (const nameId of Array.from(nameIds)) {
          if (!updatedWorkoutNames.some(({id}) => id === nameId)) {
            const workoutName = profile.workoutNames.find(
              ({id}) => id === nameId,
            )
            if (
              workoutName &&
              !updatedWorkoutNames.some(({text}) => text === workoutName.text)
            ) {
              updatedWorkoutNames.push(workoutName)
            }
          }
        }

        await updateProfile({
          ...payload,
          liftNames: updatedLiftNames,
          workoutNames: updatedWorkoutNames,
        })

        return res.status(200).json("Profile updated in database")
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    default: {
      return res.status(405).json(`${req.method} not allowed in profileApi`)
    }
  }
}
