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
    console.log('student click!');
    var studentName = $('#student-name').val();
    populateStudent(studentName);
  });
  $(document.body).on('click', '.list-tabs a', function (e) {
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
  // Add User button click
  $('#btnAddStudent').on('click', addStudent);

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
      $.each(this.offer, function () {
        var thisOffer = [];
        thisOffer = this;
        if (thisOffer.year === year || $('#course-year').val() === 'all') {
          if (offerCount > 0) {
            tableContent += '</tr><tr><td colspan="4"></td>';
          }
          tableContent += '<td>' + thisOffer.year + '</td>';
          tableContent += '<td><a href="#" class="studentEnrolled overlayLink"  data-overlay="studentEnrolled" data-offer-year="' + thisOffer.year + '" data-id="' + courseID + '"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' + thisOffer.enrolled.length + '</a></td>';
          tableContent += '<td>' + thisOffer.available + '/' + thisOffer.classSize + '</td>';
          tableContent += '<td><a href="#" class="updateCourse"  data-offer-year="' + thisOffer.year + '" rel="' + thisID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
          tableContent += '<td><a href="#" class="deleteCourse" data-offer-year="' + thisOffer.year + '" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
          tableContent += '<td><a href="#" class="enrollCourse" data-offer-year="' + thisOffer.year + '" rel="' + thisID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Enroll</a></td>';
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
  console.log('dept:' + $('#student-course-dept').val());
  console.log('year:' + $('#student-course-year').val());
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
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '" title="Show Details">' + this.studentID + '</a></td>';
      tableContent += '<td>' + this.studentName + '</td>';
      tableContent += '<td>' + this.dob + '</td>';

      var enrolledCount = 0;
      if (this.enrolled !== undefined ) {
      $.each(this.enrolled, function () {
        var thisEnroll = [];
        thisEnroll = this;
        if ((thisEnroll.year === year || year === 'all') && (thisEnroll.deptID === deptID || deptID === 'all')) {
          if (enrolledCount > 0) {
            tableContent += '</tr><tr><td colspan="3"></td>';
          }
          tableContent += '<td>' + thisEnroll.title + '</td>';
          tableContent += '<td>' + thisEnroll.deptName + '</td>';
          tableContent += '<td>' + thisEnroll.year + '</td>';
          tableContent += '<td>' + thisEnroll.enrolDate + '</td>';
          tableContent += '<td><a href="#" class="updateStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
          tableContent += '<td><a href="#" class="deleteStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
          tableContent += '<td><a href="#" class="enrollStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Enroll</a></td>';
          enrolledCount++;
        }
      });
    } else {
      tableContent += '<td>--</td><td>--</td><td>--</td><td>--</td>';
      tableContent += '<td><a href="#" class="updateStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
          tableContent += '<td><a href="#" class="deleteStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
      tableContent += '<td><a href="#" class="enrollStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Enroll</a></td>';
    }
      tableContent += '</tr>';
    });
    
    $('#studentList table tbody').html(tableContent);
  });
}
;
function populateEnrolledStudent(enrolledCourseID, year) {
// Empty content string
  var tableContent = '';
  var query = {};
  console.log('enrolledCourseID:' + enrolledCourseID);
  console.log('year:' + year);

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

          tableContent += '<td>' + thisEnroll.enrolDate + '</td>';

        }
      });

      tableContent += '<td><a href="#" class="deleteStudent" rel="' + thisID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Unenroll</a></td>';









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

// Add User
function addStudent(event) {
  event.preventDefault();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#studentAdd input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'studentID': $('#studentAdd fieldset input#studentIDName').val(),
      'studentName': $('#studentAdd fieldset input#studentName').val(),
      'dob': $('#studentAdd fieldset input#studentDOB').val()
      
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/courses/addStudent',
      dataType: 'JSON'
    }).done(function (response) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#studentAdd fieldset input').val('');
        // Update the table
         closeOverlay('studentAdd');
        populateStudent();
      } else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}
;


// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();
  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');
  // Get Index of object based on id value
  var arrayPosition = userListData.map(function (arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUserName);
  // Get our User Object
  var thisUserObject = userListData[arrayPosition];
  //Populate Info Box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
}
;
// Add User
function addUser(event) {
  event.preventDefault();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function (response) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');
        // Update the table
        populateTable();
      } else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}
;
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