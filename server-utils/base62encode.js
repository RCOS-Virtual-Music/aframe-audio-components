const MAPPING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

exports.encodeIP = function(ip) {
    // Local IP encoding
    let n = 0
    ip = ip.split('.');
    if (ip.length !== 4) { return undefined; }
    if (ip[0] === '192' && ip[1] === '168') {
      n += (parseInt(ip[2], 10)) * 256;
      n += parseInt(ip[3], 10);
    }
    else if (ip[0] === '129' && ip[1] === '161') {
      n += (parseInt(ip[2], 10)) * 256;
      n += parseInt(ip[3], 10);
      n += 65536;
    }
    else if (ip[0] === '172' && (16 <= ip[0] <= 31)) {
      n += (parseInt(ip[1], 10) - 16) * 65536;
      n += (parseInt(ip[2], 10)) * 256;
      n += parseInt(ip[3], 10);
      n += 131072;
    }
    else if (ip[0] === '10') {
      n += (parseInt(ip[1], 10)) * 65536;
      n += (parseInt(ip[2], 10)) * 256;
      n += parseInt(ip[3], 10);
      n += 1179648;
    }
    // NOTE: There is room here for dedicated IPs
    // the int range from 17956864-18000000 is unused
    else {
      n += (parseInt(ip[0], 10)) * 16777216;
      n += (parseInt(ip[1], 10)) * 65536;
      n += (parseInt(ip[2], 10)) * 256;
      n += parseInt(ip[3], 10);
      n += 18000001;
    }
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

var debug = function() {
  console.log(decodeIP(exports.encodeIP('192.168.0.0')));
  console.log(decodeIP(exports.encodeIP('192.168.134.91')));
  console.log(decodeIP(exports.encodeIP('192.168.255.255')));
  console.log();

  console.log(decodeIP(exports.encodeIP('129.161.0.0')));
  console.log(decodeIP(exports.encodeIP('129.161.134.91')));
  console.log(decodeIP(exports.encodeIP('129.161.255.255')));
  console.log();

  console.log(decodeIP(exports.encodeIP('10.0.0.0')));
  console.log(decodeIP(exports.encodeIP('10.161.134.91')));
  console.log(decodeIP(exports.encodeIP('10.255.255.255')));
  console.log();

  console.log(decodeIP(exports.encodeIP('172.16.0.0')));
  console.log(decodeIP(exports.encodeIP('172.22.134.91')));
  console.log(decodeIP(exports.encodeIP('172.31.255.255')));
  console.log();

  console.log(decodeIP(exports.encodeIP('133.16.255.0')));
  console.log(decodeIP(exports.encodeIP('654.255.134.91')));
  console.log(decodeIP(exports.encodeIP('99.31.255.0')));
  console.log();
}
