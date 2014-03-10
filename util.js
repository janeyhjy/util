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
}