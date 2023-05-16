// Call Database
const Card = require("../../model/cards");

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



// remove card by Id
exports.removeCardById = (req, res) => {
  const { id } = req.params;

  Card.deleteOne({ id: id })
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


