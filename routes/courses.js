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

/* POST to adduser. */
router.post('/addStudent', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var query = {};
  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var studentName = getQuery.studentName;
  var dob = getQuery.dob;
  var courseID = getQuery.courseID;
  var deptName = getQuery.deptName;
  var courseTitle = getQuery.title;
  var year = getQuery.year;
  var newEnrollDate = getQuery.enrolDate;
  var deptID = getQuery.deptID;
  var courseObjectID = getQuery.enrolledCourseID;

  query = {"studentID": studentID,
    "studentName": studentName,
    "dob": dob,
    "enrolled": [{
        "CourseID": courseID,
        "deptName": deptName,
        "title": courseTitle,
        "year": year,
        "enrolDate": newEnrollDate,
        "deptID": deptID,
        "enrolledCourseID": courseObjectID}]};
  collection.insert(query, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to enroll course. */
router.post('/enrollCourse', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var findQuery = {};
  var updateQuery = {};

  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  var newEnrollDate = getQuery.enrolDate;

  var findQuery = {"courseid": courseID, "offer.year": year};
  var updateQuery = {$push: {"offer.$.enrolled":
              {"studentID": studentID,
                  "enrolDate": newEnrollDate}},
    $inc: {"offer.$.available": -1}};
    collection.update(findQuery, updateQuery, {multi: true}, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to unenroll course. */
router.post('/unEnrollCourse', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var findQuery = {};
  var updateQuery = {};

  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  var findQuery = {"courseid": courseID, "offer.year": year};
  var updateQuery = {$pull: {"offer.$.enrolled": {"studentID": studentID} },
    $inc: {"offer.$.available": +1}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to unenroll student. */
router.post('/updateStudent', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var findQuery = {};
  var updateQuery = {};

  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  var findQuery = {"studentID": studentID};
  var updateQuery = {$pull: {"enrolled": {"CourseID": courseID, "year":year} }};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});
/* POST to batch update student. */
router.post('/batchUpdateStudent', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var findQuery = {};
  var updateQuery = {};
  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var courseID = getQuery.courseID;
  var deptName = getQuery.deptName;
  var courseTitle = getQuery.title;
  var year = getQuery.year;
  var newEnrollDate = getQuery.enrolDate;
  var deptID = getQuery.deptID;
  var findQuery = {"studentID": studentID};
  //{"dept.deptID":{$in:["CS","IS"]}})
  var updateQuery = {$push: {"enrolled": {
        "CourseID": courseID,
        "deptName": deptName,
        "title": courseTitle,
        "year": year,
        "enrolDate": newEnrollDate,
        "deptID": deptID
        
  } }};
  collection.update(findQuery, updateQuery, {multi: true}, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});
module.exports = router;

