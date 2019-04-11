var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");


module.exports = function(app) {
  // Load index page

app.get("/", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.newyorker.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      var results = [];
      // Now, we grab every h2 within an article tag, and do the following:
      $("p.Card__dek___29Iu1").each(function(i, element) {
        // Save an empty result object
        var result = {
        };
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).prev().children("h3").text();
        result.summary = $(this).text();
        result.link = "http://www.newyorker.com" + $(this).prev().attr("href");
        // Create a new Article using the `result` object built from scraping
        results.push(result)
      });
  
      // Send a message to the client
      res.render("index", {articles:results})
    });
  });

  
app.get("/saved", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", {articles:dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Route for grabbing a specific Article by id, populated with its comment
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comment")
    .then(function(dbComments) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(dbComments)
      res.render("index", {comments:dbComments});
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