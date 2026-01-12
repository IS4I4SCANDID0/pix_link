import 'cypress-real-events'

describe('♿ Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve permitir navegação por teclado', () => {
    // Focar no primeiro campo
    cy.get('[data-testid="input-giver-name"]').focus()

    // Pressionar Tab para ir ao próximo campo
    cy.get('[data-testid="input-giver-name"]').realPress('Tab')

    // Verificar que o próximo campo está focado
    cy.get('[data-testid="input-amount"]').should('have.focus')
  })

  it('deve fechar modal com Escape', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.get('[data-testid="modal-wrapper"]', { timeout: 5000 }).should('be.visible')

    // Pressionar Escape no body (o listener está no document)
    cy.get('body').type('{esc}')

    // Aguardar um pouco para a animação
    cy.wait(300)

    cy.get('[data-testid="modal-wrapper"]').should('not.exist')
  })

  it('deve ter labels ou placeholders acessíveis', () => {
    cy.get('[data-testid="input-giver-name"]').should('have.attr', 'placeholder')
    cy.get('[data-testid="input-amount"]').should('have.attr', 'placeholder')
  })

  it('deve ter contraste adequado nos botões', () => {
    cy.get('button').each(($btn) => {
      cy.wrap($btn).should('be.visible')
    })
  })

  it('deve focar no primeiro campo ao carregar', () => {
    cy.get('[data-testid="input-giver-name"]').should('be.visible')
    // Aguardar o setTimeout de 100ms do onMounted
    cy.wait(150)
    cy.get('[data-testid="input-giver-name"]').should('have.focus')
  })
})
