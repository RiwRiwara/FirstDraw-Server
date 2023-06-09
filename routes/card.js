const express = require("express");
const {
    createCard,
    removeCardById,
    updateCard,
    updatePick
} = require("../controllers/card/cardController");
const {
    getAllCards,
    getTopPickedCards,
    getCardSummary
} = require("../controllers/card/cardSearching")

const router = express.Router();

router.get("/cards", getAllCards);
router.get("/toppickedcards", getTopPickedCards);
router.get("/cards/summary", getCardSummary);

router.delete("/cards/:id", removeCardById);
router.post("/cards/create", createCard);
router.put("/cards/:id", updateCard);

router.put("/updatepick", updatePick);

module.exports = router;
