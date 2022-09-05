const app = require('../../src/app');

describe('\'flashcards\' service', () => {
  it('registered the service', () => {
    const service = app.service('flashcards');
    expect(service).toBeTruthy();
  });
});
