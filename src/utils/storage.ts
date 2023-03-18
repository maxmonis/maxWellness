enum Key {
  routine = "wip-routine",
}

class LocalStorage {
  private readonly baseKey: string

  constructor(baseKey: Key) {
    this.baseKey = `max-wellness_${baseKey}`
  }

  get<T>(extraKey = ""): T | null {
    const item = localStorage.getItem(this.getKey(extraKey))
    return item ? JSON.parse(item) : null
  }

  remove(extraKey = "") {
    localStorage.removeItem(this.getKey(extraKey))
  }

  set<T>(item: T, extraKey = "") {
    localStorage.setItem(this.getKey(extraKey), JSON.stringify(item))
  }

  protected getKey(extraKey: string) {
    return [this.baseKey, extraKey].join("_")
  }
}

export const localRoutine = new LocalStorage(Key.routine)
