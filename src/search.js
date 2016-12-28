const osmosis = require('osmosis');

function getChordsForArtistAndSong(artist, song) {
  const results = [];
  return new Promise((resolve, reject) => {
    const url = `https://www.ultimate-guitar.com/search.php?view_state=advanced&band_name=${artist}&song_name=${song}&type%5B%5D=300&version_la=`;

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

function getTopChordsPage(results) {
  const res = results.filter(x => !!x.song & !!x.rating)
                .sort((a, b) => a.rating < b.rating);

  return res[0];
}

function getChords(url) {
  console.log('URL', url);

  return new Promise((resolve, reject) => {
    osmosis
    .get(url)
    .find('pre.js-tab-content')
    .then(i => resolve(i.innerHTML))
    .error(err => reject(err));
  });
}

export { getChordsForArtistAndSong, getTopChordsPage, getChords };
