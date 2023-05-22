const Collection = require("../../model/collection");

// Create collection
exports.createCollection = (req, res) => {
  const { userId, collection_name, itemIds, typeCollect } = req.body;
  if (!userId || !itemIds || !typeCollect || !collection_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
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

// Get collections by userId and/or type and/or id
exports.getCollectionsByUserId = (req, res) => {
  const userId = req.query.userId;
  const type = req.query.type;
  const id = req.query.id;

  let query = {};

  if (userId) {
    query.userId = userId;
  }

  if (type) {
    query.typeCollect = type;
  }

  if (id) {
    query._id = id;
  }

  Collection.find(query)
    .then(collections => {
      res.json(collections);
    })
    .catch(error => {
      console.error("Error fetching collections:", error);
      res.status(500).json({ error: "An error occurred while fetching the collections." });
    });
};


// Delete a collection by ID
exports.deleteCollectionById = (req, res) => {
  const collectionId = req.params.collectionId;

  Collection.findByIdAndRemove(collectionId)
    .then(deletedCollection => {
      if (!deletedCollection) {
        return res.status(404).json({ error: "Collection not found." });
      }
      res.json({ message: "Collection deleted successfully." });
    })
    .catch(error => {
      console.error("Error deleting collection:", error);
      res.status(500).json({ error: "An error occurred while deleting the collection." });
    });
};


// Update a collection by ID
exports.updateCollectionById = (req, res) => {
  const collectionId = req.params.collectionId;
  const { collection_name, addItems, removeItems } = req.body;

  const updateData = {};

  if (collection_name) {
    updateData.collection_name = collection_name;
  }

  // Get the typeCollect from the collection document
  Collection.findById(collectionId)
    .then(collection => {
      if (!collection) {
        return res.status(404).json({ error: "Collection not found." });
      }

      if (addItems) {
        if (collection.typeCollect === "deck") {
          // Limit item length to 0-60
          if (collection.itemIds.length > 60) {
            return res.status(400).json({ error: "The item length exceeds the limit for a deck." });
          }
          // Check for duplicate cards (up to 3)
          var count = 0;
          for (var i = 0; i < collection.itemIds.length ; i++) {
            if (collection.itemIds[i] === addItems[0]) {
              count++;
            }
          }

          if (count > 2) {
            return res.status(400).json({ error: "Each card in a deck can be duplicated up to three times." });
          }

        }
        updateData.$push = { itemIds: { $each: addItems } }; // Use $push to append items to the array
      }

      if (removeItems) {
        const index = collection.itemIds.indexOf(removeItems[0]);
        if (index !== -1) {
          collection.itemIds.splice(index, 1);
          updateData.itemIds = collection.itemIds;
        }
      }
      


      Collection.findByIdAndUpdate(collectionId, updateData, { new: true })
        .then(updatedCollection => {
          if (!updatedCollection) {
            return res.status(404).json({ error: "Collection not found." });
          }
          res.json(updatedCollection);
        })
        .catch(error => {
          console.error("Error updating collection:", error);
          res.status(500).json({ error: "An error occurred while updating the collection." });
        });
    })
    .catch(error => {
      console.error("Error finding collection:", error);
      res.status(500).json({ error: "An error occurred while finding the collection." });
    });
};
