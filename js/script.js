$(document).ready(function() {
  $(document).on('click', '#search_btn', function () {
    filmSearch();
  });
});


function filmSearch() {
  var searchVal = $('#search_val').val().toLowerCase();
  console.log(searchVal);
  $.ajax(
    {
      url : 'https://api.themoviedb.org/3/search/movie?api_key=f4cb5d5e967d170cb7a067b541e15041',
      method: 'GET',
      data : {
        query : searchVal,
      },
      success : function (data) {
        var filmArray = data.results;
        filmPrint(filmArray);
      },
      error : function(errors) {
        alert('errore', errors);
      }
    }
  );
}

function filmPrint(array) {
  var source = document.getElementById("entry_film").innerHTML;
  var template = Handlebars.compile(source);
  for (var i = 0; i < array.length; i++) {
    var film = array[i];

    var context = {
      title: film.title,
      original_title: film.original_title,
      original_language: film.original_language,
      vote_average: film.vote_average
     };
    var html = template(context);
    $('.films_list').append(html);
    console.log(film);
  }
}
