describe('💳 PIX Payload Generation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve gerar payload PIX válido', () => {
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.window().then((win) => {
      const pinia = (win as any).__pinia
      if (pinia) {
        const donationStore = pinia.state.value.donation
        expect(donationStore.pixPayload).to.not.be.empty
        expect(donationStore.pixPayload).to.include('000201')
      }
    })
  })

  it('deve incluir o valor correto no payload', () => {
    const amount = 50
    cy.get('[data-testid="input-giver-name"]').type('TestUser')
    cy.get('[data-testid="input-amount"]').type(amount.toString())
    cy.get('[data-testid="btn-generate-qrcode"]').click()

    cy.window().then((win) => {
      const pinia = (win as any).__pinia
      if (pinia) {
        const donationStore = pinia.state.value.donation
        expect(donationStore.pixPayload).to.include(amount.toFixed(2))
      }
    })
  })

  it('deve gerar payloads diferentes para valores diferentes', () => {
    let payload1: string = ''

    // Primeira geração
    cy.get('[data-testid="input-giver-name"]').type('User1')
    cy.get('[data-testid="input-amount"]').type('10')
    cy.get('[data-testid="btn-generate-qrcode"]').click()
    cy.wait(500)

    cy.window().then((win) => {
      const pinia = (win as any).__pinia
      if (pinia && pinia.state.value.donation) {
        payload1 = pinia.state.value.donation.pixPayload
      }
    })

    // Reload
    cy.reload()
    cy.wait(1000)

    // Segunda geração
    cy.get('[data-testid="input-giver-name"]').type('User2')
    cy.get('[data-testid="input-amount"]').type('20')
    cy.get('[data-testid="btn-generate-qrcode"]').click()
    cy.wait(500)

    cy.window().then((win) => {
      const pinia = (win as any).__pinia
      if (pinia && pinia.state.value.donation) {
        const payload2 = pinia.state.value.donation.pixPayload
        expect(payload1).to.not.be.empty
        expect(payload2).to.not.be.empty
        expect(payload1).to.not.equal(payload2)
      }
    })
  })
})
