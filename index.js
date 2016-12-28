const trackinfo = require('./trackinfo.js')
const search = require('./search.js');
const Rx = require('rxjs/Rx');
const childProc = require('child_process');

Rx.Observable.interval(2000)
  .flatMap(trackinfo.getCurrentTrack)
  .distinctUntilChanged(null, x => x.artist + x.name)
  .flatMap(track => search.getChordsForArtistAndSong(track.artist, track.name).catch(_ => Promise.resolve([])))
  .map(search.getTopChords)
  .subscribe(chords => {
    if(chords) {
      childProc.exec(`open -a "Google Chrome" ${chords.link}`);
    }
  });
