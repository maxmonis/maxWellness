import { EditableName } from "@/features/settings/utils/models"
import {
	getExerciseNameText,
	getWorkoutNameText,
} from "@/features/settings/utils/parsers"
import { Exercise, Workout } from "@/features/workouts/utils/models"
import sortBy from "lodash/sortBy"

export function generateSession(
	workoutList: Array<Workout>,
	workoutNames: Array<EditableName>,
	exerciseNames: Array<EditableName>,
) {
	const exerciseNameIds = new Set<string>()
	const workoutNameIds = new Set<string>()
	const workoutDates = new Set<string>()

	const workouts = recursiveChecker(sortBy(workoutList, "date"))

	const filters = generateWorkoutsFilters({
		exerciseNameIds: Array.from(exerciseNameIds).filter(
			id => !exerciseNames.find(n => n.id === id)?.deleted,
		),
		workoutNameIds: Array.from(workoutNameIds).filter(
			id => !workoutNames.find(n => n.id === id)?.deleted,
		),
		workoutDates: Array.from(workoutDates),
	})

	return {
		filters,
		exerciseNames: sortBy(exerciseNames, ({ id }) =>
			getExerciseNameText(id, exerciseNames),
		),
		workoutNames: sortBy(workoutNames, ({ id }) =>
			getWorkoutNameText(id, workoutNames),
		),
		workouts,
	}

	function recursiveChecker(
		pendingWorkouts: Array<Workout>,
		workouts: Array<Workout> = [],
		records: Array<Exercise> = [],
	): Array<Workout> {
		if (pendingWorkouts[0]) {
			const updated = updateRecords(pendingWorkouts[0], records)
			return recursiveChecker(
				pendingWorkouts.slice(1),
				[...workouts, updated.workout],
				updated.records,
			)
		}
		return workouts.reverse()
	}

	function updateRecords(workout: Workout, records: Array<Exercise>) {
		workoutNameIds.add(workout.nameId)
		workoutDates.add(workout.date)
		for (const exercise of workout.exercises) {
			delete exercise.recordEndDate
			delete exercise.recordStartDate
			const { nameId, sets, reps, weight } = exercise
			exerciseNameIds.add(nameId)
			let newRecord = true
			for (const record of records) {
				if (!record.recordEndDate && record.nameId === nameId) {
					if (
						record.sets >= sets &&
						record.reps >= reps &&
						record.weight >= weight
					) {
						newRecord = false
						break
					} else if (
						sets >= record.sets &&
						reps >= record.reps &&
						weight >= record.weight
					) {
						record.recordEndDate = workout.date
					}
				}
			}
			if (newRecord) {
				exercise.recordStartDate = workout.date
				records.push(exercise)
			}
		}
		return { records, workout }
	}
}

function generateWorkoutsFilters({
	exerciseNameIds,
	workoutNameIds,
	workoutDates,
}: {
	exerciseNameIds: Array<string>
	workoutNameIds: Array<string>
	workoutDates: Array<string>
}) {
	return {
		exerciseNameIds: sortBy(exerciseNameIds).map(id => ({
			checked: false,
			id,
		})),
		workoutNameIds: sortBy(workoutNameIds).map(id => ({ checked: false, id })),
		newestFirst: true,
		workoutDates: {
			allDates: workoutDates,
			endDate: workoutDates[workoutDates.length - 1],
			startDate: workoutDates[0],
		},
	}
}
