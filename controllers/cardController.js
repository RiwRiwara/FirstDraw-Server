// Call Database
const Card = require("../model/cards");

// Create card
exports.createCard = (req, res) => {
  const { id, name, type, frameType, desc, atk, def, level, race, attribute, card_sets, card_images, card_prices } = req.body;

  // Validate data
  if (!id || !name || !type || !frameType || !desc || !atk || !def || !level || !race || !attribute || !card_sets || !card_images || !card_prices) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Save card
  const card = new Card({
    id,
    name,
    type,
    frameType,
    desc,
    atk,
    def,
    level,
    race,
    attribute,
    card_sets,
    card_images,
    card_prices
  });

  card.save()
    .then((card) => {
      res.json(card);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while saving the card." });
    });
};

// Get all cards
exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.json(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching all cards." });
    });
};


exports.getCardById = (req, res) => {
  const { id } = req.params;

  Card.findOne({ id: id })
    .then((card) => {
      if (!card) {
        console.log(`Card with id ${id} not found`);
        return res.status(404).json({ error: "Card not found" });
      }

      res.json(card);
    })
    .catch((err) => {
      console.error(`Error fetching card with id ${id}:`, err);
      res.status(500).json({ error: "An error occurred while fetching the card." });
    });
};

exports.getRandomCards = (req, res) => {
  Card.aggregate([{ $sample: { size: 10 } }])
    .then((cards) => {
      res.json(cards);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching random cards." });
    });
};
