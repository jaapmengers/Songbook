const osmosis = require('osmosis');

function getChordsForArtistAndSong(artist, song) {
  const results = [];
  return new Promise((resolve, reject) => {
    // Strip things like [...] - 2000 digital remaster off. We take the false positives for granted
    const url = `https://www.ultimate-guitar.com/search.php?view_state=advanced&band_name=${artist}&song_name=${strip(song)}&type%5B%5D=300&version_la=`;
    //
    // console.log('URL', url);

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
  return results.filter(x => !!x.song)
    .sort((a, b) => a.rating < b.rating);
}

function getTopChordsPage(results) {
  return results[0];
}

function getChords(chords) {
  return new Promise((resolve, reject) => {
    if(!chords) {
      reject(new Error('No chords found'));
    }

    osmosis
      .get(chords.link)
      .log(console.log)
      .find('.b-tab-meta')
      .set('metadata')
      .find('pre.js-tab-content')
      .then((i, data) => {
        resolve(Object.assign({}, chords, { html: i.innerHTML }, retrieveCapoInfo(data.metadata)))
      })
      .error(err => reject(err));
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

export { getChordsForArtistAndSong, getTopChordsPage, getChords };
