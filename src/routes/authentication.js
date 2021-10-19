const { Router } = require('express');
const authenticationController = require('../controllers/authenticationController');

const router = Router();

router.post('/', authenticationController.authenticate);

module.exports = router;
