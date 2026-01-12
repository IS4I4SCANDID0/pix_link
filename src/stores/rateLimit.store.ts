import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRateLimitStore = defineStore(
  'rateLimit',
  () => {
    // ========== CONFIGURAÇÃO ==========
    const maxAttempts = ref(3)
    const windowMs = ref(60000) // 60 segundos
    const blockDurationMs = ref(60000) // 60 segundos de bloqueio

    // ========== ESTADO ==========
    const attempts = ref<number[]>([])
    const isBlocked = ref(false)
    const blockedUntil = ref<number | null>(null)
    const cooldownTime = ref(0)

    let countdownInterval: number | null = null

    // ========== COMPUTED ==========
    const remainingAttempts = computed(() => {
      const now = Date.now()
      const recentAttempts = attempts.value.filter((timestamp) => now - timestamp < windowMs.value)
      return Math.max(0, maxAttempts.value - recentAttempts.length)
    })

    // ========== ACTIONS ==========
    const cleanOldAttempts = () => {
      const now = Date.now()
      attempts.value = attempts.value.filter((timestamp) => now - timestamp < windowMs.value)
    }

    const startCountdown = () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }

      const updateCooldown = () => {
        if (!blockedUntil.value) {
          cooldownTime.value = 0
          if (countdownInterval) clearInterval(countdownInterval)
          return
        }

        const remaining = Math.ceil((blockedUntil.value - Date.now()) / 1000)

        if (remaining <= 0) {
          cooldownTime.value = 0
          isBlocked.value = false
          blockedUntil.value = null
          if (countdownInterval) clearInterval(countdownInterval)
          countdownInterval = null
        } else {
          cooldownTime.value = remaining
        }
      }

      updateCooldown()
      countdownInterval = window.setInterval(updateCooldown, 1000)
    }

    const canProceed = (action: string = 'default'): { allowed: boolean; timeToWait: number } => {
      const now = Date.now()

      // Verificar se está bloqueado
      if (isBlocked.value && blockedUntil.value) {
        if (now < blockedUntil.value) {
          const timeToWait = Math.ceil((blockedUntil.value - now) / 1000)
          return { allowed: false, timeToWait }
        } else {
          // Desbloqueou
          isBlocked.value = false
          blockedUntil.value = null
          cooldownTime.value = 0
          if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
          }
        }
      }

      // Limpar tentativas antigas
      cleanOldAttempts()

      // Verificar se excedeu o limite
      if (attempts.value.length >= maxAttempts.value) {
        isBlocked.value = true
        blockedUntil.value = now + blockDurationMs.value
        startCountdown()

        const timeToWait = Math.ceil(blockDurationMs.value / 1000)
        return { allowed: false, timeToWait }
      }

      // Registrar nova tentativa
      attempts.value.push(now)

      return { allowed: true, timeToWait: 0 }
    }

    const reset = () => {
      attempts.value = []
      isBlocked.value = false
      blockedUntil.value = null
      cooldownTime.value = 0
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }

    const configure = (newMaxAttempts: number, newWindowMs: number) => {
      maxAttempts.value = newMaxAttempts
      windowMs.value = newWindowMs
    }

    // ========== INICIALIZAÇÃO ==========
    // Verificar se havia bloqueio ao carregar
    if (isBlocked.value && blockedUntil.value) {
      const now = Date.now()
      if (now < blockedUntil.value) {
        startCountdown()
      } else {
        isBlocked.value = false
        blockedUntil.value = null
        cooldownTime.value = 0
      }
    }

    return {
      // Estado
      attempts,
      isBlocked,
      blockedUntil,
      cooldownTime,
      maxAttempts,
      windowMs,

      // Computed
      remainingAttempts,

      // Actions
      canProceed,
      reset,
      configure,
      startCountdown,
    }
  },
  {
    // ========== PERSISTÊNCIA ==========
    persist: {
      key: 'rateLimit',
      storage: localStorage,
      pick: ['attempts', 'isBlocked', 'blockedUntil', 'cooldownTime'],
    },
  },
)
