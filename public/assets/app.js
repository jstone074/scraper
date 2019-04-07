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
$("#noteButton").on("click", function(){

        // the article id
        var ID = $(this).attr("data-value");
  
        //attach news article _id to the save button in the modal for use in save post
        $("#modalNoteButton").attr({"data-value": ID});
  
        //make an ajax call for the notes attached to this article
        $.get("/articles/" + ID, function(data){
            

            //empty modal title, textarea and notes
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#noteBody').val('');
  
            //delete button for individual note
  
            //add id of the current article to modal label
            $('#noteModalLabel').append(' ' + ID);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.note.length; i++) {
                console.log("loop for data", data.note[i]);
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].content + '  ' + button + '</div></div>');
            }
        });

    });

$(".savenote").on('click', function() {
    var ID = $(this).attr("data-value"); 
    console.log("This is my ID", ID );
    $.ajax({
        method: "POST",
        url: "/articles/" + ID,
        data: {
            body: $("#noteBody").val()
        }
    })
    .done(function(data) {
        $('#noteModal').modal('hide');
    });
});

$("#noteButton").on('click', function() {
    var ID = $(this).attr("data-value"); 
    console.log("ID for the saved notes", ID);
    $.ajax({
        method: "GET",
        url: "/articles/" + ID,
        data: {
            body: content
        }
    })
    .done(function(data) {
        console.log("front-end notes to append",data);
        $('#noteBody').append(data);
    })
})







})