$(document).ready(function(){
    var bg = chrome.extension.getBackgroundPage();
    $('#option_page').click(function(){
        // open option page
        return bg.openOptionPage();
    });
    $('#about_page').click(function(){
        // open about page
        alert("浏览器语音输入输出扩展\n由百度语音(http://yuyin.baidu.com)提供服务");
    });
});
