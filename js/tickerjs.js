
var ts = {
     label:"Uga BooGa Uga Uga Uga",
     globalx:500,
     vector:-1,
     interval:120,
     fontsize:16,
     canvasHeight:20,
     canvasWidth:500
};
function DLCBanner($ticker,ts,label) {
     var guid  = randomStr();
     ts.label = label;
     ts.canvasWidth = $ticker.innerWidth();
     ts.globalx      = $ticker.innerWidth();
     $ticker.html("<canvas id='" + guid + "' width='"+ ts.canvasWidth +"' height='"+ ts.canvasHeight +"'>");
     var canvas = document.getElementById(guid);
     var ctx    = canvas.getContext('2d');
     // "Bolder 16px Arial"
     ctx.font = '' +ts.fontsize + 'px Helvetica';
     ctx.textBaseline = 'top';
     var interval = setInterval( function(){ DLCBannerSet(ts,ctx); }, 1000/ts.interval );
     var json = {
          interval: interval
         };
     return(json);
}
function DLCBannerSet(ts,ctx) {
     ctx.clearRect(0, 0, ts.canvasWidth, ts.canvasHeight);    
     ctx.fillStyle = "#dfe3ee";
     ctx.fillStyle = "#5B74A8";
     // ctx.fillStyle = 'rgb(255, 255, 255)';
     ctx.fillRect (0, 0, ts.canvasWidth, ts.canvasHeight);
     // ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
     ctx.fillStyle = 'rgb(0,0,0)';
     ctx.fillStyle = "White";
     if (ts.globalx < 0 - ctx.measureText(ts.label).width) {
         ts.globalx = ts.canvasWidth;
     }  
     ctx.fillText(ts.label, ts.globalx, (ts.canvasHeight-ts.fontsize)/2);
     ts.globalx += ts.vector;
}
