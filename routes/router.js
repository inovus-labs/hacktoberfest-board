var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {

    var sample = 'Basic Node.js + HandleBars Templete'
    res.render('home', { sample })
});

module.exports = router;