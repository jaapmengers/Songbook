const spotify = require('spotify-node-applescript');

exports.getCurrentTrack = function() {
  return new Promise((resolve, reject) => {
    spotify.getTrack(function(err, track){
      if(err) {
        reject(err);
      }
      resolve(track);
    });
  });
}
