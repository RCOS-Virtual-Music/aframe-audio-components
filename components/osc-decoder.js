const MAPPING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
})
