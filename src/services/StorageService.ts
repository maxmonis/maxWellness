import { Workout } from "@/features/workouts/utils/models"

export class StorageService<
	K extends `exercises_${string}`,
	T extends Workout["exercises"],
> {
	private readonly key: string
	constructor(key: K) {
		this.key = `max-wellness_${key}`
	}

	get(): T | null {
		const item = localStorage.getItem(this.key)
		return item ? JSON.parse(item) : null
	}

	set(item: T) {
		localStorage.setItem(this.key, JSON.stringify(item))
	}

	remove() {
		localStorage.removeItem(this.key)
	}
}
