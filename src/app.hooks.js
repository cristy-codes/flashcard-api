// Application hooks that run for every service

/** Remove this when we put in authentication */
const appendFakeUserId = () => (context) => {
  context.params.user = {
    id: "6315266cd497b0426e470d9b",
  };

  return context;
};

module.exports = {
  before: {
    all: [appendFakeUserId()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
