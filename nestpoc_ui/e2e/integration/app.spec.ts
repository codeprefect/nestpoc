import { getGreeting, navigateTo } from '../support/po';

describe('Home Page', () => {
  beforeEach(() => navigateTo('/'));

  it('should have welcome message', () => {
    getGreeting().contains('Welcome to nest-ui!');
  });
});
