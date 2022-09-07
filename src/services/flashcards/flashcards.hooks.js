const validate = () => async (context) => {
  const { app, data } = context;
  if (!data.parentFolderId) {
    throw new Error("Flashcards must be in a folder.");
  }

  if (!data.name) {
    throw new Error("Name is required.");
  }

  let folder;
  try {
    folder = await app.service("folders").get(data.parentFolderId);
  } catch (_) {
    throw new Error("Folder was not found.");
  }

  const hasFolderAsSibling = folder.children.some((v) => {
    return v.type === "folder";
  });

  if (hasFolderAsSibling) {
    throw new Error("Cannot create flashcards here.");
  }

  if (Array.isArray(data.cards)) {
    const checkCards = data.cards.every((v) => {
      return (
        typeof v === "object" &&
        typeof v.question === "string" &&
        typeof v.answer === "string" &&
        typeof v.bucket === "string" &&
        v.question &&
        v.answer &&
        !v.bucket
      );
    });

    if (!checkCards) {
      throw new Error("Card is invalid.");
    }
  }

  return context;
};

const addChild = () => async (context) => {
  const { result, app } = context;

  const parent = await app.service("folders").get(result.parentFolderId);

  await app.service("folders").patch(result.parentFolderId, {
    children: [...parent.children, { type: "flashcard", id: result._id }],
  });

  return context;
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validate()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addChild()],
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
