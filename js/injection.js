if(!window.speechRecognitionInjection){
    /*
    var speech_IO_record_btn = {};
    speech_IO_record_btn.init = function(){
        $(':text:visible').each(function(ind, item){
            console.log(item);
            var max_height = $(item).height() 
                + parseInt($(item).css('margin-top'))
                + parseInt($(item).css('margin-bottom'))
                + parseInt($(item).css('border-top-width'))
                + parseInt($(item).css('border-bottom-width')) 
                + parseInt($(item).css('padding-top'))
                + parseInt($(item).css('padding-bottom'))
            ;
            var max_width = $(item).width() / 3;
            //var btn = "<button class='speech_IO_record_btn' style='display:none;'>p</button>";
            var btn = document.createElement('button');
            btn.class = 'speech_IO_record_btn';
            btn.style.display = 'inline-block';
            var pos = speech_IO_record_btn.get_position(max_width, max_height);
            btn.style.width = pos.width;
            btn.style.height = pos.height;
            btn.style.marginLeft = pos.marginLeft;
            btn.style.marginTop = pos.marginTop;
            btn.style.position = 'absolute';
            btn.style.left = $(item).offset().left + 'px';
            btn.style.top = $(item).offset().top + 'px';
            $(btn).insertAfter($(item));
        });
    }

    speech_IO_record_btn.get_position = function(max_width, max_height){
        console.log('max_height', max_height);
        var max = Math.min(max_width, max_height);
        var btn_max = 20;

        var _width = Math.min(max, btn_max);
        var _height = _width;

        console.log(max_height - _width);
        var position = {
            width:_width + 'px',
            height:_height + 'px',
            marginLeft:(- _width) + 'px',
            marginTop:((max_height - _width)/2) + 'px',
        };
        return position;
    }

    speech_IO_record_btn.init();
    */

}
window.speechRecognitionInjection = true;
