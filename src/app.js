import { getCurrentTrack, getCurrentTime } from './trackinfo.js';
import { getChordsForArtistAndSong, getTopChordsPage, getChords } from './search.js';
import './utils.js'
const Rx = require('rxjs/Rx');
const childProc = require('child_process');

var app;

function startListening() {
  const trackObservable = Rx.Observable.interval(1000)
    .flatMap(x => getCurrentTrack().catch(y => Rx.Observable.empty()))
    .distinctUntilChanged(null, x => x.artist + x.name);

  const timeObservable = Rx.Observable.interval(1000)
    .flatMap(x => getCurrentTime().catch(y => Rx.Observable.empty()));

  // Rx.Observable.combineLatest(trackObservable, timeObservable, (track, time) =>  (1000 * time) / track.duration)
  //   .subscribe(setScrollFraction);

  trackObservable.flatMap(track => getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))
  .map(getTopChordsPage)
  .flatMap(x => !!x ? getChords(x.link): Rx.Observable.of(null))
  .subscribe(showChords);
}

document.addEventListener('DOMContentLoaded', function () {
  app = new Vue({
    el: '#app',
    data: {
      chords: null,
    }
  });

  startListening();
});

function setScrollFraction(fraction) {
  var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const body = document.getElementById('body');

  body.scrollTop = height * fraction;
}

function showChords(innerHtml) {
  if(!innerHtml) {
    app.chords = null;
  } else {
    app.chords = innerHtml;
  }
}
