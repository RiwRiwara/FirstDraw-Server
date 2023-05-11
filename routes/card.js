const express = require("express");
const {
    getCardById,
    getAllCards,
    createCard
} = require("../controllers/cardController");

const router = express.Router();

router.get("/cards", getAllCards);
router.get("/cards/:id", getCardById);
router.post("/cards/create", createCard);

module.exports = router;
