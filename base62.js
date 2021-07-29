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

exports.decodeIP = function(n) {
    ip = ['', '', '', '']
    // 10.x.x.x
    if (n >= 1114112) {
        ip[0] = "10";
        n -= 1114112;
        ip[1] = (Math.floor(n / 65536)).toString();
        n -= Math.floor(n / 65536) * 65536;
        ip[2] = (Math.floor(n / 256)).toString();
        ip[3] = ((n % 256)).toString();
    }
    // 172.x.x.x
    else if (n >= 65536) {
        ip[0] = "172";
        n -= 65536;
        ip[1] = (Math.floor(n / 65536) + 16).toString();
        n -= Math.floor(n / 65536) * 65536;
        ip[2] = (Math.floor(n / 256)).toString();
        ip[3] = ((n % 256)).toString();
    }
    // 192.168.x.x
    else {
        ip[0] = "192";
        ip[1] = "168";
        ip[2] = (Math.floor(n / 256)).toString();
        ip[3] = ((n % 256)).toString();
    }
    return `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
}

exports.decode = function(str) {
    // Base 62 decoding
    var n = 0;
    for (let i = 0; i < str.length ; i++) {
        var p = MAPPING.indexOf(str[i]);
        if (p < 0) { return NaN; }
        n += p * Math.pow(MAPPING.length, str.length - 1 - i);
    }
    // Local IP decoding
    return n;
}

exports.getCode = function(ip) {
    return encode(encodeIP(host)) + encode62(0 + 62);
}
