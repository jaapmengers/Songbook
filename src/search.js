const osmosis = require('osmosis');

function getChordsForArtistAndSong(artist, song) {
  const results = [];
  return new Promise((resolve, reject) => {
    // Strip things like [...] - 2000 digital remaster off. We take the false positives for granted
    const url = `https://www.ultimate-guitar.com/search.php?view_state=advanced&band_name=${artist}&song_name=${strip(song)}&type%5B%5D=300&version_la=`;

    console.log('URL', url);

    osmosis
    .get(url)
    // Let's assume search only ever yields one artist because we explicitly provide it in the query.
    // Due to the structure of the site, support for multiple artists is tricky.
    .set({
      'artist': '.search_art'
    })
    .find('.tresults > tr')
    .set({
      'song': '.search-version--td .result-link',
      'link': '.search-version--td .result-link@href',
      'rating': '.ratdig'
    })
    .then((i, item) => {
      let res = Object.assign({}, item, { rating: item.rating ? parseInt(item.rating) : 0 });
      results.push(res);
    })
    .done(() => resolve(orderByRating(results)))
    .error(err => reject(err));
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
  return results.filter(x => !!x.song & !!x.rating)
    .sort((a, b) => a.rating < b.rating);
}

function getTopChordsPage(results) {
  return results[0];
}

function getChords(chords) {
  return new Promise((resolve, reject) => {
    osmosis
    .get(chords.link)
    .find('pre.js-tab-content')
    .then(i => resolve(Object.assign({}, chords, { html: i.innerHTML })))
    .error(err => reject(err));
  });
}

export { getChordsForArtistAndSong, getTopChordsPage, getChords };
