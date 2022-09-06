const validateFolderDepth = async (context) => {
  if (context.data.parentFolderId) {
    const parentFolder = await context.app
      .service("folders")
      .get(context.data.parentFolderId);

    if (!parentFolder) {
      throw new Error("Parent folder does not exist.");
    }
    if (parentFolder.parentFolderId) {
      throw new Error("Maximum folder depth reached.");
    }
  }
};

const validate = () => (context) => {
  const { data } = context;
  if (!(typeof data.name === "string" && data.name.length)) {
    throw new Error("Name is a required non-empty field.");
  }

  validateFolderDepth(context);

  return context;
};

const removeFolder = () => async (context) => {
  const { id, app, params } = context;
  const isInternal = !params.provider;

  if (!id && !isInternal) {
    throw new Error("Folder ID is required.");
  }

  if (id) {
    const folder = await app.service("folders").get(id);

    if (!folder.children.length) {
      return context;
    }

    const children = folder.children.filter((v) => {
      return v.type === "folder";
    });

    const tobedeleted = await app.service("folders").remove(null, {
      query: {
        _id: {
          $in: children.map((v) => {
            return v.id;
          }),
        },
      },
    });

  }

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validate()],
    update: [],
    patch: [validate()],
    remove: [removeFolder()],
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
