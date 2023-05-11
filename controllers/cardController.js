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
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
  const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified
  const type = req.query.type || '';
  const race = req.query.race || '';
  const attribute = req.query.attribute || '';

  Card.find({
    type: { $regex: type, $options: 'i' },
    race: { $regex: race, $options: 'i' },
    attribute: { $regex: attribute, $options: 'i' },
  })
    .skip(offset)
    .limit(limit)
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

