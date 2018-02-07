const ugs = require('ultimate-guitar-scraper');

function getChordsForArtistAndSong(artist, song) {
  return new Promise((resolve, reject) => {
    ugs.search({
      query: `${artist} - ${strip(song)}`,
      page: 1,
      type: ['Chords']
    }, (error, tabs) => {
      if(error) {
        reject(error);
        return;
      }

      console.log(tabs);

      resolve(orderByRating(tabs));
    });
  });
}

function strip(str) {
  const regex = /^([^(|^-]*)/g;
  const matches = str.match(regex);

  if (matches.length > 0) {
    return matches[0].trim();
  }

  return '';
}

function orderByRating(results) {
  return results.sort((a, b) => a.rating < b.rating);
}

function getTopChordsPage(results) {
  return results[0];
}

function getChords(chords) {
  return new Promise((resolve, reject) => {
    if(!chords) {
      reject(new Error('No chords found'));
    }

    ugs.get(chords.url, (error, tab) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if(!tab.content.text) {
        reject(new Error('Tab content not found'));
      }

      resolve(Object.assign({}, chords, { html: applyBoldFormattingForChords(tab.content.text) }, retrieveCapoInfo(tab.content.text)));
      return;
    });
  });
}

function retrieveCapoInfo(metadata) {
  if(!metadata) {
    return { };
  }

  const regex = /([a-zA-Z0-9]*\sfret)/g;
  const results = metadata.match(regex);

  if(!results) {
    return { };
  }

  return { capo: results[0] };
}

function applyBoldFormattingForChords(input) {
  return input
    .replace(new RegExp(/\[ch\]/g, 'g'), '<b>')
    .replace(new RegExp(/\[\/ch\]/g, 'g'), '</b>')
}

export { getChordsForArtistAndSong, getTopChordsPage, getChords };
