const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  frameType: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  atk: {
    type: Number,
    required: true,
  },
  def: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  attribute: {
    type: String,
    required: true,
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
  }]
});

module.exports = mongoose.model("Cards", cardSchema);
