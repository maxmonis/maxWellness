export default class LocalStorage<T> {
  private readonly key: string
  constructor(key: string) {
    this.key = `max-wellness_${key}`
  }

  get(): T | null {
    const item = localStorage.getItem(this.key)
    return item ? JSON.parse(item) : null
  }

  remove() {
    localStorage.removeItem(this.key)
  }

  set(item: T) {
    localStorage.setItem(this.key, JSON.stringify(item))
  }
}
