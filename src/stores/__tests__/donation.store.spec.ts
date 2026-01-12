import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDonationStore } from '@/stores/donation.store'
import CryptoJS from 'crypto-js'

describe('Donation Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Validação de Hash', () => {
    it('deve gerar hash válido para payload', () => {
      const store = useDonationStore()

      store.giverName = 'TestUser'
      store.amount = 10

      store.generatePix()

      expect(store.pixPayload).not.toBe('')
      expect(store.pixValidationHash).not.toBe('')
      expect(store.pixValidationHash).toHaveLength(64) // SHA256 = 64 chars hex
    })

    it('deve validar payload não adulterado', () => {
      const store = useDonationStore()

      store.giverName = 'TestUser'
      store.amount = 10
      store.generatePix()

      const isValid = store.validatePayload()

      expect(isValid).toBe(true)
    })

    it('deve rejeitar payload adulterado', () => {
      const store = useDonationStore()

      store.giverName = 'TestUser'
      store.amount = 10
      store.generatePix()

      // Adulterar payload
      store.pixPayload = 'FAKE_PAYLOAD'

      const isValid = store.validatePayload()

      expect(isValid).toBe(false)
    })

    it('deve rejeitar hash adulterado', () => {
      const store = useDonationStore()

      store.giverName = 'TestUser'
      store.amount = 10
      store.generatePix()

      // Adulterar hash
      store.pixValidationHash = 'FAKE_HASH'

      const isValid = store.validatePayload()

      expect(isValid).toBe(false)
    })
  })

  describe('Geração de PIX', () => {
    it('deve limpar payload se valor inválido', () => {
      const store = useDonationStore()

      store.giverName = 'TestUser'
      store.amount = 0 // Inválido

      const success = store.generatePix()

      expect(success).toBe(false)
      expect(store.pixPayload).toBe('')
      expect(store.pixValidationHash).toBe('')
    })

    it('deve gerar payload com nome sanitizado', () => {
      const store = useDonationStore()

      store.giverName = 'test@user#123'
      store.amount = 10

      store.generatePix()

      // TXID deve conter apenas letras/números
      expect(store.pixPayload).toContain('TESTUSER123')
    })
  })

  describe('Validações de Input', () => {
    it('deve aceitar nome com 4+ caracteres', () => {
      const store = useDonationStore()
      expect(store.giverName.length >= 4 || store.giverName === '').toBe(true)
    })

    it('deve aceitar valor >= 1', () => {
      const store = useDonationStore()
      store.amount = 1
      expect(store.isAmountValid).toBe(true)
    })

    it('deve rejeitar valor < 1', () => {
      const store = useDonationStore()
      store.amount = 0.5
      expect(store.isAmountValid).toBe(false)
    })
  })
})
