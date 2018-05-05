var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '833fc9282d5d46a1be2475bbaf44432b',
    clientSecret: 'c5ab8bc64aaf4079a375f0e7be15f7fb'
  });

function getKeyForTrack(trackId) {
    return spotifyApi.clientCredentialsGrant()
        .then(data => spotifyApi.setAccessToken(data.body['access_token']))
        .then(_ => spotifyApi.getAudioAnalysisForTrack(trackId))
        .then(resp => ({ 
            key: resp.body.track.key, 
            key_confidence: resp.body.track.key_confidence,
            mode: resp.body.track.mode, 
            mode_confidence: resp.body.track.mode_confidence
        }));
}

export { getKeyForTrack };



