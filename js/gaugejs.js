// http://stackoverflow.com/questions/8542746/store-json-object-in-data-attribute-in-html-jquery
// var getBackMyJSON = $('#myElement').data('key');
// *********************************************************************************************
// PLUGIN
// *********************************************************************************************
//TRO
function DLCGaugeGetConfig() { 
var json = { bValueTitle:0,
           fillColor:"#dfe3ee",
           gaugeWidth:310,
           gaugeColor:"#B8B8B8", 
           gaugeSetColor:"Lime",
           gaugeSetSecondColor:"Blue", 
           gaugeSetThirdColor:"Red", 
           gaugeTextColor:"Black", 
	   gTitleFont: "bold 12px Arial",
	   gTitleColor: "Black",
	   gTextFont: "Bolder 16px Arial",
	   gUnitsFont: "9px Arial",
	   gFloorFont: "10px Arial",
	   gCeilingFont: "10px Arial",
	   gFloorColor: "Black",
	   gCeilingColor: "Black",
           gDisplayTitle:1,
           gPrefix:"",
           gUrl:"",
           gWidth:190,
           gKThousandsFloorCeil:1,
           gKThousandsValueText:0,
           gFloor:0, gCeil:15, gUnits:"", gTitle:""
         }
        // Deep copy
        return (jQuery.extend(true, {}, json));
}
function DLCGaugeSet(g, v, u, t)  {
t = "TITLE"
        var vActual = v;
        DLCGaugeValue(g, v);
        DLCGaugeValueText(g, v, "", 1);
        DLCGaugeValueUnits(g, u );
        DLCGaugeSetTitle(g, t );
}

(function ( $ ) {
    $.fn.thegauge = function(options) {
        if (options.gUrl == "") return this;
        var jsonObject = DLCGauge(this, $.extend(DLCGaugeGetConfig(), options));
        DLCGaugeInit(jsonObject);
        this.data('dlcgauge',jsonObject);
        return this;
    };
}( jQuery ));


(function ( $ ) {
    $.fn.gaugeset = function(v, t) {
        var g = this.data('dlcgauge');
        DLCGaugeInit(g);
        DLCGaugeSet(g, v, g.UNITS, t);
        return this;
    };
}( jQuery ));



(function ( $ ) {
    $.fn.gaugesettwovalues = function(v1,v2) {
        DLCGaugeSetTwoValue(this.data('dlcgauge'), v1, v2);
        return this;
    };
}( jQuery ));

(function ( $ ) {
    $.fn.DLC = function(action, op1, op2) {
        if ( action == "div") {
            // op1 is id
            this.append("<div id='"+op1+"'></div>");
        }
        if ( action == "a") {
            // op1 is name
            // op2 is class
            if (op2 == "") 
                 this.append("<a id='" +op1 + "'></a>");
            else
                 this.append("<a class='" + op2 + "' id='" +op1 + "'></a>");
        }
        if ( action == "ticker") {
              $.getJSON( "p1?env=UNLK&op=instancecountall",function( data ) { 
                   if (typeof GlobalBannerInterval !== "undefined") 
                        clearInterval(GlobalBannerInterval);
                   var i = 0; 
                   var sz = ""; 
                   for (j=0;j<1;j++)
                        for (i=0;i<data.rows.length;i++) sz = sz + data.rows[i].c[3].v;
                   var b = DLCBanner(this,ts,sz); 
                   GlobalBannerInterval = b.interval;
              });
              $.ajaxSetup({ async: false });
        }
        return this;
    };
}( jQuery ));
// *********************************************************************************************
function gaugehelper($sel,url, options) {
     $.getJSON(url,function( data ) {
          if (options.gValues <= 1) $sel.gaugeset(data.rows[0].c[options.gIndex1].v);
          if (options.gValues == 2)
             $sel.gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                    data.rows[0].c[options.gIndex2].v);
          if (options.gValues == 3)
             $sel.gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                    data.rows[1].c[options.gIndex2].v);
     });
}

function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }
// Using Math.round() will give you a non-uniform distribution!
// gaugeSetColor:"#5B74A8",
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function DLCGauge($sel,gs) {
        // **************************************************
        // Apply Limiters On Configuration Values
        if (gs.gWidth>=800) gs.gWidth = 800;
        if (gs.gWidth<=110) gs.gWidth = 110;
        var sz = "";
        var n;
        var guid = randomStr();
        var height_offset_top    = (Math.floor(gs.gWidth/12));
        var height_offset_bottom = (Math.floor(gs.gWidth/8));
        // **************************************************
        n =(Math.floor(gs.gWidth/2) + height_offset_top + height_offset_bottom);
        $sel.html("<canvas id='" + guid + "' width='"+ gs.gWidth +"' height='"+ n +"'>");
	//canvas initialization
	var canvas = document.getElementById(guid);
	var ctx = canvas.getContext("2d");
	//dimensions
	var W  = canvas.width;
	var H  = canvas.height;
	var R  = W/3;
	var LW = R/2;
	var WA = W/2;
	var HA = H - height_offset_bottom;
        var json ={ctx:ctx,
                   gs:gs,
                   V:0,W:W,H:H,R:R,WA:WA,HA:HA,LW:LW,
	           FLOORCOLOR:gs.gFloorColor,
	           CEILCOLOR:gs.gCeilingColor,
                   FILLCOLOR:gs.fillColor,
                   BGCOLOR:gs.fillColor,
                   GAUGECOLOR:gs.gaugeColor,
                   TEXTCOLOR:gs.gaugeTextColor, 
                   SETCOLOR1:gs.gaugeSetColor, 
                   SETCOLOR2:gs.gaugeSetSecondColor, 
                   SETCOLOR3:gs.gaugeSetThirdColor, 
                   PREFIX:gs.gPrefix, 
                   TEXTFONT:gs.gTextFont, 
                   TITLEFONT:gs.gTitleFont, 
                   TITLECOLOR:gs.gTitleColor, 
                   UNITSFONT:gs.gUnitsFont, 
                   WIDTH:gs.gWidth,
                   FLOOR:gs.gFloor,
                   CEIL:gs.gCeil,
                   UNITS:gs.gUnits,
                   KTHOUSANDSFLOORCEIL:gs.gKThousandsFloorCeil,
                   KTHOUSANDSVALUETEXT:gs.gKThousandsValueText,
                   HEIGHT_OFFSET_BOTTOM: height_offset_bottom,
                   HEIGHT_OFFSET_TOP: height_offset_top,
                   TITLE: gs.gTitle
                  }
        return(json)

}
function DLCGaugeInit(g) {
        var sz;
        var n;
        var pos;
        //Clear the canvas everytime a chart is drawn
        g.ctx.clearRect(0, 0, g.W, g.H);
        // ***************************************************
	// Rectangle
	g.ctx.beginPath();
	g.ctx.strokeStyle = g.BGCOLOR;
        g.ctx.rect(0,0, g.W, g.H);
        g.ctx.fillStyle = g.BGCOLOR;
        g.ctx.fill();
        g.ctx.lineWidth = 1;
        g.ctx.strokeStyle = 'white';
        g.ctx.stroke();
        g.ctx.closePath();
        if ( 1 == 0 ) {
        // ***************************************************
	// Line 
	g.ctx.beginPath();
	g.ctx.strokeStyle = g.BGCOLOR;
        g.ctx.rect(4,g.HA, g.W-8, 1);
        g.ctx.fillStyle = 'black';
        g.ctx.fill();
        g.ctx.lineWidth = 1;
        g.ctx.strokeStyle = 'black';
        g.ctx.stroke();
        g.ctx.closePath();
        }
        // ***************************************************
	// Gauge Background
        g.ctx.beginPath();
        g.ctx.strokeStyle = g.GAUGECOLOR;
	g.ctx.lineWidth = Math.floor(g.LW/1);
        //  arc(center-x,  center-y,   radius,   start,  stop,      Counter Clockwise)
        //  9 oclock is  1.0 PI
        // 12 oclock is  1.5 PI
	g.ctx.arc(g.WA,        g.HA,        g.R,        Math.PI,      Math.PI*2, false);
	g.ctx.stroke();
        g.ctx.closePath();

        g.ctx.beginPath();
        g.ctx.strokeStyle = "blue";
	g.ctx.lineWidth = Math.floor(g.LW/5);
	g.ctx.arc(g.WA,        g.HA,        g.R,        Math.PI,      Math.PI*2, false);
	g.ctx.stroke();
        g.ctx.closePath();

        // ***************************************************
	// Gauge Floor Value
	g.ctx.beginPath();
	g.ctx.fillStyle = g.FLOORCOLOR;
        g.ctx.font = adjustfont(g.WIDTH,110,8,1);
        n = adjustfontvalue(g.WIDTH,110,8,1);
        sz = g.FLOOR;
        if (g.KTHOUSANDSFLOORCEIL == 1 ) if (g.FLOOR >=1000) sz=Math.floor(g.FLOOR/1000) + "K";
        pos = (g.WA - g.R) - (g.ctx.measureText(sz).width/2);
        g.ctx.fillText(sz,  pos, g.HA+n);
	g.ctx.stroke();
        g.ctx.closePath();
        // ***************************************************
	// Gauge Ceiling Value
	g.ctx.beginPath();
	g.ctx.fillStyle = g.CEILCOLOR;
        g.ctx.font = adjustfont(g.WIDTH,110,8,1);
        n = adjustfontvalue(g.WIDTH,110,8,1);
        sz = g.CEIL;
        if (g.KTHOUSANDSFLOORCEIL == 1 ) if (g.CEIL >=1000) sz=Math.floor(g.CEIL/1000) + "K";
        pos = (g.WA + g.R) - (g.ctx.measureText(sz).width/2);
        g.ctx.fillText(sz,  pos, g.HA+n);
	g.ctx.stroke();
        g.ctx.closePath();
        // ***************************************************
	// TITLE
	g.ctx.beginPath();
	g.ctx.fillStyle = g.CEILCOLOR;
        g.ctx.fillText(g.TITLE, g.W/2 - (g.ctx.measureText(g.TITLE).width/2), g.H-Math.floor(g.R*1.75) );
	g.ctx.stroke();
        g.ctx.closePath();
        // ***************************************************
}

function DLCGaugeSetText(g, v)  {
        DLCGaugeValueText(g, v, "", 1);
}
function DLCGaugeSetTwoValue(g, v1, v2)  {
        var i1 = parseInt(v1);
        var i2 = parseInt(v2);
        if ( parseInt(v1) >= parseInt(v2) ) {
             DLCGaugeValue(g, v1, g.SETCOLOR1);
             DLCGaugeValue(g, v2, g.SETCOLOR2);
        }
        else {
             DLCGaugeValue(g, v2, g.SETCOLOR2);
             DLCGaugeValue(g, v1, g.SETCOLOR1);
        }
        if (i1 >=1000) v1=Math.floor(i1/1000) + "K";
        if (i2 >=1000) v2=Math.floor(i2/1000) + "K";
        var sz = v2 + "/" + v1;
        DLCGaugeValueText(g, sz);
        DLCGaugeValueUnits(g, g.UNITS );
}


function DLCGaugeSetTitle(g, title ) {
        var n;
        var BF = 12;
	g.ctx.beginPath();
        // http://www.w3schools.com/tags/canvas_font.asp
	g.ctx.fillStyle = g.TITLECOLOR;

        // n = adjustfontvalue(g.WIDTH,110,BF,1);
        // ******************************************************
        // ** Width Adjustor
        var f = 1.00;
        g.ctx.font = adjustfont(g.WIDTH,110,8,f);
        while (f > 0.00) {
             if (g.ctx.measureText(title).width > g.WIDTH) {
                  f = f - 0.01;
                  if (f <= 0.00) break;
                  g.ctx.font = adjustfont(g.WIDTH,110,BF,f);
             } else {
                  break;
             } 
        }
        // ******************************************************
        
        g.ctx.fillText(title, g.W/2 - (g.ctx.measureText(title).width/2), g.H-Math.floor(g.R*1.75) );
        g.ctx.closePath();
}
function DLCGaugeValue(g, v, color)  {
        var vv = v;
        var aa = v;
        // if (vv > g.CEIL) vv = g.CEIL;
        vv = Math.ceil( (vv/g.CEIL) * 180 );
	var radians = vv / 180;
// alert(v + " " + vv + " " + radians);
	g.ctx.beginPath();
	g.ctx.lineWidth = Math.floor(g.LW*.7);
	g.ctx.strokeStyle = g.SETCOLOR1;
	if (color != "") g.ctx.strokeStyle = color;
	g.ctx.arc(g.WA, g.HA, g.R, 1*Math.PI, (1+radians)*Math.PI, false); 
	g.ctx.stroke();
        g.ctx.closePath();
}
function DLCGaugeValueText(g, v, color, k)  {
        var BASE = 110;
        var BF = 24;
        BF = 30;
	g.ctx.beginPath();
	g.ctx.fillStyle = g.TEXTCOLOR;
	if (color != "") g.ctx.fillStyle = color;
        g.ctx.font = adjustfont(g.WIDTH,BASE,BF,1);
        if (g.KTHOUSANDSVALUETEXT == 1 ) if (k>0) if (v >=1000) v=Math.floor(v/1000) + "K";
        v = g.PREFIX + v;

        // ******************************************************
        // ** Width Adjustor
        var f = 1.00;
        var W = Math.floor(g.WIDTH/2)-16;
        g.ctx.font = adjustfont(W,BASE,BF,f);
        while (f > 0.00) {
             if (g.ctx.measureText(v).width > W) {
                  f = f - 0.01;
                  if (f <= 0.00) break;
                  g.ctx.font = adjustfont(W,BASE,BF,f);
             } else {
                  break;
             } 
        }
        // ******************************************************
	g.ctx.fillText(v, g.W/2 - (g.ctx.measureText(v).width/2), g.HA-0 );
	g.ctx.stroke();
        g.ctx.closePath();
}
function DLCGaugeValueUnits(g, u, color)  {
        var n;
	g.ctx.beginPath();
	g.ctx.fillStyle = g.TEXTCOLOR;
	if (color != "") g.ctx.fillStyle = color;
        g.ctx.font = adjustfont(g.WIDTH,110,8,0.75);
        n = adjustfontvalue(g.WIDTH,110,8,1);
        //g.ctx.fillText(u,  g.W/2 - (g.ctx.measureText(u).width/2), g.HA+g.BASELINEOFFSET );
        var offset = Math.floor(g.HEIGHT_OFFSET_BOTTOM * .90);
        g.ctx.fillText(u,  g.W/2 - (g.ctx.measureText(u).width/2), g.HA+n);
	g.ctx.stroke();
        g.ctx.closePath();
}

function adjustfont(a,b,nBaseFontSizeInPixels, factor) {
     sz = "";
     var m; 
     var n  = Math.ceil((a/b)); 
     if (n <=0)  n = 1;
     if (n >=10) n = 10;
     m = Math.floor(nBaseFontSizeInPixels * n * factor ) 
     sz = "Bolder " + m + "px Arial";
     return sz;
}
function adjustfontvalue(a,b,nBaseFontSizeInPixels, factor) {
     var m; 
     var n  = Math.ceil((a/b)); 
     if (n <=0)  n = 1;
     if (n >=10) n = 10;
     n = Math.floor(nBaseFontSizeInPixels * n * factor ) 
     return n;
}

     // var y = FLCGauge( $("#"+"can2"),130,"Bigger",gs);
// ctx.moveTo(x,y);
// ctx.lineTo(x,y);
// ctx.stroke();

