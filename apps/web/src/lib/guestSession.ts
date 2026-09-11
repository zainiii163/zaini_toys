const KEY = 'guest_session_id'

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(KEY, id)
    return id
  } catch {
    return `guest-${Date.now()}`
  }
}

export function clearSessionId(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}