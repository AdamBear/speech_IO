(function(){
    var speakListener = function(utterance, options, sendTtsEvent) {
        console.log(utterance);
        console.log(options);
        //console.log(sendTtsEvent);
        //return;
        sendTtsEvent({'event_type': 'start', 'charIndex': 0})

        // (start speaking)
        //console.log(utterance);

        sendTtsEvent({'event_type': 'end', 'charIndex': utterance.length})
    };

    var stopListener = function() {
        // (stop all speech)
        console.log('stoped');
    };

    chrome.ttsEngine.onSpeak.addListener(speakListener);
    chrome.ttsEngine.onStop.addListener(stopListener);

})();
