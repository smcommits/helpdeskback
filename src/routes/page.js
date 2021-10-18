const {Router} = require('express')
const pageController = require('../controllers/pageController');

const router = Router()

router.post('/new', pageController.new )

module.exports = router;
