$(document).ready(function(){
  // Chiave api   5bab49c7983aef7f99234e6642e23f03
  // Al click da tastiera invio,aggiungi il prodotto
  $('.ricerca input').keydown(
    function(event){
      if(event.which == 13){

        // Inserimento film da cercare in una variabile
        var risultatoDaCercare = $('.ricerca input').val();

        ricercaFilm(risultatoDaCercare);
        ricercaSerie(risultatoDaCercare);
      }
    });

    $(document).on('click','button.ricerca', function(){

      // Inserimento film da cercare in una variabile
      var risultatoDaCercare = $('.ricerca input').val();

      ricercaFilm(risultatoDaCercare);
      ricercaSerie(risultatoDaCercare);
    });

});

// Funzione che stampa i film
function ricercaFilm(filmDaCercare){

  // Reset barra ricerca
  $('.ricerca input').val('');
  // Reset risultati precedenti
  $('.risultatoRicerca').text('');

  // Chiamata ajax
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
    method: 'GET',

    data:{
      api_key: '5bab49c7983aef7f99234e6642e23f03',
      query: filmDaCercare,
      language: 'it-IT'
    },

    success: function(data){

      // Implementazione handlebars
      var source = document.getElementById("ricerca-template").innerHTML;
      var template = Handlebars.compile(source);

      console.log(data);
      for (var i = 0; i < data.total_results; i++) {
        var film = data.results[i];
        console.log(film);

        // Riporta la bandiera della lingua del film
        var bandiera = rilevaBandiera(film.original_language);

        // Informazioni film da stampare
        var context = {
          titolo: film.title,
          titoloOriginale: film.original_title,
          tipologia: 'Film',
          lingua: bandiera,
          voto: film.vote_average,
          stelle: calcoloStelle(film.vote_average),
          immagine: film.backdrop_path
        };

        var html = template(context);

        // Stampa a schermo
        $('.risultatoRicerca').append(html);
      }

    },

    error: function(){
      alert('Documento API non caricato correttamente');
    }

  });
}

// Funzione che stampa le serie tv
function ricercaSerie(serieDaCercare){

  // Reset barra ricerca
  $('.ricerca input').val('');
  // Reset risultati precedenti
  $('.risultatoRicerca').text('');

  // Chiamata ajax
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/tv',
    method: 'GET',

    data:{
      api_key: '5bab49c7983aef7f99234e6642e23f03',
      query: serieDaCercare,
      language: 'it-IT'
    },

    success: function(data){

      // Implementazione handlebars
      var source = document.getElementById("ricerca-template").innerHTML;
      var template = Handlebars.compile(source);

      console.log(data);
      for (var i = 0; i < data.total_results; i++) {
        var serie = data.results[i];
        console.log(serie);

        // Riporta la bandiera della lingua della serie
        var bandiera = rilevaBandiera(serie.original_language);

        // Informazioni film da stampare
        var context = {
          titolo: serie.name,
          titoloOriginale: serie.original_name,
          tipologia: 'Serie TV',
          lingua: bandiera,
          voto: serie.vote_average,
          stelle: calcoloStelle(serie.vote_average),
          immagine: serie.poster_path
        };

        var html = template(context);

        // Stampa a schermo
        $('.risultatoRicerca').append(html);
      }

    },

    error: function(){
      alert('Documento API non caricato correttamente');
    }

  });
}

// Riporta la bandiera della lingua passata
function rilevaBandiera(lingua){
  switch (lingua) {
  case 'it' || 'IT':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/it.webp';
    return bandiera;
  case 'en' || 'EN':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/gb.webp';
    return bandiera;
  case 'zh' || 'ZH':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/cn.webp';
    return bandiera;
  case 'fr' || 'FR':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/fr.webp';
    return bandiera;
  case 'de' || 'DE':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/de.webp';
    return bandiera;
  case 'ja' || 'JA':
    var bandiera = 'https://www.bandiere-mondo.it/data/flags/h160/jp.webp';
    return bandiera;
  default:
    var bandiera = lingua;
    return bandiera;
  }
}

function calcoloStelle(voto){
  var stellaPiena = '<i class="fas fa-star"></i>';
  var stellaVuota = '<i class="far fa-star"></i>';
  var stelle = '';
  var mediaVoto = Math.ceil(voto/2);
  for (var i = 1; i <= 5; i++) {
    if(i <= mediaVoto){
      stelle += stellaPiena;
    }else{
      stelle += stellaVuota;
    }
  }
  console.log(stelle);
  return stelle;
}
