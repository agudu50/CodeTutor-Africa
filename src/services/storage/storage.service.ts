export interface IStorageService {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

export class LocalStorageAdapter implements IStorageService {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key)
      if (!data) return null
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable', e)
    }
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }
}

export const storageService: IStorageService = new LocalStorageAdapter()
