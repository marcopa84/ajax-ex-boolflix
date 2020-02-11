$(document).ready(function() {
  getGenres1();
  // Ricerca con bottone
  $(document).on('click', '#search_btn', function () {
    $('.error_dialog').slideUp();
    $('.error_dialog').html('');
    search();
    clean();
  });
  // ricerca con invio
  $('#search_val').keypress(function () {
      if (event.which == 13 || event.keyCode == 13){
        $('.error_dialog').slideUp();
        $('.error_dialog').html('');
        search();
        clean();
      }
    }
  );
  // chiusura finestra modale
  $(document).on('click', '#modal_btn', function () {
    $('.modal').remove();
  });
  // chiusura errori
  $(document).on('click', 'body', function () {
    $('.error_dialog').slideUp();
    $('.error_dialog').html('');
  });
  // ricerca cast
  $(document).on('click', '#search_cast_btn', function () {
    $('.description_cast').html('');
    var elementCast = $(this);
    var id_film = $(this).parents('li').attr('data_id');
    var type = $(this).parents('li').attr('data_type');
    searchCast(elementCast, type, id_film);
  });
  // filtro sul genere
  $('#genres').change(function() {
    var genresSelected = $(this).val();
    filter(genresSelected);
  });

});
// funzione ricerca film e serie tv
function search() {
  $('.start').remove();
  // preparo il messaggio di errore, nel caso servisse
  var source = $('#error_dialog').html();
  var template = Handlebars.compile(source);
  var searchVal = $('#search_val').val().toLowerCase();
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
            elementPrint('movie',filmArray);
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
            elementPrint('tv', tvArray);
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
// funzione ricerca del cast
function searchCast(thisElement, type, id) {
  // preparo il messaggio di errore, nel caso servisse
  var source = $('#error_dialog').html();
  var template = Handlebars.compile(source);
  $.ajax(
    {
      url : 'https://api.themoviedb.org/3/'+type+'/'+id+'/credits',
      method: 'GET',
      data : {
        api_key : 'f4cb5d5e967d170cb7a067b541e15041',
      },
      success : function (data) {
        var castArray = data.cast;
        // gestisco errori
        if (castArray.length == 0) {
          $('.error_dialog').slideDown();
          var context = {
            error: 'Il cast di questo elemento non è disponibile.'
           };
          var html = template(context);
          $('.error_dialog').append(html);
        }else {
          castPrint(thisElement, castArray);
        }
      },
      error : function(error) {
        $('.error_dialog').slideDown();
        var context = {
          error: 'Il cast di questo elemento non è disponibile.',
         };
        var html = template(context);
        $('.error_dialog').append(html);
        console.log(error);
      }
    }
  );
}
// filtro schede
function filter(select) {
  $('.entry_film').each(function() {
    var genre = $(this).attr('data_genres');
    var genreArraySplitted = genre.split(",");
    $(this).hide();
    for (var i = 0; i < genreArraySplitted.length; i++) {
      if (genreArraySplitted[i] == select) {
        $(this).show();
      }else if (select == 'all') {
        $('.entry_film').show();
      }
    }
  });
}
// creazione generi in due steps parte alla stampa dei film
function getGenres1() {
  var genres = [];
  $.ajax(
    {
      url : 'https://api.themoviedb.org/3/genre/movie/list',
      method: 'GET',
      data : {
        api_key : 'f4cb5d5e967d170cb7a067b541e15041',
      },
      success : function (data) {
        var array1 = data.genres
        for (var i = 0; i < array1.length; i++) {
            genres.push(array1[i]);
        }
        getGenres2(genres);
      },
      error : function(error) {
        $('.error_dialog').slideDown();
        var context = {
          error: 'Nessun genere al momento disponibile in movie',
         };
        var html = template(context);
        $('.error_dialog').append(html);
        console.log(error);
      }
    }
  );
}
function getGenres2(genres) {
  $.ajax(
    {
      url : 'https://api.themoviedb.org/3/genre/tv/list',
      method: 'GET',
      data : {
        api_key : 'f4cb5d5e967d170cb7a067b541e15041',
      },
      success : function (data) {
        var array2 = data.genres
        for (var i = 0; i < array2.length; i++) {
          var element = array2[i]
          var find= false;
          for (var j = 0; j < genres.length; j++) {
            if (element.id == genres[j].id) {
              find = true;
            }
          }
          if (!find) {
            genres.push(element);
          }
        }
        printGenres(genres);
      },
      error : function(error) {
        $('.error_dialog').slideDown();
        var context = {
          error: 'Nessun genere al momento disponibile in serie TV',
         };
        var html = template(context);
        $('.error_dialog').append(html);
        console.log(error);
      }
    }
  );
}
// popolamento generi select
function printGenres(genres) {
  var source = $('#entry_select').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < genres.length; i++) {
    var context = {
      value_id : genres[i].id,
      value: genres[i].name,
     }
    var html = template(context);
    $('#genres').append(html);
  }
}
// stampa elementi
function elementPrint(type, array) {
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
    var image_src = 'https://image.tmdb.org/t/p/w342/'+element.poster_path;

    // Gestisco immagine 'null'
    if (element.poster_path == null) {
      image_src = 'img/sorry-image-not-available.jpg'
    };

    var context = {
      id: element.id,
      type: type,
      genres_ids: element.genre_ids,
      image_src: image_src,
      title: element.title || element.name,
      original_title: element.original_title || element.name,
      original_language: language,
      overview: element.overview,
      vote_average: printStars(element.vote_average),
     };
     // appendo il <li> popolato
    var html = template(context);
    $('.results_list').append(html);
    genresCounter(element.genre_ids);
  }
}
// counter genres
function genresCounter(arrayGeneriSchede) {
  // console.log(arrayGeneriSchede);
  $('#genres').find('option').each(
    function() {
      var optionValue = $(this).val();
      // console.log(optionValue);
      for (var i = 0; i < arrayGeneriSchede.length; i++) {
        var counter = 0;
        if (arrayGeneriSchede[i] == optionValue) {
          counter = '&hearts;'	;
          $(this).append(counter);
        }

      }
    }
  );
}
// stampa element cast
function castPrint(thisElement, array) {
  // clono il <li>
  var source = $('#entry_cast').html();
  var template = Handlebars.compile(source);

  // ciclo
  for (var i = 0; i < 5; i++) {
    var element = array[i];

    var image_src = 'https://image.tmdb.org/t/p/w45/'+element.profile_path;
    // Gestisco immagine 'null'
    if (element.profile_path == null) {
      image_src = 'img/sorry-image-not-available.jpg'
    };

    var context = {
      img_src : image_src,
      name : element.name,
      character : ' nel personaggio di ' + element.character,
     };
     // appendo il <li> popolato
    var html = template(context);
    $(thisElement).siblings('.description_cast').append(html);
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
