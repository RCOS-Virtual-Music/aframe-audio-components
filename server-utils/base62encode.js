const MAPPING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

exports.encodeIP = function(ip) {
    // Local IP encoding
    let n = 0
    ip = ip.split('.');
    if (ip.length !== 4) { return undefined; }
    if (ip[0] === '192') {
        n += (parseInt(ip[2], 10)) * 256;
        n += parseInt(ip[3], 10);
    }
    else if (ip[0] === '172') {
        n += (parseInt(ip[1], 10) - 16) * 65536;
        n += (parseInt(ip[2], 10)) * 256;
        n += parseInt(ip[3], 10);
        n += 65536;
    }
    else if (ip[0] === '10') {
        n += (parseInt(ip[1], 10)) * 65536;
        n += (parseInt(ip[2], 10)) * 256;
        n += parseInt(ip[3], 10);
        n += 1114112;
    }
    else { return undefined; }
    return n;
}

exports.encode = function(n) {
    // Base 62 encoding
    if (n === 0) { return MAPPING[0]; }
    var result = '';
    while (n > 0) {
        result = MAPPING[n % MAPPING.length] + result;
        n = parseInt(n / MAPPING.length, 10);
    }
    return result;
}

exports.getCode = function(ip) {
    return encode(encodeIP(host)) + encode62(0 + 62);
}
