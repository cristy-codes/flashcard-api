// Initializes the `flashcards` service on path `/flashcards`
const { Flashcards } = require('./flashcards.class');
const createModel = require('../../models/flashcards.model');
const hooks = require('./flashcards.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/flashcards', new Flashcards(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('flashcards');

  service.hooks(hooks);
};
