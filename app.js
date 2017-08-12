document.addEventListener('DOMContentLoaded', function () {
  app = new Vue({
    el: '#app',
    data: {
      capo: null,
      chords: [],
      results: []
    }
  });

  // let chords = {
  //   "artist":"Wilco",
  //   "song":"Ill Fight",
  //   "link":"https://tabs.ultimate-guitar.com/w/wilco/ill_fight_crd.htm",
  //   "rating":31,
  //   "html":"<ch class=\"js-tab-char\" style=\"display: block; visibility: hidden; position: absolute; top: 0; left: 0;\">x</ch>Capo 3\n\n---\n\n[Intro:]\n<span>Am</span>  <span>C</span>  <span>Dm</span>  <span>C</span>  <span>Em7</span>\n\nVerse 1, 4:\n<span>Am</span>  <span>C</span>  <span>Dm</span>  <span>C</span>  <span>Em7</span>\n\nVerse 2, 3:\n<span>Am</span>  <span>C</span>  <span>Dm</span>  <span>C</span>  \n\n\n[Bridge: ]\n\n<span>E</span>\n<span>F</span>  <span>C</span> (x2)\n<span>F</span>  <span>G</span> (x2)\n\n---\n\n[Chorus]\n<span>Am</span>\nI'll go, I'll go, I'll go, I'll go for you\n<span>C</span>\nI'll fight, I'll fight, I'll fight, I'll fight for you\n<span>Dm</span>\nI'll kill, I'll kill, I'll kill, I'll kill for you\n<span>C</span>                <span>Em7</span>\nI will, I will, I will\n\n<span>Am</span>\nI'll go,I'll go, I'll go, I'll go for you\n<span>C</span>\nI'll fight, I'll fight, I'll fight, I'll fight for you\n<span>Dm</span>\nI'll die, I'll die, I'll die, I'll die for you\n<span>C</span>               <span>Em7</span>\nI will, I will, I will\n\n\n[Verse]\n<span>E</span>\nAnd if I die\n\nI'll die, I'll die alone on some\n<span>F</span>           <span>C</span>\nOld private hill\n<span>F</span>               <span>C</span>\nAbandoned by the mill\n<span>F</span>            \nAll my blood will\n<span>G</span>           \nSpring and spill\n<span>F</span>   \nI'll crash the air \n<span>G</span>\nand be still\n\n\n[Verse]\n<span>Am</span>\nYou'll wait\nWith the star from a dream\n                   <span>C</span>\nAnd know that I am gone\n       <span>Dm</span>\nYou'll feel it in your heart\n                 <span>C</span>\nBut not for very long\n\n<span>Am</span>\nYou'll rise each day as planned\n                   <span>C</span>\nYour will is your command\n     <span>Dm</span>\nAnd stand each Sunday\n                        <span>C</span>       <span>Em7</span>\nA hymnal steady in your hand\n\n<span>E</span>\nYou'll sing to yourself\n                       <span>F</span>\nThe rising-falling melody\n                       <span>C</span>\nThat you could never read\n<span>F</span>                    <span>C</span>\nWithout the choirs' lead\n<span>F</span>                       <span>G</span>\nStill alone, and lost in deep\n<span>F</span>                        <span>G</span>\nAnd your soul will not be free\n\n\n[Chorus]\n<span>Am</span>\nI will go , I will go, I will go\nAnd in wars waters\n<span>C</span>\nI will wade\n           <span>Dm</span>\nAnd I will know\n\nIf I remorse or regret\n                      <span>C</span>\nThe fairness of our trade\n\n<span>Am</span>\nFor you to live\n\nI took your place\n\nA deal was made\n          <span>C</span>\nAnd I was paid\n        <span>Dm</span>\nAnd the goldness\n\nI was told\n\nWas a place\n                       <span>C</span>\nWhere my body could be laid\n\n<span>E</span>\nAnd we will steal your life\n\nAnd I own\n                 <span>F</span>\nIn better homes surrounded\n       <span>C</span>\nBy your peers\n        <span>F</span>             <span>C</span>\nWithout suffering or fear\n<span>F</span>                     <span>G</span>\nGrandchildren far and near\n<span>F</span>                    <span>G</span>\nAnd none will shed a tear\n<span>F</span>                      <span>G</span>\nFor the love no longer here\n\n\n[Chorus]\n<span>Am</span>\nI'll go, I'll go, I'll go, I'll go for you\n<span>C</span>\nI will\n<span>Dm</span>\nI'll fight, I'll fight,I'll fight, I'll fight for you\n<span>C</span>                <span>Em7</span>\nI will, I will, I will\n<span>Am</span>\nI'll kill, I'll kill, I'll kill, I'll kill for you\n<span>C</span>\nI will\n<span>Dm</span>\nI'll die, I'll die, I'll die, I'll die for you\n<span>C</span>                 <span>Em7</span>\nI will, I will, I will\n\n\n[Outro]\n<span>E</span>\nAnd if I die\nI'll die\n                    <span>F</span>\nI'll die alone like Jesus\n      <span>C</span>\nOn a cross\n<span>F</span>                   <span>C</span>\nMy faith cannot by tossed\n<span>F</span>                        <span>G</span>\nAnd my life will not be lost\n<span>F</span>                <span>G</span>\nIf my love comes across ",
  //   "capo":"3rd fret"
  // };
  //
  // app.chords = Object.assign({}, chords, { parts: chords.html.split('\n\n')});

  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  console.log('Starting Receiver Manager');

  // handler for the 'ready' event
  castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState('Application status is ready...');
  };

  // handler for 'senderconnected' event
  castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);
  };

  // handler for 'senderdisconnected' event
  castReceiverManager.onSenderDisconnected = function(event) {
    console.log('Received Sender Disconnected event: ' + event.data);
    if (window.castReceiverManager.getSenders().length == 0) {
      window.close();
    }
  };

  // handler for 'systemvolumechanged' event
  castReceiverManager.onSystemVolumeChanged = function(event) {
    console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
        event.data['muted']);
  };

  // create a CastMessageBus to handle messages for a custom namespace
  window.messageBus =
    window.castReceiverManager.getCastMessageBus(
        'urn:x-cast:com.jaapmengers.cast.songbook');

  // handler for the CastMessageBus message event
  window.messageBus.onMessage = function(event) {
    let chords = event.data;

    console.log(typeof(chords));

    app.chords = Object.assign({}, chords, { parts: chords.html.split('\n\n')});

    window.messageBus.send(event.senderId, event.data);
  }

  // initialize the CastReceiverManager with an application status message
  window.castReceiverManager.start({statusText: 'Application is starting'});
  console.log('Receiver Manager started');

});

// utility function to display the text message in the input field
function displayText(text) {
  console.log(text);
  document.getElementById('message').innerText = text;
  window.castReceiverManager.setApplicationState(text);
};
