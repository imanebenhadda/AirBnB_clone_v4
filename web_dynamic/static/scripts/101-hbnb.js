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
    let Data = {};
    data.forEach(place => {
      var req1 = $.get({
        url: 'http://localhost:5001/api/v1/places/' + place.id + '/reviews',
        data: JSON.stringify({}),
        contentType: 'application/json',
      });
      req1.done(function(Reviews) {
        var reqs = [];
        Reviews.forEach(review => {
          var req2 = $.get({
            url: 'http://localhost:5001/api/v1/users/' + review.user_id,
            data: JSON.stringify({}),
            contentType: 'application/json',
          })
          req2.done(function(user) {
            let date = new Date(review.created_at);
            let monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            
            let day = date.getDate();
            let monthIndex = date.getMonth();
            let year = date.getFullYear();
            
            let daySuffix = day + (
                (day === 1 || day === 21 || day === 31) ? "st" :
                (day === 2 || day === 22) ? "nd" :
                (day === 3 || day === 23) ? "rd" : "th"
            );
            
            let formattedDate = daySuffix + " " + monthNames[monthIndex] + " " + year;
            Data["From " + user.first_name + ' ' + user.last_name + " the " + formattedDate] = review.text;
          });
          reqs.push(req2);
        });
        $.when.apply($, reqs).then(function() {
          let revs = Object.entries(Data).map(([key, value]) => {
            return `<li><div class="review_item"><h3>${key}</h3><p class="review_text">${value}</p></div></li>`;
          }).join('');
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
                <b>Owner:</b> Name User;
              </div>
            <div class="description">
              ${place.description}
            </div>
            <div class="amenities">
                <h4 class="article_subtitle">Amenities</h4>
                <ul>
                  <li><div class="tv_icon"></div>TV</li>
                  <li><div class="wifi_icon"></div>Wifi</li>
                  <li><div class="pet_icon"></div>Pet friendly</li>
                </ul>
              </div>
              <div class="reviews">
                <h4 class="article_subtitle">Reviews <span id=${place.id} style="color: blue; cursor: pointer;">show</span></h4>
                <ul class=${place.id}>
                  ${revs}
                </ul>
              </div>
          </article>
        `)
        $(`ul.${place.id}`).hide();
        $(`span#${place.id}`).click(function() {
          $(`ul.${place.id}`).toggle();
          if ($(`ul.${place.id}`).css('display') === 'block') {
            $(`span#${place.id}`).text("hide");
            } else {
            $(`span#${place.id}`).text("show");
            }
        });})
    });
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
