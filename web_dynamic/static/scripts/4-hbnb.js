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
      $(".amenities h4").text(names.slice(0, 2).join(", ") + (names.length <= 2 ? "" : " ..."));
    }else{
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
  $.post({
    url: 'http://localhost:5001/api/v1/places_search',
    data: JSON.stringify({}),
    contentType: 'application/json',
  })
  .done(function(data) {
    data.forEach(place => {
      $(".places").append(`
      <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s": ""}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s": ""}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s": ""}</div>
        </div>
        <div class="user">
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>
    `);
  })})
  .fail(function(xhr, status, error) {
    $(".places").text("found error :" + error);
  });

  $(".filters button").click(function() {
    $(".places article").remove();
    let ids = Object.keys(amenities);
    $.post({
      url: 'http://localhost:5001/api/v1/places_search',
      data: JSON.stringify({'amenities': ids}),
      contentType: 'application/json',
    })
    .done(function(data) {
      data.forEach(place => {
        $(".places").append(`
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s": ""}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s": ""}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s": ""}</div>
          </div>
          <div class="user">
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
      `);
    })})
    .fail(function(xhr, status, error) {
      $(".places").text("found error :" + error);
    });
  });
});
