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
});
