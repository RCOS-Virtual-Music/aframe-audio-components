const MAPPING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

AFRAME.registerComponent('osc-decoder', {
    init: function () {},
    decode62: function(str) {
        // Base 62 decoding
        var n = 0;
        for (let i = 0; i < str.length ; i++) {
            var p = MAPPING.indexOf(str[i]);
            if (p < 0) { return NaN; }
            n += p * Math.pow(MAPPING.length, str.length - 1 - i);
        }
        return n;
    },
    decodeIP: function(n) {
        ip = ['', '', '', '']
        // Public IPs
        if (n >= 18000001) {
          n -= 18000001;
          ip[0] = (Math.floor(n / 16777216)).toString();
          n -= Math.floor(n / 16777216) * 16777216;
          ip[1] = (Math.floor(n / 65536)).toString();
          n -= Math.floor(n / 65536) * 65536;
          ip[2] = (Math.floor(n / 256)).toString();
          ip[3] = ((n % 256)).toString();
        }
        // Reserved IPs
        else if (n >= 17956864) {
          // Note: these should never be assigned as of now
          return '127.0.0.1';
        }
        // 10.xxx.xxx.xxx
        else if (n >= 1179648) {
            ip[0] = "10";
            n -= 1179648;
            ip[1] = (Math.floor(n / 65536)).toString();
            n -= Math.floor(n / 65536) * 65536;
            ip[2] = (Math.floor(n / 256)).toString();
            ip[3] = ((n % 256)).toString();
        }
        // 172.xx.xxx.xxx
        else if (n >= 131072) {
            ip[0] = "172";
            n -= 131072;
            ip[1] = (Math.floor(n / 65536) + 16).toString();
            n -= Math.floor(n / 65536) * 65536;
            ip[2] = (Math.floor(n / 256)).toString();
            ip[3] = ((n % 256)).toString();
        }
        // 129.161.xxx.xxx
        else if (n >= 65536) {
            ip[0] = "129";
            ip[1] = "161";
            n -= 65536;
            ip[2] = (Math.floor(n / 256)).toString();
            ip[3] = ((n % 256)).toString();
        }
        // 192.168.xxx.xxx
        else {
            ip[0] = "192";
            ip[1] = "168";
            ip[2] = (Math.floor(n / 256)).toString();
            ip[3] = ((n % 256)).toString();
        }
        return `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
    }
})
