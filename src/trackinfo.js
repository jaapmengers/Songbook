const spotify = require('spotify-node-applescript');

function getCurrentTrack() {
  return new Promise((resolve, reject) => {
    spotify.getTrack((err, track) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(track);
    });
  });
}

function getCurrentTime() {
  return new Promise((resolve, reject) => {
    spotify.getState((err, state) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(state.position);
    });
  });
}

export { getCurrentTrack, getCurrentTime };
