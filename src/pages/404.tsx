import { PageWithBackdrop } from "@/components/PageWithBackdrop"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function FourOhFourPage() {
	return (
		<PageWithBackdrop title="404 - Not Found">
			<p className="mb-4 text-sm">
				The requested page does not exist or has moved. If you typed the URL
				manually, please check your spelling.
			</p>
			<button
				className="mb-4"
				onClick={async () => {
					// const { docs } = await getDocs(query(collection(db, "workouts")))
					// const workouts = docs.map(doc => ({ ...doc.data(), id: doc.id }))
					// if (!isWorkoutList(workouts)) return
					// const batch = writeBatch(db)
					// for (const userId of Array.from(
					// 	new Set(workouts.map(({ userId }) => userId)),
					// )) {
					// 	const profile = await loadProfile(userId)
					// 	if (!profile) continue
					// 	for (const { id, deleted = false, text } of profile.workoutNames)
					// 		batch.set(doc(db, "users", userId, "workoutNames", id), {
					// 			deleted: deleted,
					// 			text,
					// 		})
					// 	for (const { id, deleted = false, text } of profile.exerciseNames)
					// 		batch.set(doc(db, "users", userId, "exerciseNames", id), {
					// 			deleted: deleted,
					// 			text,
					// 		})
					// }
					// for (const { date, id, exercises, userId, ...workout } of workouts)
					// 	batch.set(doc(db, "users", userId, "workouts", id), {
					// 		...workout,
					// 		date: date.split("T")[0],
					// 		exercises: exercises.map(({ nameId, ...exercise }) => ({
					// 			...exercise,
					// 			nameId: nameId,
					// 		})),
					// 	})
					// await batch.commit().catch(console.error)
				}}
			>
				Migrate Data
			</button>
			<Link
				className={cn(buttonVariants({ variant: "default" }), "w-full")}
				href="/"
				replace
			>
				Return Home
			</Link>
		</PageWithBackdrop>
	)
}
