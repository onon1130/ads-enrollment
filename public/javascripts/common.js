var userListData = [];
var couseListData = [];
var deptListData = [];
var studentListData = [];

// DOM Ready =============================================================
$(document).ready(function () {
  listDeptSelect();
  populateCourse();
  listDeptSelectMulti();
  // tab actions
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
  //overlays
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
//  $(document.body).on('click','.dropdown-menu'), function (e) {
//    e.preventDefault();
//    e.stopPropagation();
//  };
 $(document.body).on('click', '.dropdown-toggle', function (e) {
  $(this).next().toggle();
});
$(document.body).on('click', '.close-dropdown', function (e) {
  $(this).parents('.dropdown-menu').toggle();
});
$(document.body).on('click', '.dropdown-menu.keep-open', function (e) {
  e.stopPropagation();
});


//  $(document.body).on('click', '.keep-open', function (e) {
//    if (/input|label/i.test(e.target.tagName)) {
//      var parent = $(e.target).parent();
//      if (parent.hasClass('checkbox')) {
//        var checkbox = parent.find('input[type=checkbox]');
//        checkbox.prop("checked", !checkbox.prop("checked"));
//        return false;
//      }
//    }
//  });
});

// Functions =============================================================
function clearAllFilter() {
  $("select").prop('selectedIndex', 0);
  $('input[type=text]').val('');
}

function closeOverlay(id, callback) {
  $('html').css('overflow-y', 'auto');
  if (id === undefined || id === '') {
    $('.overlay').fadeOut();
    $('.overlay').attr('aria-hidden', 'true');
  } else {
    $('#' + id).fadeOut();
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

function listDeptSelect() {


  $('.deptlistselect').each(function (index) {
    var $thisSelect = $(this);
    $thisSelect.html('');
    var selectOption = '';
    var thisID = $thisSelect.attr('id');
    if (thisID !== 'newCourseDept') {
      selectOption += '<option value="all" selected="selected">All</option>';
    }
    $.getJSON('/courses/deptlist', function (data) {
      deptListData = data;
      $.each(data, function () {
        selectOption += '<option value="' + this.deptID + '">' + this.deptName + '</option>';
      });
      $thisSelect.html(selectOption);
    });
  });
}
function listDeptSelectMulti() {


  $('.deptlistdropdown').each(function (index) {
    var $thisSelect = $(this);
    $thisSelect.html('');
    var selectOption = '';
    var thisID = $thisSelect.attr('id');
    var dept_num = 0;
    //selectOption += '<li class="checkbox keep-open"><label><input type="checkbox" checked="checked" value="all" name="course-dept-multi" /><span>All</span></label></li>';
    $.getJSON('/courses/deptlist', function (data) {
      deptListData = data;
      
      $.each(data, function () {
        dept_num++;
        selectOption += '<li class="checkbox keep-open"><label><input type="checkbox" checked="checked" value="' + this.deptID + '" name="course-dept-multi" /><span>' + this.deptName + '</span></label></li>';
      });
      selectOption += '<li><a href="#" class="btn close-dropdown">Done</a></li>';
      $('.deptlistdropdown').attr('data-dept-num',dept_num);
      $thisSelect.html(selectOption);
    });
  });
}