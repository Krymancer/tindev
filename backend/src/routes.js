const express = require('express');
const DeveloperController = require('./controllers/DeveloperController.js');
const LikeController = require('./controllers/LikeController.js');
const DislikeController = require('./controllers/DislikesController');

const router = express.Router();

router.get('/developers/all',  DeveloperController.index);
router.post('/developers/add', DeveloperController.store);
router.post('/developers/:id/like', LikeController.store);
router.post('/developers/:id/dislike', DislikeController.store);

module.exports = router;