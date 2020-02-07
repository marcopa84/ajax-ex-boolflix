$(document).ready(function() {

  $(document).on('click', '#search_btn', function () {
    $('.error_dialog').slideUp();
    $('.error_dialog').html('');
    search();
    clean();
  });

  $(document).on('click', '#modal_btn', function () {
    $('.modal').remove();
  });

  $(document).on('click', 'body', function () {
    $('.error_dialog').slideUp();
    $('.error_dialog').html('');
  });

  $('#search_val').keypress(    function () {
      if (event.which == 13 || event.keyCode == 13){
        $('.error_dialog').slideUp();
        $('.error_dialog').html('');
        search();
        clean();
      }
    }
  );

});


function search() {
  $('.start').remove();
  // preparo il messaggio di errore, nel caso servisse
  var source = $('#error_dialog').html();
  var template = Handlebars.compile(source);
  var searchVal = $('#search_val').val().toLowerCase();
  console.log(searchVal);
  if (searchVal.length != 0) {
    // ricerca films
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
          console.log('film',filmArray);
          // gestisco errori
          if (filmArray.length == 0) {
            $('.error_dialog').slideDown();
            var context = {
              error: 'Nessun film risultante dalla ricerca.'
             };
            var html = template(context);
            $('.error_dialog').append(html);
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
    // ricerca serie tv
    $.ajax(
      {
        url : 'https://api.themoviedb.org/3/search/tv',
        method: 'GET',
        data : {
          api_key : 'f4cb5d5e967d170cb7a067b541e15041',
          query : searchVal,
        },
        success : function (datatv) {
          var tvArray = datatv.results;
          console.log('serietv',tvArray);
          // gestisco errori
          if (tvArray.length == 0) {
            $('.error_dialog').slideDown();
            var context = {
              error: 'Nessuna serie tv risultante dalla ricerca.'
             };
            var html = template(context);
            $('.error_dialog').append(html);
          }else {
            tvPrint(tvArray);
          }
        },
        error : function(error) {
          alert('errore', error);
          console.log(error);
        }
      }
    );
  } else {
    var source = $('#modal').html();
    var template = Handlebars.compile(source);
    var context = {
      error: 'Inserire un termine di ricerca!'
     };
    var html = template(context);
    $('body').append(html);
  }

}
// stampa films
function filmPrint(array) {
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
    }else if (language == 'ja') {
      language = 'jp';
    }
    // variabile votazione
    var stars = Math.ceil(film.vote_average/2);
    var stars_print = '<img src="img/star.png">';
    var stars_print_result = '';
    for (var s = 0; s < stars; s++) {
      stars_print_result = stars_print_result + stars_print
    }
    // popolo il <li>
    var context = {
      image_src: 'https://image.tmdb.org/t/p/w342/'+film.poster_path,
      title: film.title,
      original_title: film.original_title,
      original_language: language,
      gender : 'Film',
      vote_average: stars_print_result,
     };
     // appendo il <li> popolato
    var html = template(context);
    $('.results_list').append(html);
  }
}
// stampa serie tv
function tvPrint(array) {
  // clono il <li>
  var source = $('#entry_film').html();
  var template = Handlebars.compile(source);

  // ciclo
  for (var i = 0; i < array.length; i++) {
    var tv = array[i];
    // variabile lingua per compatibilità richiamo bandiere
    var language = tv.original_language;
    if (language == 'en') {
      language = 'gb';
    }else if (language == 'ja') {
      language = 'jp';
    }
    // variabile votazione
    var stars = Math.ceil(tv.vote_average/2);
    var stars_print = '<img src="img/star.png">';
    var stars_print_result = '';
    for (var s = 0; s < stars; s++) {
      stars_print_result = stars_print_result + stars_print
    }
    // popolo il <li>
    var context = {
      image_src: 'https://image.tmdb.org/t/p/w342/'+tv.poster_path,
      title: tv.name,
      original_title: tv.name,
      original_language: language,
      gender : 'TV serie',
      vote_average: stars_print_result,
     };
     // appendo il <li> popolato
    var html = template(context);
    $('.results_list').append(html);
  }
}
function clean() {
  // svuoto i campi
  $('.results_list').text('');
  $('#search_val').val('');
}
