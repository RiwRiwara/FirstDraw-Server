// Call Database
const Card = require("../../model/cards");

async function updateCard(cardId, updateFields) {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateFields },
      { new: true }
    );

    if (updatedCard) {
      console.log("Card updated successfully:", updatedCard);
    } else {
      console.log("Card not found");
    }
  } catch (error) {
    console.error("Error updating card:", error);
  }
}

exports.createCard = (req, res) => {
  const { name, type, frameType, desc, atk, def, level, race, attribute, card_sets, card_images, card_prices } = req.body;

  // Save card
  const card = new Card({
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
      card.id = card._id;
      const updateFields = {
        id: card._id,
      };

      updateCard(card._id, updateFields);
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

  Card.deleteOne({ _id: id })
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


exports.updateCard = (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  Card.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true })
  .then((updatedCard) => {
    if (!updatedCard) {
      console.log(`Card with id ${id} not found`);
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(updatedCard);
  })
  .catch((err) => {
    console.error(`Error updating card with id ${id}:`, err);
    res.status(500).json({ error: "An error occurred while updating the card." });
  });

};


exports.updatePick = async (req, res) => {
  const id = req.query.id;
  const action = req.query.action;

  try {
    let card = await Card.findOne({_id:id});
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    if (!card.pick) {
      console.log("==Zero++")
      console.log(card)
      card.pick = 0;
    }
    if (action === "i") {
      card.pick = card.pick+1;
    } else if (action === "d") {
      card.pick = card.pick-1;;
      } 
    else {
      return res.status(400).json({ error: "Invalid action" });
    }
    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (err) {
    console.error(`Error updating pick for card with id ${id}:`, err);
    res.status(500).json({ error: "An error occurred while updating the card." });
  }
};
