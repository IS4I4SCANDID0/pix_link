// src/stores/rateLimit.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRateLimitStore = defineStore('rateLimit', () => {
  const attempts = ref<number[]>([])
  const maxAttempts = ref(3)
  const windowMs = ref(60000) // 60 segundos
  const isBlocked = ref(false)
  const blockedUntil = ref(0)

  // Variável para forçar recálculo do computed
  const forceUpdate = ref(0)

  // Interval para atualização
  let updateInterval: ReturnType<typeof setInterval> | null = null

  const cooldownTime = computed(() => {
    // Lê forceUpdate para criar dependência reativa (truque para forçar recálculo)
    forceUpdate.value

    if (!isBlocked.value || blockedUntil.value === 0) {
      return 0
    }

    const now = Date.now()
    const remaining = Math.ceil((blockedUntil.value - now) / 1000)

    if (remaining <= 0) {
      // Tempo acabou, desbloqueia
      isBlocked.value = false
      blockedUntil.value = 0
      attempts.value = []
      stopUpdateInterval()
      return 0
    }

    return remaining
  })

  const startUpdateInterval = () => {
    if (updateInterval) return

    updateInterval = setInterval(() => {
      // Incrementa forceUpdate para forçar recálculo do computed
      forceUpdate.value++

      // Verifica se deve parar o interval
      if (!isBlocked.value || Date.now() >= blockedUntil.value) {
        stopUpdateInterval()
      }
    }, 1000) // Atualiza a cada segundo
  }

  const stopUpdateInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  const canProceed = (_action: string = 'default'): { allowed: boolean; timeToWait: number } => {
    const now = Date.now()

    // Remove tentativas antigas
    attempts.value = attempts.value.filter((time) => now - time < windowMs.value)

    // Verifica se ainda está bloqueado
    if (isBlocked.value && now < blockedUntil.value) {
      const timeToWait = Math.ceil((blockedUntil.value - now) / 1000)
      return { allowed: false, timeToWait }
    }

    // Desbloqueia se o tempo passou
    if (isBlocked.value && now >= blockedUntil.value) {
      isBlocked.value = false
      blockedUntil.value = 0
      attempts.value = []
      stopUpdateInterval()
    }

    // Verifica se excedeu o limite
    if (attempts.value.length >= maxAttempts.value) {
      const oldestAttempt = Math.min(...attempts.value)
      const timeToWait = Math.ceil((windowMs.value - (now - oldestAttempt)) / 1000)

      isBlocked.value = true
      blockedUntil.value = now + timeToWait * 1000

      // Inicia interval para contagem regressiva
      startUpdateInterval()

      return { allowed: false, timeToWait }
    }

    // Registra nova tentativa
    attempts.value.push(now)

    return { allowed: true, timeToWait: 0 }
  }

  const reset = () => {
    attempts.value = []
    isBlocked.value = false
    blockedUntil.value = 0
    stopUpdateInterval()
  }

  const configure = (max: number, window: number) => {
    maxAttempts.value = max
    windowMs.value = window
  }

  return {
    attempts,
    maxAttempts,
    windowMs,
    isBlocked,
    blockedUntil,
    cooldownTime,
    canProceed,
    reset,
    configure,
  }
})
