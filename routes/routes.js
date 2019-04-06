var axios = require("axios");
var cheerio = require("cheerio");



// Require all models
var db = require("../models");

module.exports = function (app) {
    
    app.get("/", function(req,res){
        db.Article.find({saved:false}, function(error,data){

            if(error){
                console.log(error)
            }else if (data.length ===0){
                res.render("blank")
            }else {
                var object = {
                    articles: data
                };
            
                res.render("index",object);
            }
            
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


                // console.log(results);

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
}




