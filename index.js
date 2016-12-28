const trackinfo = require('./trackinfo.js')
const search = require('./search.js');
var childProc = require('child_process');

trackinfo.getCurrentTrack()
  .then(track => search.getChordsForArtistAndSong(track.artist, track.name))
  .then(results => {
    return results
      .filter(x => !!x.song & !!x.rating)
      .sort((a, b) => a.rating < b.rating);
  })
  .then(x => {
    if(x[0]) {
      childProc.exec(`open -a "Google Chrome" ${x[0].link}`);
    } else {
      console.log('Geen resultaten :\'(');
    }
  })
  .catch(err => cosole.error('Error', err));
