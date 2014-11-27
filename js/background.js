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
/*
*/
function translate2chinese(source, callback){
    var mode = localStorage.getItem('t2c_mode');
    if(mode == 'learn' && source.trim().indexOf(' ') < 0){
        //iciba don't support sentence translate
        return translate2chineseByIciba(source, callback);
    }
    var from = localStorage.getItem('t2c_from');
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

function translate2chineseByIciba(source, callback){
    var source = encodeURIComponent(source);

    $.ajax({
        url : 'http://dict-co.iciba.com/api/dictionary.php',
        data : {
            'w' : source
        },
        dataType:'xml',
        success : function(resxml)  {

            var resjson = $.xml2json(resxml);
            console.log(resjson);
            var resstr = '';
            resstr += resjson.key + '\n';
            resstr += typeof resjson.ps === 'string' ? '[' + resjson.ps + ']\n' : '[' + resjson.ps[0] + '] , [' + resjson.ps[1] + ']\n';
            resstr += resjson.acceptation;
            callback(null,resstr); 
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

//function x(){

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

function startRecording() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, onSuccess, onFail);
    } else {
        console.log('navigator.getUserMedia not present');
    }
}

function stopRecording() {
    recorder.stop();
    recorder.exportWAV(function(s) {
        speechRecognition(s);
        // post to server
        //window.xb = s;
        //audio.src = window.URL.createObjectURL(s);
    });
}

function speechRecognition(b){
    window.xb = b;
    var url = "http://vop.baidu.com/server_api";
    var fr = new FileReader();
    fr.readAsDataURL(b);
    fr.onload = function(){
        var params = {
            format:'wav',
            rate:8000,
            channel:1,
            cuid:'8908bd1e130117887372a35091c48ef6',
            token:'24.f073d9e3db037ede740bbbdfeac86f5e.2592000.1419692380.282335-1615711',
            lan:'zh',
            speech:fr.result,
            len:b.size,
        };

        var postdata = JSON.stringify(params);
        $.ajax({
            url:url,
            type:'post',
            contentType:'application/json',
            data:postdata,
            header:"Content-Length: " + postdata.length,
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



//}
