const express = require('express');
const router = express.Router();


router.use('/', require('./swagger'))
router.use('/movies', require('./movies'))

module.exports = router;