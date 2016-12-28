const osmosis = require('osmosis');

exports.getChordsForArtistAndSong = function(artist, song) {
  const results = [];
  return new Promise((resolve, reject) => {
    const url = `https://www.ultimate-guitar.com/search.php?view_state=advanced&band_name=${artist}&song_name=${song}&type%5B%5D=300&version_la=`;
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
    // .log(console.log)
    .error(err => reject(err));
  });
}
