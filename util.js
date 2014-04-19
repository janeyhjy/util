//test 
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
        "q+": Math.floor((_date.getMonth() + 1) / 3), //quarter
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
//判断手机类型
util.device = (function() {
    var _iphoneRegex = /iPhone/i;
    var _winphoneRegex = /IEMobile/i;
    var _androidRegex = /Android/i;
    var _isIOS = function(_userAgent) {
        if(_iphoneRegex.test(_userAgent)) {
            return true;
        }
        return false;
    }
    var _isAndroid = function(_userAgent) {
        if(_androidRegex.test(_userAgent)) {
            return true;
        }
        return false;
    }
    var _isWinPhone = function(_userAgent) {
        if(_winphoneRegex.test(_userAgent)) {
            return true;
        }
        return false;
    }
    return {
        isIOS: _isIOS,
        isAndroid: _isAndroid,
        isWinPhone: _isWinPhone
    }
})();
/*
  <meta name="viewport" content="
    height=[pixed_value|device-height],
    width=[pixed_value|device-width], //iphone下有效。 android4.0以上有效，但以target-densitydpi为准
    initial-scale=float_value,
    minimum-scale=float_value,
    maxmum-scale=float_value,
    user-scalable=[yes|no],
    target-densitydpi=[dpi_value(70-400)|device-dpi|high-dpi(240)|medium-dpi(160)|low-dpi(120)]" //android有效
  />
*/
//android手机分辨率: window.screen.width | window.screen.height
//设备像素比: window.devicePixelRatio: 0.75|1|1.5|2|2.25|3 (iphone: 1|2)

//手机屏幕自适应（缩放）dependence:jquery
util.mobileScreenAdaption = function(content) {
    var _userAgent = navigator.userAgent;
    var _viewport = document.getElementByName("viewport")[0];
    if(!_viewport) {
        _viewport = document.createElement("meta");
        _viewport.name = "viewport";
        document.head.appendChild(_viewport);
    };
    /*
    var PHONEHeight = function() {
        if(document.compatMode == "CSS1Compat") {
            return document.documentElement.clientHeight;
        } else {
            return document.body.clientHeight;
        }
    }
    */
    var _defaults = {
        width: "100%",
        //height: PHONEHeight(),
        init_scale: 1.0, //最大1.69
        max_scale: 1.0,
        min_scale: 1.0,
        user_scalable: "no",
        target_densitydpi: "device-dpi", //andriod
        clientW: document.documentElement.clientWidth,
        screenW: window.screen.width
    };
    var _formatViewportContent = function(obj) {
        if(obj.width == "100%") {
            obj.width = "device-width";
            obj.init_scale = 1.0;
            obj.target_densitydpi = "device-dpi";
        } else if(typeof obj.width == "number") {
            obj.init_scale = (obj.screenW / obj.width).toFiexed(4);
            if(util.device.isAndroid(_userAgent)) {
                //target-densitydpi = UI-width/device-width*window.devicePixelRatio*160;
                obj.target_densitydpi = (obj.width/2.25714).toFixed(4);
                if(obj.target_densitydpi < 70) {
                    obj.target_densitydpi = 70;
                } else if(obj.target_densitydpi > 400) {
                    obj.target_densitydpi = 400;
                }
            }
        }
        var meta_content =  "width=" + obj.width +
               //", height=" + obj.height +
               ", minimum-scale=" + obj.min_scale +
               ", maximum-scale=" + obj.max_scale +
               ", initial-scale=" + obj.init_scale +
               ", user-scalable=" + obj.user_scalable +
               ", target-densitydpi=" + obj.target_densitydpi;
        return meta_content;
    }
    var _content = "";
    if(typeof content == "string") {
        _content = content;
    } else if(typeof content == "object") {
        _content = _formatViewportContent($.extend(_defaults, content));
    } else {
        _content = _formatViewportContent(_defaults);
    }
    _viewport.content = _content;
};

//操作cookie expires: 过期时间可不写,为防止特殊符号，可用安全的base64进行编码
util.cookie = {
    setItem: function(key, value) {
        document.cookie = key + "=" + escape(value) + ";expires=" + new Date(new Date().getFullYear() + 10 + "-1-1").toGMTString();
    },
    getItem: function(key) {
        var str = "";
        var regex1 = new RegExp("\\;?\\s*" + key + "\\=[a-zA-z0-9]*\\;", "gi");
        var regex2 = new RegExp('([\\;\\s\\=]|' + key + ')*', "gi");
        var arr = document.cookie.match(regex1);
        if(!!arr && arr[0]) {
            str = arr[0].replace(regex2, "");
        }
        return unescape(str);
    }
}
//test
$(function() {

})
