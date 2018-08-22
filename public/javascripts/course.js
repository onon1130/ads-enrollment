
// DOM Ready =============================================================
$(document).ready(function () {
  //action course filter
  $(document.body).on('change', '#course-year, #course-dept', function (e) {
    console.log('change!');
    populateCourse();
  });
  //Show search student to enroll
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
  // action search student
  $(document.body).on('click', '#btnSearchStudent', function (e) {
    e.preventDefault();
    var courseID = $('#studentEnroll').attr('data-courseID');
    var year = $('#studentEnroll').attr('data-offer-year');
    var studentName = $('#searchStudentName').val();
    var studentID = $('#searchStudentID').val();
    populateSearchStudent(studentName, studentID, courseID, year);
  });
  // action enroll searched student
  $(document.body).on('click', '.studentEnrollCourse', function (e) {
    e.preventDefault();
    var studentID = $(this).attr('data-studentID');
    enrollCurrentStudent(studentID);
  });
  //show course enrolled student
  $(document.body).on('click', '.studentEnrolled', function (e) {
    e.preventDefault();
    var year = $(this).attr('data-offer-year');
    var enrolledCourseID = $(this).attr('data-id');
    populateEnrolledStudent(enrolledCourseID, year);

  });
  // action unenroll searched student
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
  //action add course
  $(document.body).on('click', '#btnAddCourse', function (e) {
    e.preventDefault();
    addCourse();
  });
  //action show edit course
  $(document.body).on('click', 'a.courseUpdate', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var courseTitle = $(this).attr('data-course-title');
    var level = $(this).attr('data-level');
    var deptName = $(this).attr('data-dept-name');
    var deptID = $(this).attr('data-dept-id');
    console.log('courseID:' + courseID);
    console.log('courseTitle:' + courseTitle);
    console.log('level:' + level);
    console.log('deptName:' + deptName);
    console.log('deptID:' + deptID);
    $('#courseEdit').attr('data-current-CourseID', courseID)
//            .attr('data-course-title', courseTitle)
//            .attr('data-level', level)
//            .attr('data-dept-name', deptName)
            .attr('data-current-dept-id', deptID);
    $('#editCourseID').val(courseID);
    $('#editCourseTitle').val(courseTitle);
    $('#editCourseLevel').val(level);
    $('#editCourseDept').val(deptID);

    overlay("courseEdit");
  });
  //action edit course
  $(document.body).on('click', '#btnEditCourse', function (e) {
    e.preventDefault();
    var currentCourseID = $('#courseEdit').attr('data-current-CourseID');
    var currentDeptID = $('#courseEdit').attr('data-current-dept-id');
    var newCourseID = $('#editCourseID').val();
    var newTitle = $('#editCourseTitle').val();
    var newLevel = $('#editCourseLevel').val();
    var newDeptID = $('#editCourseDept').val();
    var newDeptName = $('#editCourseDept option:selected').text();

    var confirmation = confirm('Are you sure you want to update the course info? This will affect the course offers and enrolled students');
    if (confirmation === true) {
      updateCourse(currentCourseID, currentDeptID, newCourseID, newTitle, newLevel, newDeptID, newDeptName);
    } else {
      // If they said no to the confirm, do nothing
      return false;
    }
  });
  //action show add course offer
  $(document.body).on('click', 'a.courseAddOffer', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var courseTitle = $(this).attr('data-course-title');
    console.log('courseID:' + courseID);
    console.log('courseTitle:' + courseTitle);
    $('#courseOfferAdd').attr('data-CourseID', courseID);
    $('#courseOfferAdd').find('.newTitle .courseID').html(courseID);
    $('#courseOfferAdd').find('.newTitle .courseTitle').html(' - ' + courseTitle);
    overlay("courseOfferAdd");
  });
  //action add course 
  $(document.body).on('click', '#btnAddCourseOffer', function (e) {
    e.preventDefault();
    addCourseOffer();
  });
  //action delete course offer 
  $(document.body).on('click', '.offerDelete', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var year = $(this).attr('data-offer-year');
    var enrolled = parseInt($(this).attr('data-enrolled-student'));
    console.log('delete courseID:' + courseID);
    console.log('delete year:' + year);
    console.log('delete enrolled:' + enrolled);
    if (enrolled > 0) {
      alert("Course with student enrolled cannot be deleted.");
      return false;
    } else {
      var confirmation = confirm('Are you sure you want to delete the offer of this course?');
      if (confirmation === true) {
        deleteCourseOffer(courseID, year);
      } else {
        // If they said no to the confirm, do nothing
        return false;
      }
    }
  });


  //action show edit course offer
  $(document.body).on('click', 'a.offerUpdate', function (e) {
    e.preventDefault();
    var courseID = $(this).attr('data-courseID');
    var courseTitle = $(this).attr('data-course-title');
    var year = $(this).attr('data-offer-year');
    var courseSize = $(this).attr('data-course-size');
    var available = $(this).attr('data-course-available');
    var deptName = $(this).attr('data-dept-name');
    var deptID = $(this).attr('data-dept-id');
    console.log('courseID:' + courseID);
    console.log('courseTitle:' + courseTitle);
    console.log('year:' + year);
    console.log('courseSize:' + available);
    console.log('available:' + courseSize);
    console.log('deptName:' + deptName);
    console.log('deptID:' + deptID);
    $('#courseOfferEdit').find('.newTitle .courseID').html(courseID);
    $('#courseOfferEdit').find('.newTitle .courseTitle').html(' - ' + courseTitle);
    $('#courseOfferEdit').attr('data-CourseID', courseID)
            .attr('data-current-year', year)
            .attr('data-available', available)
            .attr('data-courseSize', courseSize)
            .attr('data-offer-year', year);
    $('#editCourseOfferSize').val(courseSize);
    $('#editCourseOfferYear').val(year);

    overlay("courseOfferEdit");
  });
  //action edit course offer
  $(document.body).on('click', '#btnUpdateCourseOffer', function (e) {
    e.preventDefault();
    var courseID = $('#courseOfferEdit').attr('data-CourseID');
    var currentYear = $('#courseOfferEdit').attr('data-current-year');
    var currentCourseSize = parseInt($('#courseOfferEdit').attr('data-courseSize'));
    var available = parseInt($('#courseOfferEdit').attr('data-available'));
    var newYear = $('#editCourseOfferYear').val();
    var newCourseSize = parseInt($('#editCourseOfferSize').val());
    var enrolled = currentCourseSize - available;
    var newAvailable = parseInt(newCourseSize - enrolled);
    console.log('newYear :' + newYear);
    console.log('currentYear :' + currentYear);
    console.log('newCourseSize :' + newCourseSize);
    console.log('enrolled :' + enrolled);
    console.log('currentCourseSize :' + currentCourseSize);
    console.log('available :' + available);
    console.log('newAvailable :' + newAvailable);
    if (enrolled > newCourseSize) {
      alert('There has already ' + enrolled + ' students enrolled, please set the class size to not lower than the enrolled student number.');
    } else {
      var confirmation = confirm('Are you sure you want to update the class info? This will affect the enrolled students of this class');
      if (confirmation === true) {
        updateCourseOffer(courseID, currentYear, newYear, newCourseSize, newAvailable);
      } else {
        // If they said no to the confirm, do nothing
        return false;
      }
    }
  });
});

// Functions =============================================================
function populateCourse() {
// Empty content string
  var tableContent = '';
  var query = {};
  var year;
  var deptID;
  year = $('#course-year').val();
  deptID = $('#course-dept').val();
  console.log('deptID:' + deptID);
  console.log('year:' + year);

  if (year !== 'all') {
    var yearQuery = {'offer.year': year};
    $.extend(query, yearQuery);
  }
  if (deptID !== 'all' && deptID !== null) {

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
      tableContent += '<td>' + courseID + '</td>';
      tableContent += '<td>' + this.title + '</td>';
      tableContent += '<td>' + this.level + '</td>';
      tableContent += '<td>' + this.dept.deptName + '</td>';
      tableContent += '<td><a href="#" class="courseUpdate" data-course-title="' + this.title + '" data-dept-name="' + this.dept.deptName + '" data-dept-id="' + this.dept.deptID + '" data-courseID="' + courseID + '" data-level="' + this.level + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td><a href="#" class="courseDelete" data-dept-name="' + this.dept.deptName + '" data-dept-id="' + this.dept.deptID + '" data-obj-id="' + thisID + '" data-courseID="' + courseID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
      tableContent += '<td><a href="#" class="courseAddOffer" data-course-title="' + this.title + '" data-courseID="' + courseID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add year</a></td>';
      var offerCount = 0;
      var thisTitle = this.title;
      var thisDeptID = this.dept.deptID;
      var thisDeptName = this.dept.deptName;
      if (this.offer) {
        if (this.offer.length > 0) {
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
                tableContent += '</tr><tr><td colspan="7"></td>';
              }
              tableContent += '<td>' + thisOffer.year + '</td>';
              tableContent += '<td><a href="#" class="studentEnrolled overlayLink"  data-overlay="studentEnrolled" data-offer-year="' + thisOffer.year + '" data-id="' + courseID + '"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' + enrolledStudent + '</a></td>';

              var availablePercent = parseInt(((thisOffer.available) / thisOffer.classSize) * 100);
              var progressCSS = "success";
              if (availablePercent < 100 && availablePercent > 65) {
                progressCSS = "info";
              } else if (availablePercent <= 65 && availablePercent > 20) {
                progressCSS = "warning";
              } else if (availablePercent <= 20) {
                progressCSS = "danger";
              }
              tableContent += '<td><div class="progress">';
              tableContent += '<div class="progress-bar progress-bar-' + progressCSS + '" style="width: ' + availablePercent + '%" aria-valuenow="' + (thisOffer.classSize - thisOffer.available) + '" aria-valuemin="0" aria-valuemax="' + thisOffer.classSize + '"></div></div>';
              tableContent += '<div>' + thisOffer.available + '/' + thisOffer.classSize + '</div></td>';
              tableContent += '<td><a href="#" class="offerUpdate" data-course-title="' + thisTitle + '" data-dept-name="' + thisDeptName + '" data-dept-id="' + thisDeptID + '" data-offer-year="' + thisOffer.year + '" data-courseID="' + courseID + '" data-course-size="' + thisOffer.classSize + '" data-course-available="' + thisOffer.available + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
              tableContent += '<td><a href="#" class="offerDelete" data-offer-year="' + thisOffer.year + '" data-courseID="' + courseID + '" data-enrolled-student="' + (thisOffer.classSize - thisOffer.available) + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
              tableContent += '<td><a href="#" class="courseEnroll" data-course-title="' + thisTitle + '" data-offer-year="' + thisOffer.year + '" data-dept-name="' + thisDeptName + '" data-dept-id="' + thisDeptID + '" data-obj-id="' + thisID + '" data-courseID="' + courseID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Enroll</a></td>';
              offerCount++;
            }
          });
        } else {
          tableContent += '<td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td>';
        }
      } else {

        tableContent += '<td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td>';
      }
      tableContent += '</tr>';
    });
    $('#courseList table tbody').html(tableContent);
  });
}

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
      tableContent += '<td><a href="#" rel="' + this._id + '">' + this.studentID + '</a></td>';
      tableContent += '<td><span class="glyphicon glyphicon-user" aria-hidden="true"></span> ' + this.studentName + '</td>';
      tableContent += '<td>' + formatDate(this.dob) + '</td>';
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
        tableContent += '<td><button type="button" class="btn btn-primary studentEnrollCourse" data-studentID="' + thisID + '">Enroll</button></td>';
      }
      tableContent += '</tr>';
    });
    $('#searchStudentResult').fadeIn();
    $('#searchStudentResult table tbody').html(tableContent);
  });
}

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
          $('#searchStudentResult').hide();
        } else {
          alert('course Error: ' + responseEnrol.msg + studentID);
        }

      });

    } else {
      alert('student Error: ' + response.msg + studentID);
    }
  });
}

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

function addCourse() {
  var errorCount = 0;
  $('#courseAdd input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    var courseID = $('#newCourseID').val();
    var courseTitle = $('#newCourseTitle').val();
    var year = $('#newCourseYear').val();
    var level = $('#newCourseLevel').val();
    var deptName = $('#newCourseDept option:selected').text();
    var deptID = $('#newCourseDept').val();
    var classSize = $('#newCourseSize').val();
    console.log('add course');
    console.log('courseID:' + courseID);
    console.log('courseTitle:' + courseTitle);
    console.log('year:' + year);
    console.log('level:' + level);
    console.log('deptName:' + deptName);
    console.log('deptID:' + deptID);
    console.log('classSize:' + classSize);
    var newCourse = {
      "courseID": courseID,
      "courseTitle": courseTitle,
      "year": year,
      "level": level,
      "deptName": deptName,
      "deptID": deptID,
      "classSize": classSize
    };
    $.ajax({
      type: 'POST',
      data: newCourse,
      url: '/courses/addCourse',
      dataType: 'JSON'
    }).done(function (response) {

      if (response.msg === '') {
        $.ajax({
          type: 'POST',
          data: newCourse,
          url: '/courses/updateDept',
          dataType: 'JSON'
        }).done(function (response) {
          // Check for successful (blank) response
          if (response.msg === '') {
            populateCourse();
            closeOverlay('courseAdd');
          } else {
            alert('Error dept: ' + response.msg);
          }
        });
      } else {
        alert('Error course: ' + response.msg);
      }
    });

  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}

function addCourseOffer() {
  var errorCount = 0;
  $('#courseOfferAdd input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    var courseID = $('#courseOfferAdd').attr('data-CourseID');
    var year = $('#newCourseOfferYear').val();
    var classSize = $('#newCourseOfferSize').val();
    console.log('add course offer');
    console.log('courseID:' + courseID);

    console.log('year:' + year);

    console.log('classSize:' + classSize);
    var newCourseOffer = {
      "courseID": courseID,
      "year": year,
      "classSize": classSize
    };
    $.ajax({
      type: 'POST',
      data: newCourseOffer,
      url: '/courses/addCourseOffer',
      dataType: 'JSON'
    }).done(function (response) {

      if (response.msg === '') {

        populateCourse();
        closeOverlay('courseOfferAdd');

      } else {
        alert('Error course offer add : ' + response.msg);
      }
    });

  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}

function deleteCourseOffer(courseID, year) {

  console.log('courseID:' + courseID);

  console.log('year:' + year);

  var deleteOffer = {
    "courseID": courseID,
    "year": year
  };
  $.ajax({
    type: 'POST',
    data: deleteOffer,
    url: '/courses/deleteCourseOffer',
    dataType: 'JSON'
  }).done(function (response) {

    if (response.msg === '') {

      populateCourse();

    } else {
      alert('Error course offer delete : ' + response.msg);
    }
  });
}
// update course
function updateCourse(currentCourseID, currentDeptID, newCourseID, newTitle, newLevel, newDeptID, newDeptName) {
  console.log('currentCourseID:' + currentCourseID);
  console.log('newTitle:' + newTitle);
  console.log('newLevel:' + newLevel);
  var errorCount = 0;
  $('#courseEdit input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    var updateCourse = {
      "courseID": currentCourseID,
      "courseTitle": newTitle,
      "level": newLevel
    };
    var updateStudent = {
      "courseID": currentCourseID,
      "courseTitle": newTitle
    };
    $.ajax({
      type: 'POST',
      data: updateCourse,
      url: '/courses/updateCourseInfo',
      dataType: 'JSON'
    }).done(function (response) {

      if (response.msg === '') {
        //       alert('success');
        $.ajax({
          type: 'POST',
          data: updateStudent,
          url: '/courses/updateStudentCourseInfo',
          dataType: 'JSON'
        }).done(function (response) {
          // Check for successful (blank) response
          if (response.msg === '') {
            populateCourse();
            closeOverlay('courseEdit');
          } else {
            alert('Error student: ' + response.msg);
          }
        });
      } else {
        alert('Error course update: ' + response.msg);
      }
    });

  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }

}

// update offer
function updateCourseOffer(courseID, currentYear, newYear, newCourseSize, newAvailable) {
  var errorCount = 0;
  $('#courseOfferEdit input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  if (errorCount === 0) {
    var updateOffer = {
      "courseID": courseID,
      "year": currentYear,
      "ClassSize": newCourseSize,
      "available": newAvailable
    };
    $.ajax({
      type: 'POST',
      data: updateOffer,
      url: '/courses/updateOfferInfo',
      dataType: 'JSON'
    }).done(function (response) {
      if (response.msg === '') {
        populateCourse();
        closeOverlay('courseOfferEdit');
      } else {
        alert('Error course offer update: ' + response.msg);
      }
    });

  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }

}
