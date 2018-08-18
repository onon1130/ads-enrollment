var express = require('express');
var router = express.Router();


/* GET courselist. */
router.post('/courselist', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var query = {};
  if (req.body) {
    query = req.body;
  }
  collection.find(query, function (err, docs) {
    if (err)
      return err;
    res.send(docs);
  });
});

/* GET studentlist. */
router.post('/studentlist', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var query = {};
  if (req.body) {
    query = req.body;
  }
  collection.find(query, function (err, docs) {
    if (err)
      return err;
    res.send(docs);
  });
});



/* GET deptlist. */

router.get('/deptlist', function (req, res) {
  var db = req.db;
  var collection = db.get('dept');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});


module.exports = router;

