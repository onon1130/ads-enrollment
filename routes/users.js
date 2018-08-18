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


router.post('/adduser', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});



//router.get('/courselist', function (req, res) {
//  var db = req.db;
//  var collection = db.get('course');
//  var year = req.params.year;
//  //console.log('year2:'+year);
//  //year = 2017;
//  var dept = req.params.dept;
//  var query = {};
//  //query = { 'offer.year': 2016 };
//  //var query = {'courseid': 'CS101'};
//  //var query =req.params.query;
//  //var query = {};
//  collection.find(query, {}, function (e, docs) {
//    res.json(docs);
//  });
//});

/* GET userlist. */
router.get('/userlist', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/* POST to adduser. */
router.post('/adduser', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userToDelete = req.params.id;
  collection.remove({'_id': userToDelete}, function (err) {
    res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
  });
});

module.exports = router;

