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
    if (req.query[field] && req.query[field] !== '') {
      filters[field] = req.query[field].trim();
    }
  });

  ['atk', 'def'].forEach((field) => {
    if (req.query[`${field}Min`] !== '0' || req.query[`${field}Max`] !== '10000') {
      if (!filters[field]) {
        filters[field] = {};
      }
      if (req.query[`${field}Min`] && req.query[`${field}Min`] !== '0') {
        filters[field].$gte = parseInt(req.query[`${field}Min`]);
      }
      if (req.query[`${field}Max`] && req.query[`${field}Max`] !== '10000') {
        filters[field].$lte = parseInt(req.query[`${field}Max`]);
      }
    }
  });

  if (req.query.level && req.query.level !== '0') {
    const levels = req.query.level.split(',').map(Number);
    if (levels.includes(0)) {
      filters.level = { $in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15] };
    } else {
      filters.level = { $in: levels };
    }
  }

  if (req.query.name && req.query.name !== '') {
    filters.name = { $regex: new RegExp(req.query.name, 'i') };
  }

  return filters;
};


exports.getAllCards = (req, res) => {
  if(!(req.query.defMin || req.query.defMax || req.query.atkMin || req.query.atkMax)){
    req.query.defMin = '0'
    req.query.defMax = '10000'
    req.query.atkMin = '0'
    req.query.atkMax = '10000'
  }
  if (req.query.id) {
    const cardIds = req.query.id.split(',').map(id => id.trim());
    handleCardSearchResponse(
      Card.find({ _id: { $in: cardIds } }),
      res,
      "An error occurred while fetching the cards."
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
    const filters = createFilters(req);

    // Sorting options
    const sortOptions = {};
  
    if (req.query.sort === "az") {
      sortOptions.name = 1;
    } else if (req.query.sort === "za") { 
      sortOptions.name = -1;
    }else   { 
      sortOptions.createdAt = parseInt(req.query.sort)
    }
    handleCardSearchResponse(
      Card.find(filters).sort(sortOptions).skip(offset).limit(limit),
      res,
      "An error occurred while fetching all cards."
    );
  }
};
