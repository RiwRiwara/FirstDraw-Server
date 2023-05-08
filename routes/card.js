const express = require("express");
const {
    getCardById,
    getAllCards,
} = require("../controllers/cardController");

const router = express.Router();


// Get all cards
router.get("/cards", getAllCards);
// Get a card by id
router.get("/cards/:id", getCardById);
//random 10 cards

module.exports = router;
