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
  itemIds: [{
    type: String,
    ref: "Item"
  }],
  typeCollect: {
    type: String,
    enum: ["card", "deck"],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Collection", collectionSchema);
