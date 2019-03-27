var db = require("../models");


module.exports = function(app) {
  // Load index page
app.get("/", function(req, res) {
  res.render("index");
});



// Route for grabbing a specific Article by id, populated with its comment
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("*", function(req, res) {
  res.render("404");
});

};