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
            elementPrint(filmArray);
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
            elementPrint(tvArray);
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
// stampa elementi
function elementPrint(array) {
  // clono il <li>
  var source = $('#entry_film').html();
  var template = Handlebars.compile(source);

  // ciclo
  for (var i = 0; i < array.length; i++) {
    var element = array[i];
    // variabile lingua per compatibilità richiamo bandiere
    var language = element.original_language;
    if (language == 'en') {
      language = 'gb';
    }else if (language == 'ja') {
      language = 'jp';
    }
    // variabile votazione
    // var stars = Math.ceil(element.vote_average/2);
    // var stars_print = '<img src="img/star.png">';
    // var stars_print_result = '';
    // for (var s = 0; s < stars; s++) {
    //   stars_print_result = stars_print_result + stars_print
    // }
    // popolo il <li>
    var context = {
      image_src: 'https://image.tmdb.org/t/p/w342/'+element.poster_path,
      title: element.title || element.name,
      original_title: element.original_title || element.name,
      original_language: language,
      overview: element.overview,
      vote_average: printStars(element.vote_average),
     };
     // appendo il <li> popolato
    var html = template(context);
    $('.results_list').append(html);
  }
}
// creazione votazione

function printStars (num) {
  num = Math.ceil(num / 2);
  var string = '';

  for (var i = 1; i <= 5; i++) {
    if(i <= num ) {
      string += '<i class="fas fa-star"></i>';
    } else {
      string += '<i class="far fa-star"></i>';
    }
  }

  return string
}
// pulizia risultati
function clean() {
  // svuoto i campi
  $('.results_list').text('');
  $('#search_val').val('');
}
