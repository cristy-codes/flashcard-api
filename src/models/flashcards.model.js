// flashcards-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "flashcards";
  const mongooseClient = app.get("mongooseClient");
  const { Schema, Types } = mongooseClient;
  const { ObjectId } = Types;
  const schema = new Schema(
    {
      parentFolderId: { type: ObjectId },
      owner: { type: ObjectId },
      flashcardName: { type: String },
      cards: { type: Array },
      sharedUsers: { type: String },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
