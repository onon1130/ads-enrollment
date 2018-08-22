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
//  collection.find({}, {}, function (e, docs) {
  collection.aggregate(
          [
            {
              $project: {
                "deptID": 1,
                "deptName": 1,
                "location": 1,
                numberOfCourse: {$size: "$courseid"}
              }
            }
          ], function (e, docs) {
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

/* POST to addcourse. */
router.post('/addCourse', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var query = {};
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var courseTitle = getQuery.courseTitle;
  var year = getQuery.year;
  var level = getQuery.level;
  var deptID = getQuery.deptID;
  var deptName = getQuery.deptName;
  var classSize = getQuery.classSize;
  var available = classSize;
  query = {"courseid": courseID,
    "dept": {
      "deptID": deptID,
      "deptName": deptName
    },
    "title": courseTitle,
    "level": level,
    "offer": [{
      "year": year,
      "classSize": classSize,
      "available": available,
      "enrolled":null
   }]
  };
  collection.insert(query, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });

});

/* POST to update course info. */
router.post('/updateCourseInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var courseTitle = getQuery.courseTitle;
  var level = getQuery.level;
  var findQuery = {"courseid": courseID};
  var updateQuery = {$set:{"title": courseTitle,"level": level}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to update student course info. */
router.post('/updateStudentCourseInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var courseTitle = getQuery.courseTitle;
  var findQuery = {"enrolled.CourseID": courseID};
  var updateQuery = {$set:{"enrolled.$.title": courseTitle}};
  collection.update(findQuery, updateQuery, {multi: true}, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to updateDept. */
router.post('/updateDept', function (req, res) {
  var db = req.db;
  var collection = db.get('dept');
  var query = {};
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var deptID = getQuery.deptID;

  //update dept
  var findQuery = {"deptID": deptID};
  var updateQuery = {$addToSet: {"courseid": courseID}};
  collection.update(findQuery, updateQuery, {multi: true}, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  
  });

});

/* POST to add course offer */
router.post('/addCourseOffer', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  var classSize = getQuery.classSize;
  var available = classSize;

  var findQuery = {"courseid": courseID};
  var updateQuery = {$push: {"offer":
              {"year": year,
                "classSize": classSize,
                "available": available
              }}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to add course offer */
router.post('/deleteCourseOffer', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  
 
  var findQuery = {"courseid": courseID};
  var updateQuery = {$pull: {"offer": {"year": year}}};
  collection.update(findQuery, updateQuery, function (err, result) {
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
  collection.update(findQuery, updateQuery, function (err, result) {
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
  var updateQuery = {$pull: {"offer.$.enrolled": {"studentID": studentID}},
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
  var updateQuery = {$pull: {"enrolled": {"CourseID": courseID, "year": year}}};
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

      }}};
  collection.update(findQuery, updateQuery, {multi: true}, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to update course offerinfo. */
router.post('/updateOfferInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var getQuery = req.body;
  var courseID = getQuery.courseID;
  var year = getQuery.year;
  var ClassSize = getQuery.ClassSize;
  var available = getQuery.available;
  var findQuery = {"courseid": courseID, "offer.year": year}; 
  var updateQuery = {$set:{"offer.$.classSize": ClassSize,"offer.$.available": available}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});


module.exports = router;

