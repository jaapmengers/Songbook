const osmosis = require('osmosis');

function getChordsForArtistAndSong(artist, song) {
  const results = [];
  return new Promise((resolve, reject) => {
    // Strip things like [...] - 2000 digital remaster off. We take the false positives for granted
    const url = `https://www.ultimate-guitar.com/search.php?view_state=advanced&band_name=${artist}&song_name=${strip(song)}&type%5B%5D=300&version_la=`;

    console.log('URL', url);

    osmosis
    .get(url)
    .find('.tresults > tr')
    .set({
      'song': '.search-version--td > .search-version--link',
      'link': '.search-version--td > .search-version--link > a@href',
      'rating': '.ratdig'
    })
    .then((i, item) => {
      let res = Object.assign({}, item, { rating: item.rating ? parseInt(item.rating) : 0 });
      results.push(res);
    })
    .done(() => resolve(results))
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

function getTopChordsPage(results) {
  const res = results.filter(x => !!x.song & !!x.rating)
                .sort((a, b) => a.rating < b.rating);

  return res[0];
}

function getChords(url) {
  return new Promise((resolve, reject) => {
    osmosis
    .get(url)
    .find('pre.js-tab-content')
    .then(i => resolve(i.innerHTML))
    .error(err => reject(err));
  });
}

export { getChordsForArtistAndSong, getTopChordsPage, getChords };
