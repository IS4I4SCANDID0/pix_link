import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRateLimitStore } from '../rateLimit.store'

describe('Rate Limit Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('deve permitir até 3 tentativas', () => {
    const store = useRateLimitStore()

    const attempt1 = store.canProceed('test')
    const attempt2 = store.canProceed('test')
    const attempt3 = store.canProceed('test')

    expect(attempt1.allowed).toBe(true)
    expect(attempt2.allowed).toBe(true)
    expect(attempt3.allowed).toBe(true)
  })

  it('deve bloquear 4ª tentativa', () => {
    const store = useRateLimitStore()

    store.canProceed('test')
    store.canProceed('test')
    store.canProceed('test')

    const attempt4 = store.canProceed('test')

    expect(attempt4.allowed).toBe(false)
    expect(attempt4.timeToWait).toBeGreaterThan(0)
  })

  it('deve desbloquear após timeout', () => {
    const store = useRateLimitStore()

    // 3 tentativas
    store.canProceed('test')
    store.canProceed('test')
    store.canProceed('test')

    // 4ª bloqueada
    const blocked = store.canProceed('test')
    expect(blocked.allowed).toBe(false)

    // Avança 61 segundos
    vi.advanceTimersByTime(61000)

    // Deve desbloquear
    const unblocked = store.canProceed('test')
    expect(unblocked.allowed).toBe(true)
  })

  it('deve limpar tentativas ao resetar', () => {
    const store = useRateLimitStore()

    store.canProceed('test')
    store.canProceed('test')
    store.canProceed('test')

    store.reset()

    expect(store.attempts).toHaveLength(0)
    expect(store.isBlocked).toBe(false)
  })

  it('deve configurar limites personalizados', () => {
    const store = useRateLimitStore()

    store.configure(5, 30000) // 5 tentativas em 30s

    expect(store.maxAttempts).toBe(5)
    expect(store.windowMs).toBe(30000)
  })
})
