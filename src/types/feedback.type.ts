import type { Ref } from 'vue'

export type FeedbackType = 'error' | 'success' | 'tooltip'

export type TFeedback = {
  id: number
  text: string
  type: FeedbackType
  duration?: number
}

export type TUseBreakpoint = {
  iconSize: Ref<number>
}
