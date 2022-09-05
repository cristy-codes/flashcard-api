const validateFolderDepth = async (context) => {
  // get parentfolder
  if (context.data.parentFolderId) {
    const parentFolder = await context.app
      .service("folders")
      .get(context.data.parentFolderId);
    // check if parentfolder has a parentfolder, if true return error
    if (!parentFolder) {
      throw new Error("Parent folder does not exist.");
    }
    if (parentFolder.parentFolderId) {
      throw new Error("Maximum folder depth reached.");
    }
  }
};

// A validation hook for everything related to folders
const validate = () => (context) => {
  const { data } = context;
  if (!(typeof data.name === "string" && data.name.length)) {
    throw new Error("Name is a required non-empty field.");
  }

  validateFolderDepth(context);

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
