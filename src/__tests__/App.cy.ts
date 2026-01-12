import App from './App.vue'

describe('App Component - Renderização Completa', () => {
  beforeEach(() => {
    cy.mount(App)
  })

  describe('Componentes Principais', () => {
    it('deve renderizar Header', () => {
      cy.get('[data-testid="header"]').should('exist').and('be.visible')
    })

    it('deve renderizar DonationForm', () => {
      cy.get('[data-testid="donation-form"]').should('exist').and('be.visible')
    })

    it('deve renderizar Footer', () => {
      cy.get('[data-testid="footer"]').should('exist').and('be.visible')
    })
  })

  describe('Campos de Formulário', () => {
    it('deve ter campo Nome do Doador', () => {
      cy.get('[data-testid="input-giver-name"]').should('exist').and('be.visible').and('not.be.disabled').and('have.attr', 'name', 'giverName')
    })

    it('deve ter campo Valor da Doação', () => {
      cy.get('[data-testid="input-amount"]')
        .should('exist')
        .and('be.visible')
        .and('not.be.disabled')
        .and('have.attr', 'type', 'number')
        .and('have.attr', 'name', 'amount')
    })
  })

  describe('Botões de Ação', () => {
    it('deve ter botão Gerar QR Code', () => {
      cy.get('[data-testid="btn-generate-qrcode"]')
        .should('exist')
        .and('be.visible')
        .and('not.be.disabled')
        .and('contain.text', /gerar|qr/i)
    })

    it('deve ter botão Ver Chave PIX', () => {
      cy.get('[data-testid="btn-view-pixkey"]')
        .should('exist')
        .and('be.visible')
        .and('not.be.disabled')
        .and('contain.text', /chave|pix/i)
    })
  })

  describe('Estrutura Semântica', () => {
    it('deve ter estrutura HTML correta', () => {
      cy.get('[data-testid="header"]').should('exist')
      cy.get('[data-testid="donation-form"]').should('exist')
      cy.get('[data-testid="footer"]').should('exist')
    })

    it('deve ter heading principal', () => {
      cy.get('h1, [role="heading"]').should('exist').and('not.be.empty')
    })

    it('componentes devem estar na ordem correta', () => {
      cy.get('body')
        .find('[data-testid]')
        .then(($elements) => {
          const order = $elements.toArray().map((el) => el.getAttribute('data-testid'))

          // Header deve vir antes do form
          const headerIndex = order.indexOf('header')
          const formIndex = order.indexOf('donation-form')
          const footerIndex = order.indexOf('footer')

          expect(headerIndex).to.be.lessThan(formIndex)
          expect(formIndex).to.be.lessThan(footerIndex)
        })
    })
  })

  describe('Acessibilidade', () => {
    it('campos devem ter placeholders ou labels', () => {
      cy.get('[data-testid="input-giver-name"]').should('satisfy', ($el) => {
        return $el.attr('placeholder') || $el.attr('aria-label') || $el.attr('id')
      })

      cy.get('[data-testid="input-amount"]').should('satisfy', ($el) => {
        return $el.attr('placeholder') || $el.attr('aria-label') || $el.attr('id')
      })
    })

    it('botões devem ter texto visível ou aria-label', () => {
      cy.get('[data-testid^="btn-"]').each(($btn) => {
        cy.wrap($btn).should('satisfy', ($el) => {
          return $el.text().trim() !== '' || $el.attr('aria-label')
        })
      })
    })

    it('campos devem ser focáveis', () => {
      cy.get('[data-testid="input-giver-name"]').focus().should('have.focus')
      cy.get('[data-testid="input-amount"]').focus().should('have.focus')
    })

    it('botões devem ter cursor pointer', () => {
      cy.get('[data-testid^="btn-"]').each(($btn) => {
        cy.wrap($btn).should('have.css', 'cursor', 'pointer')
      })
    })
  })

  describe('Interatividade Básica', () => {
    it('deve permitir digitar no campo de nome', () => {
      cy.get('[data-testid="input-giver-name"]').type('TestUser').should('have.value', 'TestUser')
    })

    it('deve permitir digitar no campo de valor', () => {
      cy.get('[data-testid="input-amount"]').type('10').should('have.value', '10')
    })

    it('botões devem ser clicáveis', () => {
      cy.get('[data-testid="input-giver-name"]').type('Test')
      cy.get('[data-testid="input-amount"]').type('5')

      cy.get('[data-testid="btn-generate-qrcode"]').click()
      // Após clicar, algo deve acontecer (modal, validação, etc)
    })
  })

  describe('Responsividade Visual', () => {
    it('deve ser visível em desktop', () => {
      cy.viewport(1920, 1080)

      cy.get('[data-testid="header"]').should('be.visible')
      cy.get('[data-testid="donation-form"]').should('be.visible')
      cy.get('[data-testid="footer"]').should('be.visible')
    })

    it('deve ser visível em mobile', () => {
      cy.viewport(375, 667)

      cy.get('[data-testid="header"]').should('be.visible')
      cy.get('[data-testid="donation-form"]').should('be.visible')
      cy.get('[data-testid="footer"]').should('be.visible')
    })
  })
})
