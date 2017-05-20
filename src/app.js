import { getCurrentTrack, getCurrentTime } from './trackinfo.js';
import { getChordsForArtistAndSong, getTopChordsPage, getChords } from './search.js';
import './utils.js'
const Rx = require('rxjs/Rx');
const childProc = require('child_process');
const {shell} = require('electron');

var app;

function startListening() {
  const trackObservable = Rx.Observable.interval(1000)
    .flatMap(x => getCurrentTrack().catch(y => Rx.Observable.empty()))
    .filter(x => !!x)
    .distinctUntilChanged(null, x => x.artist + x.name);

  const searchResultsObservable = trackObservable
    .do(x => console.log('New track', x))
    .flatMap(track => getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))

  searchResultsObservable.map(getTopChordsPage)
    .subscribe(getAndShowChords);

  searchResultsObservable.subscribe(showAllResults);
}

document.addEventListener('DOMContentLoaded', function () {
  app = new Vue({
    el: '#app',
    data: {
      capo: null,
      chords: null,
      results: []
    },
    computed: {
      highlightedResults: function() {
        return this.results.map(x => Object.assign({}, x, { active: !!this.chords ? x.link === this.chords.link : false }) )
      }
    },
    methods: {
      open: getAndShowChords,
      openInBrowser: openInBrowser
    }
  });

  startListening();
});

function getAndShowChords(result) {
  getChords(result).then(showChords)
    .catch(console.error)
}

function openInBrowser(result) {
  shell.openExternal(result.link)
}

function showChords(chords) {
  app.chords = chords;
}

function showAllResults(results) {
  app.results = results;
}
