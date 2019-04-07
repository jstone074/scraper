var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ------- PORT ---------
var port = process.env.PORT || 3000;

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(process.cwd() + "/public"));

// ------- Router ---------
var router = express.Router();
require("./routes/routes")(app);
app.use(router);

// if deployed, use the deployed database. Otherwise, use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cookingarticles";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log(err);
    }else{
        console.log("connected to DB");
    }
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  