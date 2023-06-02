const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.status(200).join({
        message: "ini index"
    })
})

module.exports = router