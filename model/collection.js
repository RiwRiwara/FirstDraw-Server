const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  collection_name: {
    type: String,
    required: true
  },
  itemIds: [mongoose.Schema.Types.Mixed],
  Description: {
    type: String,
    required: false
  },
  tag: {
    type: [String],
    required: false
  },
  typeCollect: {
    type: String,
    enum: ["card", "deck"],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Collection", collectionSchema);
