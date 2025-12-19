import type { Component } from 'vue'
import type { IconType } from 'vue-icons-plus'

export type TechStack = {
  techName: string
  icon: IconType | Component
  color?: string
}
