//author    :    veizz
//date      :   2012-08-18

function genericOnClick(info, tab){
    console.log(info);
    console.log(tab);
    // set tip recording
    sendCmd('showTip', {msg:'正在识别中...'});
    startRecording();
    return;
}

var showResult = function(string){
    chrome.tabs.sendRequest(null, {'method':'getContextMenus', 'string':string}, function(){});
}
//var id = chrome.contextMenus.create({"title":'baidu_speech', "contexts":['editable'], "onclick":genericOnClick});
var id = chrome.contextMenus.create({
    title:'语音识别', 
    id: 'recog_menu_btn',
    contexts:['editable'], 
    onclick:genericOnClick
});


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

        setTimeout(
            function(){
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
        //console.log(audio);
        audio.src = window.URL.createObjectURL(s);
        //audio.play();
        //Recorder.forceDownload(s, 'output_' + parseInt(new Date().getTime()/1000) + '.wav');
        speechRecognition(s,function(err, text){
            if(!err){
                sendCmd('closeTip', {});
                return fillText(text);
            }
            else{
                sendCmd('closeTip', {timeout:2000, msg:'未能识别，请重试'});
            }
        });
        // post to server
        window.xb = s;
    });
}

function speechRecognition(b, callback){
    // TODO: tip 正在识别
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
            //token:'24.f073d9e3db037ede740bbbdfeac86f5e.2592000.1419692380.282335-1615711',
            token:'24.0ad4f7db90cba5cf0615889d92ce6f66.2592000.1420046822.282335-4815863',
            lan:'zh',
            speech:fr.result.substr(22),
            len:b.size,
        };
        console.log(params);

        var postdata = JSON.stringify(params);
        $.ajax({
            url:url,
            type:'post',
            contentType:'application/json',
            data:postdata,
            //header:"Content-Length: " + postdata.length,
            success:function(d){
                console.log(d);
                if(callback){
                    var recogedtext = '';
                    if(d.err_no == 0){
                        recogedtext = d.result[0];
                        return callback(0, recogedtext);
                    }
                    else{
                        return callback(d.err_no, '');
                    }
                }
            },
            error:function(e){
                console.log('e:', e);
                var recogedtext = '未识别请重试';
                return callback('');
            },
        });

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

function fillText(s){
    return sendCmd('fillText', {msg:s});
}

function sendCmd(cmd, obj){
    return chrome.tabs.executeScript(null, {file:'js/content.js', allFrames:true}, function(){
        return chrome.tabs.getSelected(null, function(tab){
            return chrome.tabs.sendMessage(tab.id, {'method':cmd, params:obj}, function(res){

            });
        });
    });
}


//}
