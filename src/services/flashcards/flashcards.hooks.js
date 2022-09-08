const { isObject, isString } = require("../../common/types");

const validateCards = (cards) => {
  if (Array.isArray(cards)) {
    return cards.every((v) => {
      return (
        isObject(v) &&
        isString(v.question) &&
        isString(v.answer) &&
        isString(v.bucket) &&
        v.question &&
        v.answer
      );
    });
  }
  return false;
};

const validateOnCreate = () => async (context) => {
  const { app, data } = context;
  if (!data.parentFolderId) {
    throw new Error("Flashcards must be in a folder.");
  }

  if (!isString(data.name) || !data.name) {
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

  const checkCards = validateCards(data.cards);

  if (!checkCards) {
    throw new Error("Cards are invalid.");
  }

  return context;
};

const validateOnPatch = () => (context) => {
  const { data } = context;

  if (!isString(data.name) || !data.name) {
    throw new Error("Name is required.");
  }

  if (data.parentFolderId) {
    throw new Error("Unable to change folder.");
  }

  if (data.owner) {
    throw new Error("Cannot change owner.");
  }

  if (data.cards) {
    const checkCards = validateCards(data.cards);
    if (!checkCards) {
      throw new Error("Cards are invalid.");
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

const flashcardFromParentFolder = () => async (context) => {
  const { id } = context;
  const flashcard = await app.service("flashcards").get(id);
  const parent = await app.service("folders").get(flashcard.parentFolderId);

  const children = parent.children.filter((v) => v._id === id);

  await app.service("folders").patch(parent, { children });

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateOnCreate()],
    update: [],
    patch: [validateOnPatch()],
    remove: [flashcardFromParentFolder()],
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
