$(document).ready(() => { 


//Route to grab all the articles and then reload the page
$("#scrape-articles").click( function(event) {

    event.preventDefault();

   $.get("/scrape").then(function(data) {
       console.log("scrapped complete");
       $.get("/").then(function () {
            location.reload();
       });
   });
});

$("#save-route").click(function() {
    $.get("/saved").then(function(data){
        console.log("Save route");
        
    });
});

$(".save-article").click(function() {

    //this needs to be an empty object. Had this as an array before
    var savedArticles = {};
    
    savedArticles.id = $(this).data("id");
    savedArticles.saved = true;

    $.ajax({
        method: "PATCH",
        url: "/api/articles",
        data: savedArticles
    }).then(function(data){
        location.reload();
    })

})

$(".delete-article").click(function() {

    //this needs to be an empty object. Had this as an array before
    var savedArticles = {};
    
    savedArticles.id = $(this).data("id");
    savedArticles.saved = false;

    $.ajax({
        method: "PATCH",
        url: "/api/articles",
        data: savedArticles
    }).then(function(data){
        location.reload();
    })

})





})