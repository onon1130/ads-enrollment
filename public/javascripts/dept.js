// DOM Ready =============================================================
$(document).ready(function () {

// show add student form
  $(document.body).on('click', '#btnAddDept', addDept);
  
  //action show edit dept
  $(document.body).on('click', 'a.updateDept', function (e) {
    e.preventDefault();
    var deptID = $(this).attr('data-deptID');
    var deptName = $(this).attr('data-deptName');
    var location = $(this).attr('data-location');
    var coursenum = $(this).attr('data-coursenum');
    console.log('studentID:' + deptID);
    console.log('deptName:' + deptName);
    console.log('location:' + location);
    
    $('#editdeptID').val(deptID);
    $('#editdeptName').val(deptName);
    $('#editlocation').val(location);
    overlay("deptEdit");
  });//action update student
  $(document.body).on('click', '#btnEditDept', function (e) {
    e.preventDefault();
    
    var deptID = $('#editdeptID').val();
    var deptName = $('#editdeptName').val();
    var location = $('#editlocation').val();
    var confirmation = confirm('Are you sure you want to update the Deparment info?');
    if (confirmation === true) {
      updateDeptInfo(deptID, deptName, location);
    } else {
      // If they said no to the confirm, do nothing
      return false;
    }
  });
  $(document.body).on('click', '.deleteDept', deleteDept);
});

// Functions =============================================================
function populateDept() {
  var tableContent = '';
  $.getJSON('/courses/deptlist', function (data) {
    deptListData = data;
    $.each(data, function () {
      var enrolledCount = 0;
      if (this.enrolled && this.enrolled.length > 0) {
        enrolledCount = this.enrolled.length;
      }
      var thisID = this._id;
      tableContent += '<tr>';
      tableContent += '<td>' + this.deptID + '</td>';
      tableContent += '<td>' + this.deptName + '</td>';
      tableContent += '<td>' + this.location + '</td>';
      tableContent += '<td>' + this.numberOfCourse + '</td>';
      tableContent += '<td class="trigger-btn"><a href="#" class="updateDept" data-deptID="' + this.deptID + '" data-deptName="' + this.deptName + '" data-location="' + this.location + '" data-coursenum="'+this.numberOfCourse+'" rel="' + this._ID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td class="trigger-btn"><a href="#" class="deleteDept" data-deptID="' + this.deptID + '" data-coursenum="'+this.numberOfCourse+'" rel="' + thisID+ '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
      tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#deptList table tbody').html(tableContent);
  });
}
function addDept() {
  console.log('add Dept!!');
  var errorCount = 0;
  $('#deptAdd input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {

    // new student info 
    var deptID = $('#deptAdd fieldset input#newdeptID').val();
    var deptName = $('#deptAdd fieldset input#newdeptName').val();
    var location = $('#deptAdd fieldset input#newlocation').val();
    var newDept = {
      'deptID': deptID,
      'deptName': deptName,
      'location': location
    };

    $.ajax({
      type: 'POST',
      data: newDept,
      url: '/courses/addDept',
      dataType: 'JSON'
    }).done(function (response) {
      // Check for successful (blank) response
      if (response.msg === '') {

        populateDept();

        $('#deptAdd fieldset input').val('');
        // Update the table
        closeOverlay('deptAdd');
      } else {
        alert('Error: ' + response.msg);
      }

    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}
// update Dept
function updateDeptInfo() {
  console.log('update Dept!!');
  var errorCount = 0;
  $('#deptEdit input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {

    // new student info 
    var deptID = $('#deptEdit fieldset input#editdeptID').val();
    var deptName = $('#deptEdit fieldset input#editdeptName').val();
    var location = $('#deptEdit fieldset input#editlocation').val();
    var newDept = {
      'deptID': deptID,
      'deptName': deptName,
      'location': location
    };

    $.ajax({
      type: 'POST',
      data: newDept,
      url: '/courses/updateDeptInfo',
      dataType: 'JSON'
    }).done(function (response) {
      // Check for successful (blank) response
      if (response.msg === '') {

        populateDept();

        $('#deptEdit fieldset input').val('');
        // Update the table
        closeOverlay('deptEdit');
      } else {
        alert('Error: ' + response.msg);
      }

    });
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
}
// Delete Dept
function deleteDept(event) {

  event.preventDefault();
  //var studentID = $(this).attr('data-studentID');
  var coursenum = parseInt($(this).attr('data-coursenum'));
  console.log('coursenum:' + coursenum);
  if (coursenum === 0) {
    console.log('delete dept:' + coursenum);
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Department?');
    // Check and make sure the user confirmed
    if (confirmation === true) {

      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/courses/deleteDept/' + $(this).attr('rel')
      }).done(function (response) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        } else {
          alert('Error: ' + response.msg);
        }

        // Update the table
        populateDept();
      });
    } else {

      // If they said no to the confirm, do nothing
      return false;
    }
  } else {
    alert('Deppartment cannot be deleted with class offered.');
  }

}