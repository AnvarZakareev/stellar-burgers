beforeEach(() => {
  cy.visit('about:blank');
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );
  cy.visit('/login');
  cy.get('input[name=email]').type('1@mail.russia');
  cy.get('input[name=password]').type('1');
  cy.contains('Войти').click();
});

it('Создаёт заказ, показывает верный номер заказа и очищает конструктор', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  cy.wait('@getIngredients');
  cy.contains('Краторная булка N-200i', { timeout: 1000000 }).should(
    'be.visible'
  );
  cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
  cy.contains('Мясо бессмертных моллюсков Protostomia')
    .parent()
    .contains('Добавить')
    .click();
  cy.contains('Оформить заказ').click();
  cy.wait('@createOrder');
  cy.contains('123456').should('be.visible');
  cy.contains('идентификатор заказа').should('be.visible');
  cy.contains('Ваш заказ начали готовить').should('be.visible');
  cy.contains('Дождитесь готовности на орбитальной станции').should(
    'be.visible'
  );
  cy.get('button.Z7mUFPBZScxutAKTLKHN').click();
  cy.contains('Выберите булки').should('be.visible');
  cy.contains('Выберите начинку').should('be.visible');
});
