// DOM Ready =============================================================
$(document).ready(function () {



});

// Functions =============================================================
function populateDept() {
  var tableContent = '';
  $.getJSON('/courses/deptlist', function (data) {
    deptListData = data;
    $.each(data, function () {
      tableContent += '<tr>';
      tableContent += '<td>' + this.deptID + '</td>';
      tableContent += '<td>' + this.deptName + '</td>';
      tableContent += '<td>' + this.location + '</td>';
      tableContent += '<td>' + this.numberOfCourse + '</td>';
      tableContent += '<td><a href="#" class="updateDept" rel="' + this._ID + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></td>';
      tableContent += '<td><a href="#" class="deleteDept" rel="' + this._ID + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></td>';
      tableContent += '<td><a href="#" class="addCourse" rel="' + this._ID + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add Course</a></td>';
      tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#deptList table tbody').html(tableContent);
  });
}