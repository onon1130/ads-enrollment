// DOM Ready =============================================================
$(document).ready(function () {
  $(document.body).on('click', '#student-filter-trigger', function (e) {
    e.preventDefault();
    var studentName = $('#student-name').val();
    populateStudent(studentName);
  });
  // show add student form
  $(document.body).on('click', '#btnAddStudent', addStudent);

});

// Functions =============================================================
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
      tableContent += '<td><span class="glyphicon glyphicon-user" aria-hidden="true"></span> ' + this.studentName + '</td>';
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
            tableContent += '<td>' + thisEnroll.CourseID + '</td>';
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