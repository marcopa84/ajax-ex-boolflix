$(document).ready(function() {
  $(document).on('click', '#search_btn', function () {
    filmSearch();
  });
  $(document).on('click', '#modal_btn', function () {
    $('.modal').remove();
  });
  $('#search_val').keypress(    function () {
      if (event.which == 13 || event.keyCode == 13){
        filmSearch();
      }
    }
  );
  $(document).on('blur', '.modal', function () {
    if (event.which == 13 || event.keyCode == 13){
      $('.modal').remove();
    }
  });
});


function filmSearch() {
  $('.start').remove();
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
  // svuoto i campi
  $('.films_list').text('');
  $('#search_val').val('');
  // clono il <li>
  var source = $('#entry_film').html();
  var template = Handlebars.compile(source);

  // ciclo
  for (var i = 0; i < array.length; i++) {
    var film = array[i];
    // variabile lingua per compatibilità richiamo bandiere
    var language = film.original_language;
    if (language == 'en') {
      language = 'gb';
      console.log('england');
    }
    // variabile votazione
    var stars = Math.ceil(film.vote_average/2);
    var stars_print = '<img src="img/star.png">';
    var stars_print_result = '';
    for (var s = 0; s < stars; s++) {
      stars_print_result = stars_print_result + stars_print
      // $(this).find('#rating').append(stars_print);
    }
    // popolo il <li>
    var context = {
      image_src: 'https://image.tmdb.org/t/p/w342/'+film.poster_path,
      title: film.title,
      original_title: film.original_title,
      original_language: language,
      vote_average: stars_print_result,
     };
     // appendo il <li> popolato
    var html = template(context);
    $('.films_list').append(html);
  }
}
