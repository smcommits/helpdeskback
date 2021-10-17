const { Router } = require('express')

const webhookController = require('../controllers/webhookController')


let broadcast

exports.broadcast = broadcast;

const router = Router()

router.get('/', webhookController.verify)
router.post('/', webhookController.deliver)

module.exports =  router;
