const Collection = require("../../model/collection");

// Create collection
exports.createCollection = (req, res) => {
  const { userId, collection_name, itemIds, typeCollect } = req.body;
  
  // Validate data
  if (!userId || !itemIds || !typeCollect || !collection_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Save collection
  const collection = new Collection({
    userId,
    collection_name,
    itemIds,
    typeCollect
  });

  collection.save()
    .then(savedCollection => {
      res.json(savedCollection);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "An error occurred while saving the collection." });
    });
};

// Get collections by userId
exports.getCollectionsByUserId = (req, res) => {
  const userId = req.query.userId; 
  Collection.find({ userId: userId }) 
    .then(collections => {
      res.json(collections);
    })
    .catch(error => {
      console.error("Error fetching collections:", error);
      res.status(500).json({ error: "An error occurred while fetching the collections." });
    });
};
