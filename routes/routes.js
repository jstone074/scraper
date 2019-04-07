var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("../models");
var articlesController = require("../controllers/articles");

module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Article.find({ saved: false }, function (error, data) {

            if (error) {
                console.log(error)
            } else if (data.length === 0) {
                res.render("blank")
            } else {
                var object = {
                    articles: data
                };

                res.render("index", object);
            }

        });
    });

    app.get("/saved", function (req, res) {
        
        db.Article.find({ saved: true }, function (error, data) {

            var object = {
                articles: data
            };
          
            res.render("saved", object);


        });

    });

    app.get("/scrape", function (req, res) {
        axios.get("https://www.allrecipes.com/recipes/78/breakfast-and-brunch/").then(function (response) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);

            var result = [];

            $(".fixed-recipe-card").each(function (i, element) {

                var title = $(element).find("h3.fixed-recipe-card__h3").children().children().text();
                var link = $(element).children().find("a").attr("href");
                var summary = $(element).children().find("img").attr("alt");

                // Save these results in an object that we'll push into the results array we defined earlier
                result.push({
                    title: title,
                    link: link,
                    summary: summary
                });


                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    //Saving Articles Route
    app.patch("/api/articles", function (req, res) {

        articlesController.update(req.body, function (err, data) {

            res.json(data);

        });

    });

        // Route for grabbing a specific Article by id, populate it with it's note
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        // console.log("I'm here......",req.params.id);
        db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
        // console.log("I'm here!!!!!",req.body.body)
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body.body)
        .then(function(dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            // console.log("Note Create with body of", dbArticle)
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    


}




