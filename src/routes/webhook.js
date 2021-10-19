const { Router } = require('express');

const webhookController = require('../controllers/webhookController');

let broadcast;

exports.broadcast = broadcast;

const router = Router();

router.get('/', webhookController.verify);
router.post('/', webhookController.recieve);
router.post('/send', webhookController.send);

module.exports = router;
