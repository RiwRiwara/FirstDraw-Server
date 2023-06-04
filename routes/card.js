const express = require("express");
const {
    createCard,
    removeCardById,
    updateCard
} = require("../controllers/card/cardController");
const {
    getAllCards
} = require("../controllers/card/cardSearching")

const router = express.Router();

router.get("/cards", getAllCards);
router.delete("/cards/:id", removeCardById);
router.post("/cards/create", createCard);
router.put("/cards/:id", updateCard);

module.exports = router;
