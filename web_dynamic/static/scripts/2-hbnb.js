#!/usr/bin/node
$(function() {
  let amenities = {};
  $("input[type='checkbox']").on('change', function() {
    if ($(this).is(":checked")) {
      amenities[$(this).data('id')] = $(this).data('name')
    } else {
      delete amenities[$(this).data('id')];
    }
    let names = Object.values(amenities);
    if (names.length > 0) {
      $(".amenities h4").text(names.join(", "));
    } else {
      $(".amenities h4").html('&nbsp;');
    }
  });

  const apiUrl = 'http://localhost:5001/api/v1/status/';
  $.get(apiUrl, function(data, status){
    if (status === 'success'){
      if (data.status === 'OK'){
        $("DIV#api_status").addClass('available');
      } else {
        $("DIV#api_status").removeClass('available');
      }
    }
  });

  
});
