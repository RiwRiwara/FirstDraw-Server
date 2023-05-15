const Card = require("../model/cards");
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
  
    ['frameType', 'desc', 'archetype'].forEach((field) => {
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
      filters.level = { $in: levels };
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
      handleCardSearchResponse(
        Card.findOne({ id: req.query.id }),
        res,
        "An error occurred while fetching the card."
      );
    } else if (req.query.ran) {
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
      const filters = createFilters(req)
      console.log(filters)
      handleCardSearchResponse(
        Card.find(filters).skip(offset).limit(limit),
        res,
        "An error occurred while fetching all cards."
      );
    }
  };
  
  
  
  