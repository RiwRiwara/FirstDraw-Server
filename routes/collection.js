const express = require("express");
const router = express.Router();

const { createCollection, getCollectionsByUserId, deleteCollectionById , updateCollectionById} = require("../controllers/collection/collectionController");

router.post("/collections", createCollection);
router.get("/collections", getCollectionsByUserId);
router.delete('/collections/:collectionId',deleteCollectionById);
router.put("/collections/:collectionId", updateCollectionById);

module.exports = router;
