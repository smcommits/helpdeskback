const { Router } = require('express')

const webhookController = require('../controllers/webhookController')


const router = Router()

router.get('/', webhookController.verify)
router.post('/', webhookController.deliver)

module.exports =  router;
