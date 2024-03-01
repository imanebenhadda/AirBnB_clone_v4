#!/usr/bin/node
$(function() {
  let amenities = {};
  $(".amenities input[type='checkbox']").on('change', function() {
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
    let states = {};
    $(".locations h2 input[type='checkbox']").on('change', function() {
      if ($(this).is(":checked")) {
        states[$(this).data('id')] = $(this).data('name')
      } else {
        delete states[$(this).data('id')];
      }
      let states_names = Object.values(states);
      if (states_names.length > 0) {
        $(".locations h4").text(states_names.slice(0, 2).join(", ") + (states_names.length <= 2 ? "" : " ..."));
      } else {
        $(".locations h4").html('&nbsp;');
      }
    });

    let cities = {};
    $(".locations input[type='checkbox']").on('change', function() {
      if ($(this).is(":checked")) {
        cities[$(this).data('id')] = $(this).data('name')
      } else {
        delete cities[$(this).data('id')];
      }
      let cities_names = Object.values(cities);
      if (cities_names.length > 0) {
        $(".locations h4").text(cities_names.slice(0, 2).join(", ") + (cities_names.length <= 2 ? "" : " ..."));
      } else {
        $(".locations h4").html('&nbsp;');
      }
    });

    $(".filters button").click(function() {
      $(".places article").remove();
      let amenities_ids = Object.keys(amenities);
      let states_ids = Object.keys(states);
      //alert(states_ids)
      let cities_ids = Object.keys(cities);
      $.post({
        url: 'http://localhost:5001/api/v1/places_search',
        data: JSON.stringify({'states': states_ids,'cities': cities_ids,'amenities': amenities_ids}),
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
