if(!window.speechRecognition){
    //var balloon;
    var speech_IO = {};

    speech_IO.showTip = function(tip){
        console.log(tip);
        var pTip;
        if(pTip = document.getElementById('speech_IO_tip')){
            pTip.innerText = tip;
            pTip.style.display = 'block';
        }
        else{
            pTip = document.createElement('p');
            pTip.id = 'speech_IO_tip';
            pTip.innerText = tip;
            pTip.style.display = 'block';
            document.body.insertBefore(pTip, document.body.firstChild);
        }
    }
    speech_IO.closeTip = function(){
        console.log('close tip');
        var pTip = document.getElementById('speech_IO_tip');
        pTip.style.display = 'none';
    }


    chrome.extension.onMessage.addListener(
            function (req, sender,sendResponse) {
                console.log(req);
                switch(req.method){
                    case 'fillText':
                        //console.log(req.params.msg);
                        document.activeElement.value = req.params.msg;
                        break;
                    case 'showTip':
                        speech_IO.showTip(req.params.msg);
                        break;
                    case 'closeTip':
                        speech_IO.closeTip();
                        break;
                    default:
                        break;
                }
            }
            );

}
window.speechRecognition = true;
