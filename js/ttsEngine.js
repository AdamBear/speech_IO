(function(){
    //var tts_url_prefix = "http://127.0.0.1/voice?word=";
    var speakListener = function(utterance, options, cb) {
        
        cb({type:'start', charIndex:0});
        console.log(utterance);
        setTimeout(function(){
            //console.log(utterance);
            //console.log(options);
            cb({type:'end', charIndex:utterance.length});
            //cb({type:'error', charIndex:utterance.length , errorMessage:'eeee'});
        }, 2000);
        //console.log(sendTtsEvent);
        //return;
        //sendTtsEvent({'event_type': 'start', 'charIndex': 0})

        // (start speaking)
        //console.log(utterance);

        //sendTtsEvent({'event_type': 'end', 'charIndex': utterance.length})
    };

    var stopListener = function() {
        // (stop all speech)
        console.log('stoped');
    };

    chrome.ttsEngine.onSpeak.addListener(speakListener);
    chrome.ttsEngine.onStop.addListener(stopListener);
})();
