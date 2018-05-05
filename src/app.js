import { getCurrentTrack, getCurrentTime } from './trackinfo.js';
import { getChordsForArtistAndSong, getTopChordsPage, getChords } from './search.js';
import './utils.js'
import { getKeyForTrack } from './audio_features.js';

const Rx = require('rxjs/Rx');
const childProc = require('child_process');
const { shell } = require('electron');

var app;

function startListening() {
  const trackObservable = Rx.Observable.interval(1000)
    .flatMap(x => getCurrentTrack().catch(y => Rx.Observable.empty()))
    .filter(x => !!x)
    .distinctUntilChanged(null, x => x.artist + x.name)
    .share();

  const searchResultsObservable = trackObservable
    .map(track => getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))
    .switch();

  searchResultsObservable.map(getTopChordsPage)
    .subscribe(getAndShowChords);

  searchResultsObservable.subscribe(showAllResults);

  trackObservable
    .map(track => {
      const idParts = track.id.split(':');
      const id = idParts[idParts.length - 1];

      return getKeyForTrack(id);      
    })
    .subscribe(showKey);
}

document.addEventListener('DOMContentLoaded', function () {
  app = new Vue({
    el: '#app',
    data: {
      capo: null,
      key: null,
      key_confidence: null,
      chords: null,
      results: []
    },
    computed: {
      highlightedResults: function() {
        return this.results.map(x => Object.assign({}, x, { active: !!this.chords ? x.url === this.chords.url : false }) )
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
    .catch(err => {
      console.error(err);
      showChords(null);
    });
}

function openInBrowser(result) {
  shell.openExternal(result.url)
}

function showChords(chords) {
  app.chords = chords;
}

function showAllResults(results) {
  app.results = results;
}

function showKey(keyInfo) {
  keyInfo.then(x => {
    app.key =  ['C / Am',
                  'Db / Bbm',
                  'D / Bm',
                  'Eb / Cm',
                  'E / C#m',
                  'F / Dm',
                  'F# / D#m',
                  'G / Em',
                  'Ab / Fm',
                  'A / F#m',
                  'Bb / Gm',
                  'B / G#m'][x.key]

    app.key_confidence = x.confidence;
  }).catch(x => {
    console.error('Error getting key', x);
    app.key = null;
    app.key_confidence = null;
  });
}
