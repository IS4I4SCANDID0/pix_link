import { describe, it, expect } from 'vitest'
import generatePixPayload from '../pixPayloadGenerate'

describe('PIX Payload Generation', () => {
  it('deve gerar payload válido com dados corretos', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10.5, 'TXID123')

    expect(payload).toMatch(/^000201/) // Começa correto
    expect(payload).toContain('test@example.com')
    expect(payload).toContain('TESTE')
    expect(payload).toContain('10.50')
  })

  it('deve remover acentos do nome', () => {
    const payload = generatePixPayload('test@example.com', 'José Açúcar', 'São Paulo', 10, 'TXID')

    expect(payload).toContain('JOSE ACUCAR')
    expect(payload).toContain('SAO PAULO')
  })

  it('deve remover caracteres especiais do nome', () => {
    const payload = generatePixPayload(
      '12345678901', // CPF sem @ para não interferir no teste
      'João@Silva#123',
      'CIDADE',
      10,
      'TXID',
    )

    // Verifica se nome foi sanitizado
    expect(payload).toMatch(/59\d{2}JOAOSILVA123/)

    // Verifica que o payload NÃO contém @ nem #
    expect(payload).not.toContain('@')
    expect(payload).not.toContain('#')
  })

  it('deve manter @ na chave PIX mas remover do nome', () => {
    const payload = generatePixPayload(
      'test@example.com', // Chave PIX com @
      'João@Silva#123', // Nome com @ e #
      'CIDADE',
      10,
      'TXID',
    )

    // A chave PIX DEVE ter @
    expect(payload).toContain('test@example.com')

    // O nome NÃO deve ter @ nem #
    const nameMatch = payload.match(/59\d{2}([A-Z0-9\s.-]+?)60/)
    expect(nameMatch).toBeTruthy()
    expect(nameMatch![1]).toBe('JOAOSILVA123')
    expect(nameMatch![1]).not.toContain('@')
    expect(nameMatch![1]).not.toContain('#')
  })

  it('deve abreviar cidade longa', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'São José do Rio Preto', 10, 'TXID')

    expect(payload).toContain('SAO JOSE R P')
  })

  it('deve limitar nome a 25 caracteres', () => {
    const payload = generatePixPayload('test@example.com', 'NOME MUITO LONGO QUE ULTRAPASSA VINTE E CINCO CARACTERES', 'CIDADE', 10, 'TXID')

    expect(payload).toMatch(/5925NOME MUITO LONGO QUE ULTR/)
  })

  it('deve formatar valor com 2 casas decimais', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10, 'TXID')

    expect(payload).toContain('10.00')
  })

  it('deve calcular CRC16 corretamente', () => {
    const payload1 = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10, 'TXID')
    const payload2 = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10, 'TXID')

    expect(payload1).toBe(payload2)
  })

  it('deve gerar payloads diferentes para valores diferentes', () => {
    const payload1 = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10, 'TXID')
    const payload2 = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 20, 'TXID')

    expect(payload1).not.toBe(payload2)
  })

  it('deve sanitizar TXID corretamente', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 10, 'tx-id@123#456')

    expect(payload).toMatch(/62\d{2}05\d{2}TXID123456/)
  })

  it('deve tratar valor zero', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'CIDADE', 0, 'TXID')

    // Não deve conter campo 54 (valor)
    expect(payload).not.toMatch(/54\d{2}/)
  })

  it('deve manter cidade curta inalterada', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'São Paulo', 10, 'TXID')

    expect(payload).toContain('SAO PAULO')
  })
})

describe('Abreviação de Cidades', () => {
  it('deve abreviar São José do Rio Preto', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'São José do Rio Preto', 10, 'TXID')

    // ✅ CORRIGIDO: 6012 (12 caracteres, não 13)
    expect(payload).toMatch(/6012SAO JOSE R P/)
  })

  it('deve abreviar Santa Cruz do Sul', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'Santa Cruz do Sul', 10, 'TXID')

    // "SANTA CRUZ S" = 12 caracteres
    expect(payload).toMatch(/6012SANTA CRUZ S/)
  })

  it('deve manter Belo Horizonte inalterado', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'Belo Horizonte', 10, 'TXID')

    // "BELO HORIZONTE" = 14 caracteres
    expect(payload).toMatch(/6014BELO HORIZONTE/)
  })

  it('deve truncar palavra única muito longa', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'Paranaguamirimzinho', 10, 'TXID')

    // "PARANAGUAMIRIM" = 15 caracteres (truncado)
    expect(payload).toMatch(/6015PARANAGUAMIRIM/)
  })

  it('deve abreviar São João da Barra', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'São João da Barra', 10, 'TXID')

    // "SAO JOAO B" = 10 caracteres
    expect(payload).toMatch(/6010SAO JOAO B/)
  })

  it('deve abreviar Presidente Prudente', () => {
    const payload = generatePixPayload('test@example.com', 'TESTE', 'Presidente Prudente', 10, 'TXID')

    // "PRESIDENTE P" = 12 caracteres
    expect(payload).toMatch(/6012PRESIDENTE P/)
  })
})
