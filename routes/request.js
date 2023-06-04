const express = require('express');
const requestController = require('../controllers/reqController');
const router = express.Router();

router.post('/requests', requestController.createRequest);
router.get('/requests', requestController.getRequest);
router.put('/requests/:id', requestController.updateRequest);
router.delete('/requests/:id', requestController.deleteRequest);

module.exports = router;
