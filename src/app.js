import { getCurrentTrack } from './trackinfo.js';
import { getChordsForArtistAndSong, getTopChordsPage, getChords } from './search.js';
import './utils.js'
const Rx = require('rxjs/Rx');
const childProc = require('child_process');

function startListening() {
  Rx.Observable.interval(500)
    .flatMap(getCurrentTrack)
    .distinctUntilChanged(null, x => x.artist + x.name)
    .flatMap(track => getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))
    .map(getTopChordsPage)
    .flatMap(x => !!x ? getChords(x.link): Rx.Observable.of(null))
    .subscribe(showChords);
}

document.addEventListener('DOMContentLoaded', function () {
  startListening();
});

function showChords(innerHtml) {
  if(!innerHtml) {
    showNotFound();
  } else {
    setChordHtml(innerHtml);
  }
}

function setChordHtml(innerHtml) {
  document.getElementById('chords').removeClass('hidden');
  document.getElementById('centered').addClass('hidden');

  document.getElementById('chords').innerHTML = innerHtml;
}

function showNotFound() {
  document.getElementById('chords').addClass('hidden');
  document.getElementById('centered').removeClass('hidden');
}
