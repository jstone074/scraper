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
             
    });
});


//Route to update the article with saved flag. 
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

//This Route is the same URL as saving but with a false boolean
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

//routes for note taking
$(".savenote").on('click', function() {
    var ID = $(this).attr("data-id"); 
    // console.log("This is my ID", ID );
  var input = {
      body:$("#bodyinput").val(),
      title: "Note"  
    };
//   console.log(input.body);
    $.ajax({
        method: "POST",
        url: "/articles/" + ID,
        data: {
            body:$("#bodyinput").val(),
            title: "Note" 
        }

    })
    .then(function(data) {
        console.log("This is my data from POST....",data)
        $('#noteModal').modal('hide');
    });
});

$(".note-button").on('click', function() {
    var ID = $(this).attr("data-id"); 

    // console.log("I'm in the route to log existing notes");

    // console.log("ID for the saved notes", ID);
    $.ajax({
        method: "GET",
        url: "/articles/" + ID,

    })
    .then(function(data) {
        // console.log("front-end notes to append",data);
         if(data.note){
            $("#bodyinput").val(data.note.body);
         }
    })
})







})