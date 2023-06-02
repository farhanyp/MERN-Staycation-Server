const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', adminController.viewSignIn)
// router.get('/', function(req, res, next) {
//   res.redirect('/admin/signin')
// });

module.exports = router