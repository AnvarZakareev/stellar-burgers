describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запрос на ингридиенты и отдаём наш мок
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    // Открываем главную страницу — адаптируй под свой роут, если нужно
    cy.visit('/');
    // Ждём загрузки наших моковых ингредиентов
    cy.wait('@getIngredients');
  });

  it('Показывает список ингредиентов из моков', () => {
    // Например, ищем название одного из ингредиентов из фикстуры
    cy.contains('Краторная булка N-200i');
    cy.contains('Мясо бессмертных моллюсков Protostomia');
  });
});
