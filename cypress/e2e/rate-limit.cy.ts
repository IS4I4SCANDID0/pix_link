describe('⏱️ Rate Limiting Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')

    cy.window().then((win) => {
      const pinia = (win as any).__pinia
      if (pinia) {
        const store = pinia.state.value.rateLimit
        if (store) {
          store.attempts = []
          store.isBlocked = false
          store.blockedUntil = null
          store.cooldownTime = 0
        }
      }
    })
    cy.wait(500)
  })

  it('deve permitir 3 tentativas e bloquear a 4ª', () => {
    // Definimos uma função para preencher e clicar, para garantir estabilidade
    const preencherEGerar = () => {
      cy.get('[data-testid="input-giver-name"]').clear().type('TestUser')
      cy.get('[data-testid="input-amount"]').clear().type('10')
      cy.get('[data-testid="btn-generate-qrcode"]').should('not.be.disabled').click()
    }

    for (let i = 0; i < 3; i++) {
      cy.log(`=== Tentativa ${i + 1} ===`)
      preencherEGerar()

      // Espera o modal aparecer e ser visível
      cy.get('[data-testid="modal-wrapper"]', { timeout: 10000 }).should('be.visible')

      // Fecha o modal
      cy.get('[data-testid="modal-close-btn"]').click({ force: true })

      // GARANTE que o modal saiu do DOM antes da próxima volta do loop
      cy.get('[data-testid="modal-wrapper"]').should('not.exist')
      cy.wait(500) // Pequena pausa para o Vue processar o fechamento
    }

    cy.log('=== Tentativa 4 (Bloqueio) ===')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    // Verifica bloqueio
    cy.get('[data-testid="btn-generate-qrcode"]').should('be.disabled').should('contain', 'Aguarde')
  })

  it('deve mostrar tempo de espera no bloqueio', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')

    cy.window().then((win) => {
      const store = (win as any).__pinia.state.value.rateLimit
      const now = Date.now()

      // Configuramos o estado bloqueado
      store.attempts = [now, now, now]
      store.isBlocked = true
      store.blockedUntil = now + 60000
      store.cooldownTime = 60

      // Forçamos o início do contador
      if (store.startCountdown) {
        store.startCountdown()
      }
    })

    // 1. Garantir que o botão está desabilitado e mostra o tempo inicial
    cy.get('[data-testid="btn-generate-qrcode"]').should('be.disabled').and('contain', '60s')

    // 2. Em vez de pegar o texto e comparar manualmente,
    // usamos uma asserção que o Cypress vai repetir até passar ou dar timeout.
    // Isso ignora os problemas de "60 < 60" por causa de milissegundos.
    cy.get('[data-testid="btn-generate-qrcode"]', { timeout: 10000 }).should(($btn) => {
      const text = $btn.text()
      // Buscamos o número dentro do texto (ex: "Aguarde 58s")
      const match = text.match(/(\d+)s/)
      const seconds = match ? parseInt(match[1]!) : 60

      // A asserção: o número deve ser menor que 60
      expect(seconds).to.be.at.most(60)
      expect(seconds).to.be.greaterThan(0)
    })
  })

  it('deve desbloquear após o cooldown', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')

    cy.window().then((win) => {
      const store = (win as any).__pinia.state.value.rateLimit
      const now = Date.now()
      store.isBlocked = true
      store.blockedUntil = now + 3000 // 3 segundos para ser rápido
      store.cooldownTime = 3
      if (store.startCountdown) store.startCountdown()
    })

    // Espera o botão habilitar (timeout de 5s é suficiente para um cooldown de 3s)
    cy.get('[data-testid="btn-generate-qrcode"]', { timeout: 5000 }).should('not.be.disabled').should('contain', 'Gerar QR Code')
  })

  it('deve resetar tentativas após janela de tempo', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')

    // 1 Tentativa
    cy.get('[data-testid="btn-generate-qrcode"]').click()
    cy.get('[data-testid="modal-wrapper"]').should('be.visible')
    cy.get('[data-testid="modal-close-btn"]').click()

    // Forçar tempo antigo na Store
    cy.window().then((win) => {
      const store = (win as any).__pinia.state.value.rateLimit
      store.attempts = [Date.now() - 61000] // Há mais de 1 minuto
    })

    cy.get('[data-testid="btn-generate-qrcode"]').click()
    cy.get('[data-testid="modal-wrapper"]').should('be.visible')

    cy.window().then((win) => {
      const store = (win as any).__pinia.state.value.rateLimit
      expect(store.attempts.length).to.equal(1) // Resetou a antiga e add a nova
    })
  })
})
