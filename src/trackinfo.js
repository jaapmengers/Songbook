const spotify = require('spotify-node-applescript');

function getCurrentTrack() {
  return new Promise((resolve, reject) => {
    spotify.getTrack((err, track) => {
      if(err) {
        reject(err);
      }
      resolve(track);
    });
  });
}

export { getCurrentTrack };
