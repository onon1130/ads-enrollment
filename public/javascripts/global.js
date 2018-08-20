// Userlist data array for filling in info box
var userListData = [];
var couseListData = [];
var deptListData = [];
var studentListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

  populateCourse();

  // Username link click
  //$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $(document.body).on('change', '#course-year, #course-dept', function (e) {
    console.log('change!');
    populateCourse();
  });
  $(document.body).on('click', '#student-filter-trigger', function (e) {
    e.preventDefault();
    var studentName = $('#student-name').val();
    populateStudent(studentName);
  });
  $(document.body).on('click', '#btnSearchStudent', function (e) {
    e.preventDefault();
    var courseID = $('#studentEnroll').attr('data-courseID');
    var year = $('#studentEnroll').attr('data-offer-year');
    var studentName = $('#searchStudentName').val();
    var studentID = $('#searchStudentID').val();
    populateSearchStudent(studentName, studentID, courseID, year);
  });
  $(document.body).on('click', '.list-tabs a', function (e) {
    e.preventDefault();
    if (!$(this).parent().hasClass('active')) {
      $('.list-tabs').find('li').removeClass('active');
      $(this).parent().addClass('active');
      clearAllFilter();
      var panelID = $(this).attr('data-list-id');
      $('.listPanel').hide();
      $('#' + panelID).fadeIn();
      if (panelID === 'courseList') {
        populateCourse();
      } else if (panelID === 'studentList') {

        populateStudent();
      } else if (panelID === 'deptList') {
        populateDept();
      }
    }
  });
  //show hide new student form
  $(document.body).on('click', '#currentStudent', function (e) {
    e.preventDefault();
    $('#newStudentForm').hide();
    $('#searchStudentForm').fadeIn();
  });
  $(document.body).on('click', '.studentEnrollCourse', function (e) {
    e.preventDefault();
    var studentID = $(this).attr('data-studentID');
    enrollCurrentStudent(studentID);
  });
  $(document.body).on('click', '#newStudent', function (e) {
    e.preventDefault();
    $('#searchStudentForm').hide();
    $('#newStudentForm').fadeIn();
  });
  // Add User button click
  $(document.body).on('click', '#btnAddStudent', addStudent);

  // Add User button click
  $(document.body).on('click', 'a.courseEnroll', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var courseTitle = $(this).attr('data-course-title');
    var year = $(this).attr('data-offer-year');
    var deptName = $(this).attr('data-dept-name');
    var deptID = $(this).attr('data-dept-id');
    var courseObjectID = $(this).attr('data-obj-id');
    console.log('enroll!');
    $('#studentEnroll').attr('data-enroll', true)
            .attr('data-courseID', courseID)
            .attr('data-course-title', courseTitle)
            .attr('data-offer-year', year)
            .attr('data-dept-name', deptName)
            .attr('data-dept-id', deptID)
            .attr('data-obj-id', courseObjectID);
    $('#enrollTitle').find('.courseID').html(courseID);
    $('#enrollTitle').find('.courseTitle').html(courseTitle);
    $('#enrollTitle').find('.year').html(year);
    $('#enrollTitle').find('.deptName').html(deptName);
    overlay("studentEnroll");
    //overlay("studentAdd");
    //addStudent(courseID, courseTitle, courseObjectID, deptID, deptName, year, true);
  });
  $(document.body).on('click', 'a.unEnrollCourse', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var year = $(this).attr('data-offer-year');
    var studentID = $(this).attr('data-studentID');
    var fromStudent = $(this).attr('data-from-student');
    console.log('unenroll!');
    console.log('courseID:' + courseID);
    console.log('year:' + year);
    console.log('studentID:' + studentID);
    var confirmation = confirm('Are you sure you want to unenroll this student?');
    if (confirmation === true) {
      unEnrollStudent(studentID, courseID, year, fromStudent);

    } else {
      // If they said no to the confirm, do nothing
      return false;
    }
  });

  // Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  $(document.body).on('click', '.studentEnrolled', function (e) {
    e.preventDefault();
    var year = $(this).attr('data-offer-year');
    var enrolledCourseID = $(this).attr('data-id');
    populateEnrolledStudent(enrolledCourseID, year);

  });

  $(document.body).on('click', '.overlayLink', function (e) {
    var overlayTarget = $(this).attr('data-overlay');
    e.preventDefault();
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        closeOverlay();
      }
    });
    overlay(overlayTarget);
  });
  $(document.body).on('click', '.closeOverlay', function (e) {
    e.preventDefault();
    closeOverlay();
  });

});

// Functions =============================================================
function clearAllFilter() {
  $("select").prop('selectedIndex', 0);
  $('input[type=text]').val('');
}
// Fill table with data
function populateCourse() {
// Empty content string
  var tableContent = '';
  var query = {};
  var year;
  var deptID;
  year = $('#course-year').val();
  deptID = $('#course-dept').val();
  if (year !== 'all') {
    var yearQuery = {'offer.year': year};
    $.extend(query, yearQuery);
  }
  if (deptID !== 'all') {
    var deptQuery = {'dept.deptID': deptID};
    $.extend(query, deptQuery);
  }
  var url = '/courses/courselist';
  $.ajax({
    type: 'POST',
    data: query,
    url: url,
    dataType: 'JSON'
  }).done(function (data) {
    couseListData = data;
    $.each(data, function () {
      var thisID = this._id;
      var courseID = this.courseid;
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show Details">' + this.courseid + '</a></td>';
      tableContent += '<td>' + this.title + '</td>';
      tableContent += '<td>' + this.level + '</td>';
      tableContent += '<td>' + this.dept.deptName + '</td>';
      var offerCount = 0;
      var thisTitle = this.title;
      var thisDeptID = this.dept.deptID;
      var thisDeptName = this.dept.deptName;

      $.each(this.offer, function () {
        var thisOffer = [];
        thisOffer = this;
        var enrolledStudent;
        enrolledStudent = 0;
        if (thisOffer.enrolled) {
          enrolledStudent = thisOffer.enrolled.length;
        }
        ;

        if (thisOffer.year === year || $('#course-year').val() === 'all') {
          if (offerCount > 0) {
            tableContent += '</tr><tr><td colspan="4"></td>';
          }
          tableContent += '<td>' + thisOffer.year + '</td>';
          tableContent += '<td><a href="#" class="studentEnrolled overlayLink"  data-overlay="studentEnrolled" data-offer-year="' + thisOffer.year + '" data-id="' + courseID + '"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' + enrolledStudent + '</a></td>';
          tableContent += '<td>' + thisOffer.available + '/' + thisOffer.classSize + '</td>';
          tableContent += '<td><a href="#" class="courseUpdate"  data-offer-year="' + thisOffer.year + '" rel="' + thisID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
          tableContent += '<td><a href="#" class="courseDelete" data-offer-year="' + thisOffer.year + '" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
          tableContent += '<td><a href="#" class="courseEnroll" data-course-title="' + thisTitle + '" data-offer-year="' + thisOffer.year + '" data-dept-name="' + thisDeptName + '" data-dept-id="' + thisDeptID + '" data-obj-id="' + thisID + '" data-courseID="' + courseID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Enroll</a></td>';
          offerCount++;
        }
      });
      tableContent += '</tr>';
    });
    $('#courseList table tbody').html(tableContent);
  });
}
;

function populateStudent(studentName) {
// Empty content string
  var tableContent = '';
  var query = {};
  var year;
  var deptID;
  year = $('#student-course-year').val();
  deptID = $('#student-course-dept').val();
  if (studentName === '' || studentName === '') {
    studentName = null;
  }
  if (year !== 'all') {
    var yearQuery = {'enrolled.year': year};
    $.extend(query, yearQuery);
  }
  if (deptID !== 'all') {
    var deptQuery = {'enrolled.deptID': deptID};
    $.extend(query, deptQuery);
  }
  if (studentName !== null) {
    var studentQuery = {'studentName': studentName};
    $.extend(query, studentQuery);
  }
  var url = '/courses/studentlist';
  $.ajax({
    type: 'POST',
    data: query,
    url: url,
    dataType: 'JSON'
  }).done(function (data) {
    studentListData = data;
    $.each(data, function () {
      var thisID = this._id;
      var thisStudentID = this.studentID;
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show Details">' + this.studentID + '</a></td>';
      tableContent += '<td>' + this.studentName + '</td>';
      tableContent += '<td>' + formatDate(this.dob) + '</td>';
      tableContent += '<td><a href="#" class="updateStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td><a href="#" class="deleteStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';

      var enrolledCount = 0;
      if (this.enrolled && this.enrolled.length > 0) {
        $.each(this.enrolled, function () {
          var thisEnroll = [];
          thisEnroll = this;
          if ((thisEnroll.year === year || year === 'all') && (thisEnroll.deptID === deptID || deptID === 'all')) {
            if (enrolledCount > 0) {
              tableContent += '</tr><tr><td colspan="5"></td>';
            }
            tableContent += '<td>' + thisEnroll.title + '</td>';
            tableContent += '<td>' + thisEnroll.deptName + '</td>';
            tableContent += '<td>' + thisEnroll.year + '</td>';
            tableContent += '<td>' + formatDate(thisEnroll.enrolDate) + '</td>';
            tableContent += '<td><a href="#" class="unEnrollCourse" data-studentID="' + thisStudentID + '" data-courseID="' + thisEnroll.CourseID + '" data-offer-year="' + thisEnroll.year + '" data-from-student="true"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Unenroll</a></td>';
            enrolledCount++;
          }
        });
      } else {
        tableContent += '<td>--</td><td>--</td><td>--</td><td>--</td><td>--</td>';
      }
      tableContent += '</tr>';
    });

    $('#studentList table tbody').html(tableContent);
  });
}
;


function populateSearchStudent(studentName, studentID, courseID, year) {
// Empty content string
  var tableContent = '';
  var query = {};

  if (studentName === '' || typeof studentName === 'undefined') {

    studentName = null;
  }
  if (studentID === '' || typeof studentID === 'undefined') {

    studentName = null;
  }

  if (studentName !== null) {
    var studentQuery = {"studentName": {$regex: new RegExp("^" + studentName.toLowerCase(), "i")}};
    $.extend(query, studentQuery);
  }
  if (studentName !== null) {
    var studentIDQuery = {"studentID": {$regex: new RegExp("^" + studentID.toLowerCase(), "i")}};
    $.extend(query, studentIDQuery);
  }
  var url = '/courses/studentlist';
  $.ajax({
    type: 'POST',
    data: query,
    url: url,
    dataType: 'JSON'
  }).done(function (data) {
    studentListData = data;
    var hasEnrolled;
    $.each(data, function () {
      hasEnrolled = false;
      var thisID = this.studentID;
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show Details">' + this.studentID + '</a></td>';
      tableContent += '<td>' + this.studentName + '</td>';
      tableContent += '<td>' + this.dob + '</td>';
      if (this.enrolled && this.enrolled.length > 0) {

        $.each(this.enrolled, function () {
          var thisEnroll = [];
          thisEnroll = this;
          if (((thisEnroll.year === year) && (thisEnroll.CourseID === courseID))) {
            hasEnrolled = true;
          }
        });
      }
      if (hasEnrolled) {
        tableContent += '<td></td>';
      } else {
        tableContent += '<td><button type="button" data-studentID="' + thisID + '" class="studentEnrollCourse">Enroll</button></td>';
      }
      tableContent += '</tr>';
    });
    $('#searchStudentResult').fadeIn();
    $('#searchStudentResult table tbody').html(tableContent);
  });
}
;
function populateEnrolledStudent(enrolledCourseID, year) {
// Empty content string
  var tableContent = '';
  var query = {};
  query = {"enrolled.CourseID": enrolledCourseID, "enrolled.year": year};
  var url = '/courses/studentlist';
  $.ajax({
    type: 'POST',
    data: query,
    url: url,
    dataType: 'JSON'
  }).done(function (data) {
    studentListData = data;
    $.each(data, function () {
      var thisID = this._id;
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show Details">' + this.studentID + '</a></td>';
      tableContent += '<td>' + this.studentName + '</td>';
      $.each(this.enrolled, function () {
        var thisEnroll = [];
        thisEnroll = this;
        if (thisEnroll.year === year && thisEnroll.CourseID === enrolledCourseID) {
          tableContent += '<td>' + formatDate(thisEnroll.enrolDate) + '</td>';
        }
      });
      tableContent += '<td><a href="#" class="unEnrollCourse" data-studentID="' + this.studentID + '" data-courseID="' + enrolledCourseID + '" data-offer-year="' + year + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Unenroll</a></td>';
      tableContent += '</tr>';
    });
    $('#studentEnrolled table tbody').html(tableContent);
  });
}
;
function populateDept() {
  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON('/courses/deptlist', function (data) {

    // Stick our user data array into a userlist variable in the global object
    deptListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function () {
      tableContent += '<tr>';
      tableContent += '<td>' + this.deptID + '</td>';
      tableContent += '<td>' + this.deptName + '</td>';
      tableContent += '<td>' + this.location + '</td>';
      tableContent += '<td><a href="#" class="updateDept" rel="' + this._ID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td><a href="#" class="deleteDept" rel="' + this._ID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
      tableContent += '<td><a href="#" class="addCourse" rel="' + this._ID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add Course</a></td>';
      tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#deptList table tbody').html(tableContent);
  });
}
;
// enroll current student
function enrollCurrentStudent(studentID) {
  console.log('current student!!');

  var courseID = $('#studentEnroll').attr('data-courseID');
  var courseTitle = $('#studentEnroll').attr('data-course-title');
  var year = $('#studentEnroll').attr('data-offer-year');
  var deptName = $('#studentEnroll').attr('data-dept-name');
  var deptID = $('#studentEnroll').attr('data-dept-id');

  $('#studentEnroll').removeAttr('data-courseID')
          .removeAttr('data-course-title')
          .removeAttr('data-offer-year')
          .removeAttr('data-dept-name')
          .removeAttr('data-dept-id');

  // $('#studentEnroll input[type="checkbox"]:checked').each(function () {
  console.log('student:' + studentID);
  //selectStudentArr.push($(this).val());
  //var studentID = $(this).val();
  var newEnrollDate = new Date();
  var enrollInfo = {"studentID": studentID,
    "courseID": courseID,
    "deptName": deptName,
    "title": courseTitle,
    "year": year,
    "enrolDate": newEnrollDate,
    "deptID": deptID
  };
  // add student
  $.ajax({
    type: 'POST',
    data: enrollInfo,
    url: '/courses/batchUpdatestudent',
    dataType: 'JSON'
  }).done(function (response) {
    // Check for successful (blank) response
    console.log('run query search');
    if (response.msg === '') {
      studentSuccess = true;
      console.log('run query search success');
      var updateQuery = {
        "courseID": courseID,
        "year": year,
        "studentID": studentID,
        "enrolDate": newEnrollDate
      };
      $.ajax({
        type: 'POST',
        data: updateQuery,
        url: '/courses/enrollCourse',
        dataType: 'JSON'
      }).done(function (responseEnrol) {
        // Check for successful (blank) response
        if (responseEnrol.msg === '') {
          populateCourse();
          closeOverlay();
        } else {
          alert('course Error: ' + responseEnrol.msg + studentID);
        }

      });

    } else {
      alert('student Error: ' + response.msg + studentID);
    }
  });
//

  // });
}
;
// Add User
function addStudent() {
  console.log('add student!!');
  var enrollCourse;
  enrollCourse = false;
  if ($('#studentAdd').attr('data-enroll') !== '' && typeof $('#studentAdd').attr('data-enroll') !== 'undefined') {
    enrollCourse = true;
    var courseID = $('#studentAdd').attr('data-courseID');
    var courseTitle = $('#studentAdd').attr('data-course-title');
    var year = $('#studentAdd').attr('data-offer-year');
    var deptName = $('#studentAdd').attr('data-dept-name');
    var deptID = $('#studentAdd').attr('data-dept-id');
    var courseObjectID = $('#studentAdd').attr('data-obj-id');
  } else {
    enrollCourse = false;
  }
  $('#studentAdd').removeAttr('data-enroll')
          .removeAttr('data-courseID')
          .removeAttr('data-course-title')
          .removeAttr('data-offer-year')
          .removeAttr('data-dept-name')
          .removeAttr('data-dept-id')
          .removeAttr('data-obj-id');

  var newUser = {};
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#studentAdd input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {
    var studentSuccess;
    var enrollSuccess;
    enrollSuccess = false;
    studentSuccess = false;
    // new student info 
    var studentID = $('#studentAdd fieldset input#studentID').val();
    var studentName = $('#studentAdd fieldset input#studentName').val();
    var dob = $('#studentAdd fieldset input#studentDOB').val();
    var newUserInfo = {
      'studentID': studentID,
      'studentName': studentName,
      'dob': dob
    };
    newUser = newUserInfo;
    // for new enrollment
    if (enrollCourse) {
      var newEnrollDate = new Date();
      var enrollInfo = {"studentID": studentID,
        "studentName": studentName,
        "dob": dob,
        "courseID": courseID,
        "deptName": deptName,
        "title": courseTitle,
        "year": year,
        "enrolDate": newEnrollDate,
        "deptID": deptID,
        "enrolledCourseID": courseObjectID
      };
      newUser = enrollInfo;
    }
    // add student
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/courses/addStudent',
      dataType: 'JSON'
    }).done(function (response) {
      // Check for successful (blank) response
      if (response.msg === '') {
        studentSuccess = true;
      }
      // update course
      if (enrollCourse && studentSuccess) {
        console.log('enter enroll update');
        var updateQuery = {
          "courseID": courseID,
          "year": year,
          "studentID": studentID,
          "enrolDate": newEnrollDate
        };
        $.ajax({
          type: 'POST',
          data: updateQuery,
          url: '/courses/enrollCourse',
          dataType: 'JSON'
        }).done(function (responseEnrol) {
          // Check for successful (blank) response
          if (responseEnrol.msg === '') {
            enrollSuccess = true;
          }
          if (enrollSuccess) {
            // reload page
            populateCourse();
            // Clear the form inputs
            $('#studentAdd fieldset input').val('');
            // Update the table
            closeOverlay('studentAdd');
          } else {
            alert('Error: ' + responseEnrol.msg);
          }
        });
      } else {
        if (studentSuccess) {
          // reload page
          populateStudent();
          // Clear the form inputs
          $('#studentAdd fieldset input').val('');
          // Update the table
          closeOverlay('studentAdd');
        } else {
          console.log('why!!');
          alert('Error: ' + response.msg);
        }
      }
    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}
;

function unEnrollStudent(studentID, courseID, year, fromStudent) {
  console.log('unenroll');
  var query = {
    "studentID": studentID,
    "courseID": courseID,
    "year": year
  };
  $.ajax({
    type: 'POST',
    data: query,
    url: '/courses/updateStudent',
    dataType: 'JSON'
  }).done(function (response) {

    if (response.msg === '') {
      $.ajax({
        type: 'POST',
        data: query,
        url: '/courses/unEnrollCourse',
        dataType: 'JSON'
      }).done(function (response2) {

        if (response2.msg === '') {
          if (fromStudent) {
            populateStudent();
          } else {
            populateCourse();
            closeOverlay();
          }
        } else {
          alert('course unenroll Error: ' + response2.msg);
        }
      });
    } else {
      alert(' student unenroll Error: ' + response.msg);
    }
  });
}
;
//// Show User Info
//function showUserInfo(event) {
//  // Prevent Link from Firing
//  event.preventDefault();
//  // Retrieve username from link rel attribute
//  var thisUserName = $(this).attr('rel');
//  // Get Index of object based on id value
//  var arrayPosition = userListData.map(function (arrayItem) {
//    return arrayItem.username;
//  }).indexOf(thisUserName);
//  // Get our User Object
//  var thisUserObject = userListData[arrayPosition];
//  //Populate Info Box
//  $('#userInfoName').text(thisUserObject.fullname);
//  $('#userInfoAge').text(thisUserObject.age);
//  $('#userInfoGender').text(thisUserObject.gender);
//  $('#userInfoLocation').text(thisUserObject.location);
//}
//;

// Delete User
function deleteUser(event) {

  event.preventDefault();
  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');
  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function (response) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      } else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();
    });
  } else {

    // If they said no to the confirm, do nothing
    return false;
  }

}
;
function closeOverlay(id, callback) {
  $('html').css('overflow-y', 'auto');
  if (id === undefined || id === '') {
    $('.overlay').fadeOut();
    // mark the modal window as hidden
    $('.overlay').attr('aria-hidden', 'true');
  } else {
    $('#' + id).fadeOut();
    // mark the modal window as hidden
    $('#' + id).attr('aria-hidden', 'true');
  }

}

function overlay(id, callback) {
  $('#' + id).fadeIn();
  $('#' + id).attr('aria-hidden', 'false');
  $('html').css('overflow-y', 'hidden');
  if (callback) {
    var fn = window[callback];
    fn();
  }
}

function formatDate(date) {
  var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}