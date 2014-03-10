var util = util || {}
//根据 key 取 url中的参数
util.getParams = function(key) {
    var param = "";
    var search = location.search;
    if(!!search) {
        var regex = new RegExp(key +"\\=\\w*[^\\w]{0}", "gi");
        var match_arr = search.match(regex);
        if(!!match_arr) {
            param = match_arr[0].replace(key + "\=", "");
        }
    }
    return param;
};
util.dateFormat = function(time, format) {
    var _date = new Date();
    if(!!time) {
        if(!isNaN(Number(time))) {
            time = Number(time);
        } else if(typeof time == "string") {
            time = util.replace(time, "-", "/");//IOS7不支持2014-3-8 10:02:10这种格式的new Date()
        }
        _date = new Date(time);
    };
    var _o = {
        "M+": _date.getMonth() + 1, //month
        "d+": _date.getDate(), //date
        "h+": _date.getHours(), //hour
        "m+": _date.getMinutes(), //minutes
        "s+": _date.getSeconds(), //seconds
        "S": _date.getMilliseconds() //millisecond
    }
    if(!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, String(_date.getFullYear()).substr(4 - RegExp.$1.length));
    }
    for(var _k in _o) {
        if(new RegExp("(" + _k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? _o[_k] : ("00" + _o[_k]).substr(String(_o[_k]).length));
        }
    }
    return format;
}
util.replace = function(originalStr, originaText, replaceText) {
    if(!!originaText && typeof originaText == "string") {
        //$1 匹配第一个（）的内容， $2 匹配第二个 () 的内容 $1$2.....$99
        originaText = originaText.replace(/([\\\.\(\)\[\]\{\}\?\*\&\%\$\+\=\-\_\^\#\@\~\`\,\!\|\/\"\"\'\'\:\;\<\>])/gi, "\\$1");
        return originalStr.replace(new RegExp(originaText, "gi"), replaceText);
    }
};
util.mobileScreenAdaption = (function() {
    var viewport = document.getElementByName("viewport");
    var settings = {
        width: "100%",
        height: "100%",
    };
    return {
        init: function() {

        }
    }
});