// $.getJSON("/api/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

// When the #scrape button is pressed
$(document).on("click", "#scrape", function() {
  // Make an AJAX GET request to scrape into the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/api/scrape"
  .then(function(data) {
      console.log(data);
      console.log("Accessing articles");
      location.reload()
  })
  });
});

// When the #clear-all button is pressed
$("#clear-all").on("click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/api/clearall",
    // On a successful call, clear the #results section
    success: function(response) {
      $("#articles").empty();
      $("#comments").empty();
    }
  });
});

// Whenever someone clicks comment tag
$(document).on("click", "#commentButton", function() {
  // Empty the notes from the note section
  //$("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Comments
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "/articles/" + thisId
    .then(function(data) {
      console.log(data);
      console.log("Accessing comments");
      location.reload()
      })
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});