describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .contains('Добавить')
      .click();

    cy.get('[class*=constructor]').contains('Краторная булка N-200i');
    cy.get('[class*=constructor]').contains(
      'Мясо бессмертных моллюсков Protostomia'
    );
  });
});
