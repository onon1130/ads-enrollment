var userListData = [];
var couseListData = [];
var deptListData = [];
var studentListData = [];

// DOM Ready =============================================================
$(document).ready(function () {
  listDeptSelect();
  populateCourse();
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

function listDeptSelect() {
  var selectOption = '';
  $('.deptlistselect').html();
  selectOption += '<option value="all" selected="selected">All</option>';
  $.getJSON('/courses/deptlist', function (data) {
    deptListData = data;
    $.each(data, function () {
      selectOption += '<option value="' + this.deptID + '">' + this.deptName + '</option>';
    });
    $('.deptlistselect').html(selectOption);
  });
}