import os from 'os'

const maxThreads = os.cpus().length

let getId = 0n

interface Context<T, K> {
  id: BigInt
  value: T
  onResult(id: BigInt, value: K): void
  onError(error: any): void
}

export class PromisePool<T, K> {
  private current = new Set<BigInt>()
  private data: Context<T, K>[] = []

  constructor(private producer: (value: T) => Promise<K>) {}

  async run(data: T[]): Promise<K[]> {
    const result = new Map<BigInt, K>()

    return new Promise((resolve, reject) => {
      const onResult = (id: BigInt, value: K) => {
        result.set(id, value)

        if (result.size === data.length) {
          resolve(mapping.map(m => result.get(m.id)!))
        }
      }
      const onError = (error: string) => {
        this.removeData(mapping.map(m => m.id))
        reject(error)
      }
      const mapping: Context<T, K>[] = data.map(value => ({ value, id: getId++, onResult, onError }))

      this.data.push(...mapping)
      this.checkAndExecute()
    })
  }

  async execute(item: Context<T, K>) {
    this.current.add(item.id)

    try {
      const value = await this.producer(item.value)

      item.onResult(item.id, value)
    } catch (error: any) {
      item.onError(error)
    } finally {
      this.current.delete(item.id)
    }

    this.checkAndExecute()
  }

  async checkAndExecute() {
    while (this.current.size < maxThreads && this.data.length > 0) {
      this.execute(this.data.pop()!)
    }
  }

  removeData(id: BigInt | BigInt[]) {
    if (Array.isArray(id)) {
      const ids = new Set(id)
      this.data = this.data.filter(value => !ids.has(value.id))
    } else {
      this.data = this.data.filter(value => value.id !== id)
    }
  }
}
