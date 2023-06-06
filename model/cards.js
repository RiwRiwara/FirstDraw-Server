const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  frameType: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  atk: {
    type: Number,
    required: false,
  },
  def: {
    type: Number,
    required: false,
  },
  level: {
    type: Number,
    required: false,
  },
  race: {
    type: String,
    required: false,
  },
  attribute: {
    type: String,
    required: false,
  },
  card_sets: [{
    set_name: String,
    set_code: String,
    set_rarity: String,
    set_rarity_code: String,
    set_price: String,
  }],
  card_images: [{
    id: String,
    image_url: String,
    image_url_small: String,
    image_url_cropped: String,
  }],
  card_prices: [{
    cardmarket_price: String,
    tcgplayer_price: String,
    ebay_price: String,
    amazon_price: String,
    coolstuffinc_price: String,
  }],
  pick:{
    type: Number,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Cards", cardSchema);
