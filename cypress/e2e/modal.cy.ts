describe('🎭 Modal Functionality Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve abrir modal de QR Code com dados válidos', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')
    cy.get('img[alt*="QR Code"]', { timeout: 5000 }).should('be.visible')
  })

  it('deve abrir modal de Copia e Cola', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-view-pixkey"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')
    cy.contains(/copie.*cole/i).should('be.visible')
  })

  it('deve fechar modal ao clicar no botão de fechar', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="modal-close-btn"]').click()
    cy.get('[data-testid="modal-wrapper"]').should('not.exist')
  })

  it('deve mostrar nome do doador no modal', () => {
    const name = 'JoaoSilva'
    cy.get('[data-testid="input-giver-name"]').type(name)
    cy.get('[data-testid="input-amount"]').type('25')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')
    cy.contains(name).should('be.visible')
  })
})
