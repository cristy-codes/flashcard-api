const users = require('./users/users.service.js');
const flashcards = require('./flashcards/flashcards.service.js');
const folders = require('./folders/folders.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(flashcards);
  app.configure(folders);
};
