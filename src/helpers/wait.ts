export function wait<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), 1000))
}

export function reject(duration: number) {
  return new Promise((resolve, reject) => setTimeout(() => reject('error gayz'), duration))
}
