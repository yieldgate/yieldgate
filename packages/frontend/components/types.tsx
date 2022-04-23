interface LockedPost {
  id: number
  locked: true
  title: string
  timestamp: number
}

interface UnlockedPost {
  id: number
  locked: false
  title: string
  timestamp: number
  body: string
}

export type Post = LockedPost | UnlockedPost
