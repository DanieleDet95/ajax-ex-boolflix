$(document).ready(function(){
  // Chiave api   5bab49c7983aef7f99234e6642e23f03
  // Al click da tastiera invio,aggiungi il prodotto
  $('.ricerca input').keydown(
    function(event){
      if(event.which == 13){

        // Inserimento film da cercare in una variabile
        var filmDaCercare = $('.ricerca input').val();

        ricercaFilm(filmDaCercare);
      }
    });

    $(document).on('click','button.ricerca', function(){

      // Inserimento film da cercare in una variabile
      var filmDaCercare = $('.ricerca input').val();

      ricercaFilm(filmDaCercare);
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
      var source = document.getElementById("film-template").innerHTML;
      var template = Handlebars.compile(source);

      console.log(data);
      for (var i = 0; i < data.total_results; i++) {
        var film = data.results[i];
        console.log(film);

        // Informazioni film da stampare
        var context = {
          titolo: film.title,
          titoloOriginale: film.original_title,
          lingua: film.original_language,
          voto: film.vote_average
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
