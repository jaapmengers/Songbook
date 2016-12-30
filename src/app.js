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

  const searchResultsObservable = trackObservable
    .flatMap(track => getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))

  searchResultsObservable.map(getTopChordsPage)
    .subscribe(getAndShowChords);

  searchResultsObservable.subscribe(showAllResults);
}

document.addEventListener('DOMContentLoaded', function () {
  app = new Vue({
    el: '#app',
    data: {
      chords: null,
      results: []
    },
    computed: {
      highlightedResults: function() {
        return this.results.map(x => Object.assign({}, x, { active: !!this.chords ? x.link === this.chords.link : false }) )
      }
    },
    methods: {
      open: getAndShowChords
    }
  });

  startListening();
});

function getAndShowChords(result) {
  getChords(result).then(showChords)
    .catch(x => showChords(null))
}

function showChords(chords) {
  app.chords = chords;
}

function showAllResults(results) {
  app.results = results;
}
