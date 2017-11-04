function randomStr() {
     return randomString(6)
}
var alphaSetConstant = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var charSetConstant  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomString(len) {
     var r        = Math.floor(Math.random() * alphaSetConstant.length);
     var alpha    = alphaSetConstant.substring(r, r+1);
     
     var randomString = alpha;
     for (var i = 1; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSetConstant.length);
          randomString += charSetConstant.substring(randomPoz,randomPoz+1);
     }
     return randomString;
}
