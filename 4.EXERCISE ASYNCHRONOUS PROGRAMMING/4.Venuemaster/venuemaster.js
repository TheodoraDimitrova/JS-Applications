function attachEvents() {
  const APP_KEY = "kid_BJ_Ke8hZg";
  const kinveyUsername = "guest";
  const kinveyPassword = "pass";
  const base64Auth = btoa(kinveyUsername + ":" + kinveyPassword);
  const authHeaders = { Authorization: "Basic " + base64Auth };

  $("#getVenues").click(getVenues);

  function getVenues() {
    //valid information for dates "23-11", "24-11", "2115-", "26-11" and "27-11"
    let date = $("#venueDate").val();
    $("#venueDate").val("");
    $.ajax({
      //get all venues for given date POST --> rpc/kid_BJ_Ke8hZg/custom/calendar?query={date}
      method: "POST",
      headers: authHeaders,
      url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`
    })
      .then(loadVenues)
      .catch(function(err) {
        console.log(err);
      });
  }

  function loadVenues(venueIds) {
    $("#venue-info").empty();

    for (let venueId of venueIds) {
      $.ajax({
        //GET request to appdata/kid_BJ_Ke8hZg/venues/{_id}
        method: "GET",
        headers: authHeaders,
        url: `https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/${venueId}`
      })
        .then(displayVenue)
        .catch(function(err) {
          console.log(err);
        });
    }
  }
  function displayVenue(venue) {
    console.log(venue);

    $("#venue-info").append(
      `<div class="venue" id="${venue._id}">
            <span class="venue-name"><input class="info" type="button" value="More info">${
              venue.name
            }</span>
            <div class="venue-details" style="display: none;" >
              <table>
                <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
                <tr>
                  <td class="venue-price">${venue.price} lv</td>
                  <td><select class="quantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select></td>
                  <td><input class="purchase" type="button" value="Purchase"></td>
                </tr>
              </table>
              <span class="head">Venue description:</span>
              <p class="description">${venue.description}</p>
              <p class="description">Starting time: ${venue.startingHour}</p>
            </div>
          </div>
          `
    );
    $(".info").click(function() {
        let venueId = $(this)
          .closest("div")
          .attr("id");
        $(`#${venueId}`)
          .find(".venue-details")
          .toggle();
      });

   
  }
}
