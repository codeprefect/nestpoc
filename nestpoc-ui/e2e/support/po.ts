export const navigateTo = url => cy.visit(url);

export const getGreeting = () => cy.get('app-root h1');
