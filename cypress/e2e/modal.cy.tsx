describe('Modal open/close', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Открытие и закрытие модального окна с описанием ингредиента', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.wait(1000);
    cy.get('button.Z7mUFPBZScxutAKTLKHN').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик', () => {
    cy.contains('Мясо бессмертных моллюсков Protostomia').click();
    cy.wait(1000);
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('420').should('be.visible');
    cy.contains('433').should('be.visible');
    cy.contains('244').should('be.visible');
    cy.contains('33').should('be.visible');
    cy.get('button.Z7mUFPBZScxutAKTLKHN').click();

    cy.contains('Краторная булка N-200i').click();
    cy.wait(1000);
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('420').should('be.visible');
    cy.contains('80').should('be.visible');
    cy.contains('24').should('be.visible');
    cy.contains('53').should('be.visible');
    cy.get('button.Z7mUFPBZScxutAKTLKHN').click();
  });
});
