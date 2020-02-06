$(document).ready(function() {
  $(document).on('click', '#search_btn', function () {
    filmSearch();
  });
  $(document).on('click', '#modal_btn', function () {
    $('.modal').remove();
  });
});


function filmSearch() {
  var searchVal = $('#search_val').val().toLowerCase();
  console.log(searchVal);
  if (searchVal.length != 0) {
    $.ajax(
      {
        url : 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data : {
          api_key : 'f4cb5d5e967d170cb7a067b541e15041',
          query : searchVal,
        },
        success : function (data) {
          var filmArray = data.results;
          console.log(filmArray);
          if (filmArray.length == 0) {
            var source = $('#modal').html();
            var template = Handlebars.compile(source);
            var context =
            {
              error : 'Nessun film corrisponde alla ricerca effettuata'
            };
            var html = template(context);
            $('body').append(html);
          }else {
            filmPrint(filmArray);
          }
        },
        error : function(error) {
          alert('errore', error);
          console.log(error);
        }
      }
    );
  } else {
    alert('immettere un valore nel campo!');
  }

}

function filmPrint(array) {
  $('.films_list').text('');
  // var source = document.getElementById("entry_film").innerHTML;
  var source = $('#entry_film').html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < array.length; i++) {
    var film = array[i];

    var context = {
      image_src: 'https://image.tmdb.org/t/p/w500/'+film.poster_path,
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
