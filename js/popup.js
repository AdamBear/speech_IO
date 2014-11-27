function checkMode(){
    var mode = localStorage.getItem('t2c_mode');
    var from = localStorage.getItem('t2c_from');

    console.log(mode);
    if(mode == 'read'){
        $(".popup_menu a span")[0].innerText = "✔";
    }
    else if (mode == 'learn'){
        $(".popup_menu a span")[1].innerText = "✔";
    }
    
    if(from == 'en'){
        $(".language_menu a span")[0].innerText = "✔";
    }
    else if (from == 'ru'){
        $(".language_menu a span")[1].innerText = "✔";
    }
 
}

$(".language_menu a").click(function(){
    console.log(localStorage.length);
    $(".language_menu a").find('span').html("");
    $(this).find("span").html("✔");
    if( $(this).html().indexOf('英语') > 0 ){
        localStorage.setItem('t2c_from', 'en');
    }
    else if( $(this).html().indexOf('俄语') > 0 ){
        localStorage.setItem('t2c_from', 'ru');
    }

    return false;
});

$(".popup_menu a").click(function(){
    //alert($(this).html());
    console.log(localStorage.length);
    $(".popup_menu a").find('span').html("");
    $(this).find("span").html("✔");
    if( $(this).html().indexOf('快速阅读') > 0 ){
        console.log('read');
        localStorage.setItem('t2c_mode', 'read');
    }
    else if( $(this).html().indexOf('学习模式') > 0 ){
        localStorage.setItem('t2c_mode', 'learn');
    }

return false;
});
$(document).ready(function(){
    checkMode();
    console.log('xxxx');
    console.log(localStorage.length);
});
