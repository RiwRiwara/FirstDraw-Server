const express = require("express");
const {
    createCard,
    removeCardById
} = require("../controllers/card/cardController");
const {
    getAllCards
} = require("../controllers/card/cardSearching")

const router = express.Router();

router.get("/cards", getAllCards);
router.delete("/cards/:id", removeCardById);
router.post("/cards/create", createCard);

module.exports = router;
