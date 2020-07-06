$(document).ready(function(){
  // Al click da tastiera invio,aggiungi il prodotto
  $('.ricerca input').keydown(
    function(event){
      if(event.which == 13){

        // Inserimento film da cercare in una variabile
        var risultatoDaCercare = $('.ricerca input').val();

        // Reset barra ricerca
        reset();

        ricerca(risultatoDaCercare, 'film');
        ricerca(risultatoDaCercare, 'serie');
      }
    });

    $(document).on('click','button.ricerca', function(){

      // Inserimento film da cercare in una variabile
      var risultatoDaCercare = $('.ricerca input').val();

      // Reset barra ricerca
      reset();

      ricerca(risultatoDaCercare, 'film');
      ricerca(risultatoDaCercare, 'serie');
    });

    // Al mouse dentro il blocco
    $(document).on('mouseenter','.bloccoFilm', function(){
      $(this).find('div.info').removeClass('nascosto');
      $(this).find('div.info').find('h2,h4,p,div').removeClass('nascosto');
      $(this).find('div.info').find('.trama').addClass('nascosto');
      $(this).find('img.copertina').addClass('nascosto');
    });

    // Al mouse fuori il blocco
    $(document).on('mouseleave','.bloccoFilm', function(){
      $(this).find('div.info').addClass('nascosto');
      $(this).find('img.copertina').removeClass('nascosto');
    });

    // Al clck sulle informazioni esce la trama
    $(document).on('click','.info', function(){
      $(this).find('.trama').toggleClass('nascosto');
      $(this).children('h2,h4,p,div').toggleClass('nascosto');
    });

});

// Funzione che stampa i film o serie tv
function ricerca(risultatoDaCercare, type){

  // Passare url corretto in base al tipo da cercare
  if(type === 'film'){
    var url = 'https://api.themoviedb.org/3/search/movie';
  }else if(type === 'serie'){
    var url = 'https://api.themoviedb.org/3/search/tv';
  }

  // Chiamata ajax
  $.ajax({
    url: url,
    method: 'GET',

    data:{
      api_key: '5bab49c7983aef7f99234e6642e23f03',
      query: risultatoDaCercare,
      language: 'it-IT'
    },

    success: function(data){

      stampaRisultato(data ,type);

    },

    error: function(){
      var messaggio = 'Scrivere qualcosa nella barra di ricerca <br>';
      $('.errore').removeClass('nascosto');
      $('.errore').append(messaggio);
    }

  });
}

function reset(){
  // Reset barra ricerca
  $('.ricerca input').val('');
  // Reset risultati precedenti
  $('.risultatoRicerca').text('');
  // Reset messaggio errore
  $('.errore').text('');
}

// Stampa film o serie richiesta
function stampaRisultato(data ,type){
  // Implementazione handlebars
  var source = document.getElementById("ricerca-template").innerHTML;
  var template = Handlebars.compile(source);

  // Controllo input inserito riporta risultati
  var controllo = data.results;
  if (controllo.length <= 0) {
    if (type == 'film') {
      var messaggio = 'La ricerca non ha prodotto nessun film <br>';
      $('.errore').removeClass('nascosto');
    } else {
      var messaggio = 'La ricerca non ha prodotto nessuna serie <br>';
      $('.errore').removeClass('nascosto');
    }
  }
  $('.errore').append(messaggio);

  // Ciclo di tutti i valori ricevuti
  for (var i = 0; i < data.total_results; i++) {
    var risultato = data.results[i];
    console.log(risultato);

    // In base al tipo di ricerca passare i valori corretti
    if(type === 'film'){
      var titolo = risultato.title;
      var titoloOriginale = risultato.original_title;
      var tipologia = 'Film';
    }else if(type === 'serie'){
      var titolo = risultato.original_name;
      var titoloOriginale = risultato.original_name;
      var tipologia = 'Serie tv';
    }

    // Informazioni film da stampare
    var context = {
      titolo: titolo,
      titoloOriginale: titoloOriginale,
      tipologia: tipologia,
      trama: risultato.overview,
      lingua: rilevaBandiera(risultato.original_language),
      voto: risultato.vote_average,
      stelle: calcoloStelle(risultato.vote_average),
      immagine: immaginePost(risultato.poster_path),
      oggettoId: risultato.id
    };

    var html = template(context);

    // Stampa a schermo
    $('.risultatoRicerca').append(html);

    var generi = rilevaInfo(risultato.id , type);
    console.log(generi);
    // var attori = rilevaAttori(risultato.id , type);
    // console.log(attori);
  }


}

// Rileva il genere e gli attori dei film/serie tv
function rilevaInfo(id ,type){

  // Passare url corretto in base al tipo da cercare
  if(type === 'film'){
    var url = 'https://api.themoviedb.org/3/movie/';
  }else if(type === 'serie'){
    var url = 'https://api.themoviedb.org/3/tv/';
  }

  // Chiamata ajax
  $.ajax({
    url: url + id,
    method: 'GET',

    data:{
      append_to_response: 'credits',
      api_key: '5bab49c7983aef7f99234e6642e23f03',
    },

    success: function(data){

      stampaInfo(data ,id);

    },

    error: function(){
      var messaggio = 'Scrivere qualcosa nella barra di ricerca <br>';
      $('.errore').removeClass('nascosto');
      $('.errore').append(messaggio);
    }

  });

}

// Stampa le informazioni trovate
function stampaInfo(data ,id){

  // Prendi il blocco con l'id corrispondente alle informazioni
  var bloccoOggetto = $('.bloccoFilm[data-id = "'+ id +'"]');

  // Creazione lista generi
  var generi = data.genres;
  var arrayGeneri = [];
  for (var i = 0; i < generi.length; i++) {
    arrayGeneri += '&bull; ' + generi[i].name + '  ';
  }

  // Creazione lista attori
  var castAttori = data.credits.cast;
  var arrayAttori = [];
  for (var i = 0; i < 5; i++) {
    arrayAttori += i+1 + ' - ' + castAttori[i].name + '<br>';
  }
  console.log(arrayAttori);

  // Creazione lista attori
  var personaggi = data.credits.cast;
  var arrayPersonaggi = [];
  for (var i = 0; i < 5; i++) {
    arrayPersonaggi += i+1 + ' - ' + personaggi[i].character + '<br> ';
  }
  console.log(arrayPersonaggi);


  // Implementazione handlebars
  var source = document.getElementById("dettagli-template").innerHTML;
  var template = Handlebars.compile(source);

  // Informazioni film da stampare
  var context = {
    generi: arrayGeneri,
    attori: '<p>' + arrayAttori + '</p>',
    personaggi: '<p>' + arrayPersonaggi + '</p>'
  };

  var html = template(context);

  // Stampa a schermo
  $(bloccoOggetto).find('.dettagli').append(html);
}

// Riporta la bandiera della lingua passata
function rilevaBandiera(lingua){
  switch (lingua) {
  case 'it' || 'IT':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/it.webp" alt="">';
    return bandiera;
  case 'en' || 'EN':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/gb.webp" alt="">';
    return bandiera;
  case 'zh' || 'ZH':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/cn.webp" alt="">';
    return bandiera;
  case 'fr' || 'FR':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/fr.webp" alt="">';
    return bandiera;
  case 'de' || 'DE':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/de.webp" alt="">';
    return bandiera;
  case 'ja' || 'JA':
    var bandiera = '<img class="bandiera" src="https://www.bandiere-mondo.it/data/flags/h160/jp.webp" alt="">';
    return bandiera;
  default:
    var bandiera = lingua;
    return bandiera;
  }
}

// Calcolo stelle da stampare
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
  return stelle;
}

// Riporta la copertina
function immaginePost(immagine){
  if(immagine == null){
    immagine = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT5kTzxyN9vlsrJvuO-vKezQgkUMpeRNHU-Tg&usqp=CAU'
  } else{
    immagine = 'https://image.tmdb.org/t/p/w342' + immagine;
  }
  return immagine;
}
