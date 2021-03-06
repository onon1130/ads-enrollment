var express = require('express');
var router = express.Router();


/* GET courselist. */
router.post('/courselist', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var query = {};
  var getQuery = req.body;
  var deptIDNew = [];

  var year = getQuery.year;
  var deptall = getQuery.deptall;
  var deptID = getQuery.deptID;
  var deptID2 = getQuery.deptID2;
  var deptID3 = getQuery.deptID3;
  var deptID4 = getQuery.deptID4;
  if (deptall === 'false') {
    if (deptID !== 'false') {
      deptIDNew.push(deptID);
    }
    if (deptID2 !== 'false') {
      deptIDNew.push(deptID2);
    }
    if (deptID3 !== 'false') {
      deptIDNew.push(deptID3);
    }
    if (deptID4 !== 'false') {
      deptIDNew.push(deptID4);
    }
    query = {'dept.deptID': {$in: deptIDNew}};
    if (year !== 'false') {
      query = {'dept.deptID': {$in: deptIDNew}, 'offer.year': year};
    }
  } else {


    if (year !== 'false') {
      var yearQuery = {'offer.year': year};
    }

  }
//  var deptIDNew = getQuery.deptID;
  //var deptIDNew = [];
  //var deptIDNew = $.makeArray( deptID );
//  if (deptIDNew) {
//  var deptID = deptIDNew;
//   deptID = deptID.replace('[', '');
//   deptID = deptID.replace(']', '');
//  var deptIDArray = deptIDNew.split(',');

  // $mylabel.text( $mylabel.text().replace('-', '') );

  //}
//  if (req.body) {
//    query = req.body;
//  }
//  if (deptID){
//   query = {'dept.deptID': deptID };
//  }
//  if (year !== null){
//  $.extend(query, {'offer.year': year});
//  }
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
//  var courseID = getQuery.courseID;
//  var deptName = getQuery.deptName;
//  var courseTitle = getQuery.title;
//  var year = getQuery.year;
//  var newEnrollDate = getQuery.enrolDate;
//  var deptID = getQuery.deptID;
//  var courseObjectID = getQuery.enrolledCourseID;

//  query = {"studentID": studentID,
//    "studentName": studentName,
//    "dob": dob,
//    "enrolled": [{
//        "CourseID": courseID,
//        "deptName": deptName,
//        "title": courseTitle,
//        "year": year,
//        "enrolDate": newEnrollDate,
//        "deptID": deptID,
//        "enrolledCourseID": courseObjectID}]};
  query = {"studentID": studentID,
    "studentName": studentName,
    "dob": dob};
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
  var classSize = parseInt(getQuery.classSize);
  var available = parseInt(classSize);
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
        "enrolled": []
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
  var updateQuery = {$set: {"title": courseTitle, "level": level}};
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
  var updateQuery = {$set: {"enrolled.$.title": courseTitle}};
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
  var ClassSize = parseInt(getQuery.ClassSize);
  var available = parseInt(getQuery.available);
  var findQuery = {"courseid": courseID, "offer.year": year};
  var updateQuery = {$set: {"offer.$.classSize": ClassSize, "offer.$.available": available}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* DELETE to deleteuser. */
router.delete('/deleteCourse/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var userToDelete = req.params.id;
  collection.remove({'_id': userToDelete}, function (err) {
    res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
  });
});
/* DELETE to deleteuser. */
router.delete('/deleteStudent/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var userToDelete = req.params.id;
  collection.remove({'_id': userToDelete}, function (err) {
    res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
  });
});


/* POST to update student info. */
router.post('/updateStudentInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('student');
  var query = {};
  var getQuery = req.body;
  var studentID = getQuery.studentID;
  var studentName = getQuery.studentName;
  var dob = getQuery.dob;
  var findQuery = {"studentID": studentID};
  var updateQuery = {$set: {"studentName": studentName,
      "dob": dob}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to add dept. */
router.post('/addDept', function (req, res) {
  var db = req.db;
  var collection = db.get('dept');
  var query = {};
  var getQuery = req.body;
  var deptID = getQuery.deptID;
  var deptName = getQuery.deptName;
  var location = getQuery.location;

  query = {"deptID": deptID,
    "deptName": deptName,
    "location": location,
    "courseid": []};
  collection.insert(query, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});
/* POST to update dept. */
router.post('/updateDeptInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('dept');
  var getQuery = req.body;
  var deptID = getQuery.deptID;
  var deptName = getQuery.deptName;
  var location = getQuery.location;


  var findQuery = {"deptID": deptID};
  var updateQuery = {$set: {"deptName": deptName,
      "location": location}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/* POST to update course dept info. */
router.post('/updateCourseDeptInfo', function (req, res) {
  var db = req.db;
  var collection = db.get('course');
  var getQuery = req.body;
  var deptID = getQuery.deptID;
  var deptName = getQuery.deptName;
  var findQuery = {"dept.deptID": deptID};
  var updateQuery = {$set: {"dept.deptName": deptName}};
  collection.update(findQuery, updateQuery, function (err, result) {
    res.send(
            (err === null) ? {msg: ''} : {msg: err}
    );
  });
});
/* DELETE to delete dept. */
router.delete('/deleteDept/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('dept');
  var userToDelete = req.params.id;
  collection.remove({'_id': userToDelete}, function (err) {
    res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
  });
});
module.exports = router;