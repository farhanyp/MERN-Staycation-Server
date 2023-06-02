const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get("/signin", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

module.exports = router