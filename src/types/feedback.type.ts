export type FeedbackType = 'error' | 'success' | 'tooltip'

export type TFeedback = {
  id: number
  text: string
  type: FeedbackType
  duration?: number
}
