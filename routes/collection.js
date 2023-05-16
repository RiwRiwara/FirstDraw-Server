const express = require("express");
const router = express.Router();

const { createCollection, getCollectionsByUserId } = require("../controllers/collection/collectionController");

router.post("/collections", createCollection);
router.get("/collections", getCollectionsByUserId);

module.exports = router;
