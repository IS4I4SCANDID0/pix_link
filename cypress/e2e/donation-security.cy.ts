describe('🛡️ Security & Validation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve bloquear payload adulterado', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-testid="modal-close-btn"]').click()
    cy.wait(500)

    // Adulterar payload (só em DEV mode)
    cy.window().then((win) => {
      const testSec = (win as any).testSecurity
      if (testSec) {
        testSec.alterarPayload('FAKE_PAYLOAD_123')
      }
    })

    cy.get('[data-testid="btn-generate-qrcode"]').click()
    cy.contains(/erro.*validação|tentativa.*alteração/i, { timeout: 3000 }).should('be.visible')
  })

  it('deve validar hash corretamente', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('15')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.window().then((win) => {
      const testSec = (win as any).testSecurity
      if (testSec) {
        expect(testSec.validar()).to.be.true
      }
    })
  })

  it('deve bloquear cópia de payload inválido', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-view-pixkey"]').click()

    // Aguardar modal aparecer
    cy.get('[data-testid="modal-wrapper"]', { timeout: 5000 }).should('be.visible')

    // Adulterar payload
    cy.window().then((win) => {
      const testSec = (win as any).testSecurity
      if (testSec) {
        testSec.alterarPayload('INVALID')
      }
    })

    // Clicar no botão de copiar dentro do modal
    cy.get('[data-testid="btn-copy-pixkey"]').click()
    cy.contains(/erro/i).should('be.visible')
  })
})
