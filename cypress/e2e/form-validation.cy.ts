describe('📝 Form Validation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve mostrar erro com nome muito curto', () => {
    cy.get('[data-testid="input-giver-name"]').type('abc')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.contains(/mínimo.*4.*caracteres/i, { timeout: 3000 }).should('be.visible')
  })

  it('deve mostrar erro com nome inválido', () => {
    cy.get('[data-testid="input-giver-name"]').type('test@#$%')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.contains(/nome inválido/i).should('be.visible')
  })

  it('deve mostrar erro com valor zero', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').clear().type('0')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.contains(/valor inválido/i).should('be.visible')
  })

  it('deve aceitar valores decimais', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10.50')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')
  })

  it('deve mostrar tooltip ao focar no campo de valor', () => {
    cy.get('[data-testid="input-amount"]').focus()
    cy.contains(/ponto.*vírgula.*centavos/i, { timeout: 8000 }).should('be.visible')
  })
})
