//author    :    veizz
//date      :   2012-08-18

//var current = '_grey';
//function updateIcon() {
//    chrome.browserAction.setIcon({path:"ico/icon_32" + current + ".ico"});
//    if (current === '_grey'){
//        current = '';
//    }
//    else{
//        current = '_grey';
//    }
//} 
//chrome.browserAction.onClicked.addListener(updateIcon);


function genericOnClick(info, tab){

    startRecording();
    return;
    chrome.tts.speak('hello world');
    console.log(info);
    console.log(tab);
    chrome.browserAction.setBadgeText({"text":"v"});
    chrome.browserAction.setBadgeBackgroundColor({"color":"#00ff00"});
    //console.log(info);
    //console.log(info.pageUrl);
    //console.log(window.getSelection());
    //console.log(window.getSelection().toString());
    //console.log(window.getSelection().anchorNode.data.toString().trim());
    var word = info.selectionText;
    //console.log('source word is : ', word);
    //add balloon
    var balloon;
    return chrome.tabs.executeScript(null, {file:'js/content.js', allFrames:true}, function(){
        return chrome.tabs.getSelected(null, function(tab){
            return chrome.tabs.sendMessage(tab.id, {'method':'prepareBalloon'}, function(res){
                //console.log(res.sentence);
                var sentence = res.sentence;
                return translate2chinese(word, function(err, data){
                    if(err){ 
                        return console.log(err);
                    }
                    //console.log(data);
                    return chrome.tabs.sendMessage(tab.id, {'method':'showResult', 'resstr':data}, function(res){
                        //console.log(res.msg);
                        var theWord = {
                            word    :   word,
                           data    :   data,
                           sentence:   sentence
                        };
                        return addToNewWordsList(theWord);
                    });
                });
            });
        });
    });
}

//add new word to new words list. include pr, translate, sentence
function addToNewWordsList(theWord){
    console.log(theWord);
}

var showResult = function(string){
    chrome.tabs.sendRequest(null, {'method':'getContextMenus', 'string':string}, function(){});
}
var id = chrome.contextMenus.create({"title":'baidu_speech', "contexts":['editable'], "onclick":genericOnClick});

function translate2chinese(source, callback){
    $.ajax({
        url : 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
        data : {
            'appId'       : '76518BFCEBBF18E107C7073FBD4A735001B56BB1',
        'text'        : source,
        'from'        : from,
        'to'          : 'zh-CHS',
        'contentType' : 'text/plain'
        },
        dataType:'text',
        success : function(resstr)  {
            //T = T.replace(/^"|"$/gi,'');
            //chrome.tabs.getSelected(null, function(tab) { // get selected string in current tab
            //    chrome.tabs.executeScript(tab.id,{file:'js/content.js',allFrames:true},function() {injCallBack(T)});
            //});
            //console.log(resstr);
            callback(null, resstr);
        },
        error : function(jqXHR, textStatus, errorThrown) {
                    //var T = 'ERROR! ' + textStatus;
                    //chrome.tabs.getSelected(null, function(tab) { // get selected string in current tab
                    //    chrome.tabs.executeScript(tab.id,{file:'js/content.js',allFrames:true},function() {injCallBack(T)});
                    //});
                    callback('ERROR:', textStatus);
                }
    });
}


var onFail = function(e) {
    console.log('Rejected!', e);
};

var onSuccess = function(s) {
    var context = new webkitAudioContext();
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();

    // audio loopback
    // mediaStreamSource.connect(context.destination);
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var recorder;
var audio = document.querySelector('audio');

firstTimeCheck();

function startRecording() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, onSuccess, onFail);

        setTimeout(function(){
            stopRecording();

            }
            , 5000
        );
    } else {
        console.log('navigator.getUserMedia not present');
    }
}

function stopRecording() {
    recorder.stop();
    recorder.exportWAV(function(s) {
        console.log(audio);
        audio.src = window.URL.createObjectURL(s);
        audio.play();
        Recorder.forceDownload(s, 'output_' + parseInt(new Date().getTime()/1000) + '.wav');
        speechRecognition(s);
        // post to server
        //window.xb = s;
    });
}

function speechRecognition(b){
    window.xb = b;
    var url = "http://vop.baidu.com/server_api";
    var fr = new FileReader();
    window.fr = fr;
    fr.readAsDataURL(b);
    fr.onload = function(){
        var params = {
            format:'wav',
            //rate:8000,
            rate:16000,
            channel:1,
            cuid:'8908bd1e130117887372a35091c48ef6',
            token:'24.f073d9e3db037ede740bbbdfeac86f5e.2592000.1419692380.282335-1615711',
            lan:'zh',
            speech:fr.result.substr(22),
            len:b.size,
        };

        var postdata = JSON.stringify(params);
        $.ajax({
            url:url,
            type:'post',
            contentType:'application/json',
            data:postdata,
            //header:"Content-Length: " + postdata.length,
            success:function(d){
                console.log(d);
            },
            error:function(e){
                console.log('e:', e);
            },
        });

        console.log(params);
    }
}

function firstTimeCheck(){
    if (!Settings.keyExists("first_time")) {
        Settings.setValue("first_time", "no");
        openOptionPage();
    }   
    return false;
}

function openOptionPage(){
    var url = "options.html";

    var fullUrl = chrome.extension.getURL(url);
    chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i in tabs) { // check if Options page is open already
            if (tabs.hasOwnProperty(i)) {
                var tab = tabs[i];
                if (tab.url == fullUrl) {
                    chrome.tabs.update(tab.id, { selected:true }); // select the tab
                    return;
                }
            }
        }
        chrome.tabs.getSelected(null, function (tab) { // open a new tab next to currently selected tab
            chrome.tabs.create({
                url:url,
                index:tab.index + 1
            });
        });
    });

}


//}
