// DOM Ready =============================================================
$(document).ready(function () {
  $(document.body).on('click', '#student-filter-trigger', function (e) {
    e.preventDefault();
    var studentName = $('#student-name').val();
    populateStudent(studentName);
  });
  // show add student form
  $(document.body).on('click', '#btnAddStudent', addStudent);
  //action show edit student
  $(document.body).on('click', 'a.updateStudent', function (e) {
    e.preventDefault();
    var studentID = $(this).attr('data-studentID');
    var studentName = $(this).attr('data-studentName');
    var dob = $(this).attr('data-dob');

    console.log('studentID:' + studentID);
    console.log('studentName:' + studentName);
    console.log('dob:' + dob);
    $('#studentEdit').attr('data-studentID', studentID);
    $('#editStudentID').val(studentID);
    $('#editStudentName').val(studentName);
    $('#EditStudentDOB').val(dob);
    overlay("studentEdit");
  });
  //action edit student
  $(document.body).on('click', '#btnEditStudent', function (e) {
    e.preventDefault();
    var studentID = $('#studentEdit').attr('data-studentID');
    var studentName = $('#editStudentName').val();
    var dob = $('#EditStudentDOB').val();

    var confirmation = confirm('Are you sure you want to update the student info?');
    if (confirmation === true) {
      updateStudent(studentID, studentName, dob);
    } else {
      // If they said no to the confirm, do nothing
      return false;
    }
  });
  // delete student
  $(document.body).on('click', '.deleteStudent', deleteStudent);
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
      var enrolledCount = 0;
      if (this.enrolled && this.enrolled.length > 0) {
        enrolledCount = this.enrolled.length;
      }
      tableContent += '<tr>';
      tableContent += '<td>' + thisStudentID + '</td>';
      tableContent += '<td><span class="glyphicon glyphicon-user" aria-hidden="true"></span> ' + this.studentName + '</td>';
      tableContent += '<td>' + formatDate(this.dob) + '</td>';
      tableContent += '<td class="trigger-btn"><a href="#" class="updateStudent" data-studentName="' + this.studentName + '" data-studentID="' + thisStudentID + '" data-dob="' + formatDate(this.dob) + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td class="trigger-btn"><a href="#" class="deleteStudent" data-studentID="' + thisStudentID + '" data-enrolled="' + enrolledCount + '" rel="' + this._id + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';

      enrolledCount = 0;
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
            tableContent += '<td class="trigger-btn"><a href="#" class="unEnrollCourse" data-studentID="' + thisStudentID + '" data-courseID="' + thisEnroll.CourseID + '" data-offer-year="' + thisEnroll.year + '" data-from-student="true"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Unenroll</a></td>';
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
//  if ($('#studentAdd').attr('data-enroll') !== '' && typeof $('#studentAdd').attr('data-enroll') !== 'undefined') {
//    enrollCourse = true;
//    var courseID = $('#studentAdd').attr('data-courseID');
//    var courseTitle = $('#studentAdd').attr('data-course-title');
//    var year = $('#studentAdd').attr('data-offer-year');
//    var deptName = $('#studentAdd').attr('data-dept-name');
//    var deptID = $('#studentAdd').attr('data-dept-id');
//    var courseObjectID = $('#studentAdd').attr('data-obj-id');
//  } else {
//    enrollCourse = false;
//  }
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
//    // for new enrollment
//    if (enrollCourse) {
//      var newEnrollDate = new Date();
//      var enrollInfo = {"studentID": studentID,
//        "studentName": studentName,
//        "dob": dob,
//        "courseID": courseID,
//        "deptName": deptName,
//        "title": courseTitle,
//        "year": year,
//        "enrolDate": newEnrollDate,
//        "deptID": deptID,
//        "enrolledCourseID": courseObjectID
//      };
//      newUser = enrollInfo;
//    }
    // add student
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/courses/addStudent',
      dataType: 'JSON'
    }).done(function (response) {
      // Check for successful (blank) response
      if (response.msg === '') {
        //studentSuccess = true;
        populateStudent();
        // Clear the form inputs
        $('#studentAdd fieldset input').val('');
        // Update the table
        closeOverlay('studentAdd');
      } else {
        alert('Error: ' + response.msg);
      }
      // update course
//      if (enrollCourse && studentSuccess) {
//        console.log('enter enroll update');
//        var updateQuery = {
//          "courseID": courseID,
//          "year": year,
//          "studentID": studentID,
//          "enrolDate": newEnrollDate
//        };
//        $.ajax({
//          type: 'POST',
//          data: updateQuery,
//          url: '/courses/enrollCourse',
//          dataType: 'JSON'
//        }).done(function (responseEnrol) {
//          // Check for successful (blank) response
//          if (responseEnrol.msg === '') {
//            enrollSuccess = true;
//          }
//          if (enrollSuccess) {
//            // reload page
//            populateCourse();
//            // Clear the form inputs
//            $('#studentAdd fieldset input').val('');
//            // Update the table
//            closeOverlay('studentAdd');
//          } else {
//            alert('Error: ' + responseEnrol.msg);
//          }
//        });
//      } else {
//        if (studentSuccess) {
//          // reload page
//          populateStudent();
//          // Clear the form inputs
//          $('#studentAdd fieldset input').val('');
//          // Update the table
//          closeOverlay('studentAdd');
//        } else {
//          console.log('why!!');
//          alert('Error: ' + response.msg);
//        }
      // }
    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}// update Student
function updateStudent(studentID, studentName, dob) {
  console.log('studentID:' + studentID);
  console.log('studentName:' + dob);
  var errorCount = 0;
  $('#studentEdit input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    var updateStudent = {
      "studentID": studentID,
      "studentName": studentName,
      "dob": dob
    };
    $.ajax({
      type: 'POST',
      data: updateStudent,
      url: '/courses/updateStudentInfo',
      dataType: 'JSON'
    }).done(function (response) {

      if (response.msg === '') {
        populateStudent();
        closeOverlay('studentEdit');
      } else {
        alert('Error student update: ' + response.msg);
      }
    });

  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }

}
// Delete Student
function deleteStudent(event) {

  event.preventDefault();
  //var studentID = $(this).attr('data-studentID');
  var enrolled = parseInt($(this).attr('data-enrolled'));
  console.log('enrolled:' + enrolled);
  if (enrolled === 0) {
    console.log('delete student:' + enrolled);
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this student?');
    // Check and make sure the user confirmed
    if (confirmation === true) {

      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/courses/deleteStudent/' + $(this).attr('rel')
      }).done(function (response) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        } else {
          alert('Error: ' + response.msg);
        }

        // Update the table
        populateStudent();
      });
    } else {

      // If they said no to the confirm, do nothing
      return false;
    }
  } else {
    alert('Student cannot be deleted with class enrolled.');
  }

}