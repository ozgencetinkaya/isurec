String.prototype.parseFloat = function(def) {
    var str = this.trim();
    if (str.indexOf(',') !== -1)
        str = str.replace(',', '.');
    var num = +str;
    return isNaN(num) ? (def || 0) : num;
};


exports.urlSplit = function(url, noLower) {

    var arr;

    if (!noLower) {
        arr = F.temporary.other[url];
        if (arr)
            return arr;
    }

    if (!url || url === '/') {
        arr = ['/'];
        return arr;
    }

    var prev = false;
    var key = '';
    var count = 0;

    arr = [];

    for (var i = 0, length = url.length; i < length; i++) {
        var c = url[i];

        if (c === '/') {
            if (key && !prev) {
                arr.push(key);
                count++;
                key = '';
            }
            continue;
        }

        key += noLower ? c : c.toLowerCase();
        prev = c === '/';
    }

    if (key)
        arr.push(key);
    else if (!count)
        arr.push('/');

    return arr;
};

exports.parseURI = function(req) {

    var is_query = req.url.indexOf('?', 1);
    var query = null;
    var pathname;

    if (is_query  === -1) {
        is_query  = null;
        pathname = req.url;
    } else {
        pathname = req.url.substring(0, is_query );
        is_query  = req.url.substring(is_query );
        query = is_query .substring(1);
    }

    req.url = pathname;
    if (is_query )
        req.url += is_query ;


    return {  pathname: pathname, query: query, search: is_query };
};