const Card = require("../../model/cards");
// ============================ SEARCH CARD ====================================================
const handleCardSearchResponse = (promise, res, errorMessage) => {
    promise
      .then((cards) => {
        res.json(cards);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: errorMessage });
      });
  };
  
  const createFilters = (req) => {
    const filters = {};
  
    ['frameType', 'desc', 'archetype', 'attribute', 'type', 'race'].forEach((field) => {
      if (req.query[field]) {
        filters[field] = req.query[field].trim();
      }
    });
  
    ['atk', 'def'].forEach((field) => {
      if (req.query[`${field}Min`] || req.query[`${field}Max`]) {
        filters[field] = {};
        if (req.query[`${field}Min`]) {
          filters[field].$gte = parseInt(req.query[`${field}Min`]);
        }
        if (req.query[`${field}Max`]) {
          filters[field].$lte = parseInt(req.query[`${field}Max`]);
        }
      }
    });
  
    if (req.query.level) {
      const levels = req.query.level.split(',').map(Number);
      if(levels.includes(0)){
        filters.level = { $in: [1,2,3,4,5,6,7,8,9,10]};
      }else{
        filters.level = { $in: levels };
      }
    }
  
    if (req.query.name) {
      // Create a case-insensitive regex to filter by name
      filters.name = { $regex: new RegExp(req.query.name, 'i') };
    }
  
    if (req.query.type) {
      const types = req.query.type.split(',').map((type) => type.trim());
      filters.type = { $in: types };
    }
  
    if (req.query.race) {
      const races = req.query.race.split(',').map((race) => race.trim());
      filters.race = { $in: races };
    }
  
    return filters;
  };
  
  exports.getAllCards = (req, res) => {
    if (req.query.id) {
      const cardIds = req.query.id.split(',').map(id => id.trim());
      handleCardSearchResponse(
        Card.find({ _id: { $in: cardIds } }),
        res,
        "An error occurred while fetching the cards."
      );
    } else if (req.query.ran) {
      // Fetch random cards
      const ran = parseInt(req.query.ran);
      if (ran) {
        handleCardSearchResponse(
          Card.aggregate([{ $sample: { size: ran } }]),
          res,
          "An error occurred while fetching random cards."
        );
      }
    } else {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const filters = createFilters(req);
  
      // Sorting options
      const sortOptions = {};
      if (req.query.sort === "az") {
        // Sort by name ascending (A-Z)
        sortOptions.name = 1;
      } else if (req.query.sort === "za") {
        // Sort by name descending (Z-A)
        sortOptions.name = -1;
      }
  
      handleCardSearchResponse(
        Card.find(filters).sort(sortOptions).skip(offset).limit(limit),
        res,
        "An error occurred while fetching all cards."
      );
    }
  };
  