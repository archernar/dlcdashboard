
     goptions = { gOp:"storagecount", gValues:1, gIndex1:0, gIndex2:0, gCeil:25000, gUnits:"EBS GB", gDisplayTitle:1 };

function splashGaugeUpdate() {
// yooo
     var $sel = $( "td[dlcgauge='on']" );
     $sel.each(function( index ) {
//          console.log( index + ": " + url );
          yoyoyo( this );
     });
}
// http://stackoverflow.com/questions/6129145/pass-extra-parameter-to-jquery-getjson-success-callback-function
function yoyoyo(t) {
                    var url = $(t).attr("dlcgaugeurl");
                    $.getJSON( url, function( data ) {
                                 var options = $(t).data('dlcgauge');
                                 var VALLL = options.gs.gValues;
                                 if (options.gs.gValues <= 1) 
                                     $(t).gaugeset(data.rows[0].c[options.gIndex1].v);
                                 if (options.gs.gValues == 2) 
                                      $(t).gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                                             data.rows[0].c[options.gIndex2].v);
                                 if (options.gs.gValues == 3) 
                                      $(t).gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                                             data.rows[1].c[options.gIndex2].v);
                     });
}

     function splashGaugeThing($sel, options) {
          var e = [];
          var n = 0;
          $.ajaxSetup({ async: false });
if ( 1==1 ) {
          $.getJSON( "p1?op=subaccounts", function( data ) {
               var i = 0;
               var account = "";
               var url = "";
               n = data.rows.length;
               $sel.append(tableWXQ(1,n));
               for (i=0;i<n;i++) {
                    account = data.rows[i].c[1].v;
                    url = "p1?env="+account+"&op="+options.gOp
                    console.log(url);
                    options.gTitle = account;
                    options.gCeil=Count(url);
                    e[e.length] = $("#"+popQueue()).thegauge(options);
               } 
          });
}
if ( 1==1 ) {
          $.getJSON( "p1?op=subaccounts", function( data ) {
               n = data.rows.length;
               for (i=0;i<n;i++) {
                    account = data.rows[i].c[1].v;
                    $.getJSON( "p1?env="+account+"&op="+options.gOp,function( data ) {
                                 if (options.gValues <= 1) e[i].gaugeset(data.rows[0].c[options.gIndex1].v);
                                 if (options.gValues == 2) 
                                      e[i].gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                                             data.rows[0].c[options.gIndex2].v);
                                 if (options.gValues == 3) 
                                      e[i].gaugesettwovalues(data.rows[0].c[options.gIndex1].v,
                                                             data.rows[1].c[options.gIndex2].v);
                     });
               } 
          });
}
          $.ajaxSetup({ async: false });
     }



     function Count( url ) {
          var ret;
          $.ajaxSetup({ async: false });
          $.getJSON( url,function( data ) {
               ret = data.rows[0].c[1].v;
          });
          return ret
     } 
     function instanceCount( account ) {
          var ret;
          $.ajaxSetup({ async: false });
          $.getJSON( "p1?env="+account+"&op=instancecount",function( data ) {
               ret = data.rows[0].c[1].v;
          });
          return ret
     } 



     function splashGauges() {
        var $ca = $("#client_area");
        var guid = randomStr();
        $ca.empty().append( "<div id='"+guid+"'></div><br>");
        var $sel = $("#"+guid);
        $sel.html("<center>"+myDateTimeFunction()+"</center>").css({'color':'Black','font-size':'140%','font-weight':'bold'});
//        splashGaugeThing($ca, { gOp:"monthlycost", gValues:3, gIndex1:1, gIndex2:1, 
//                                gCeil:25000, gUnits:"COSTS", gDisplayTitle:1,
//                                gPrefix:"$", gCeil:25000, gTextFont:"Bolder 10px Arial" });


        splashGaugeThing($ca, { gOp:"instancecount",gValues:2, gIndex1:1, gIndex2:2, gCeil:11, gUnits:"INSTANCES",gDisplayTitle:1});
        splashGaugeThing($ca, { gOp:"storagecount", gValues:1, gIndex1:0, gCeil:25000, gUnits:"EBS GB",    gDisplayTitle:0});
        // splashGaugeThing($ca, { gOp:"instancecount",gValues:2, gIndex1:4, gIndex2:5, gCeil:500, gUnits:"vCPU",gDisplayTitle:0,gTextFont:"Bolder 10px Arial" });
        // splashGaugeThing($ca, {gOp:"instancecount",gValues:1, gIndex1:6, gCeil:3000,  gUnits:"MEM GB",    gDisplayTitle:0});
        // splashGaugeThing($ca, {gOp:"bucketcount",  gValues:1, gIndex1:1, gCeil:100,   gUnits:"BUCKETS",   gDisplayTitle:0});
        // splashGaugeThing($ca, {gOp:"storagecount", gValues:1, gIndex1:0, gCeil:25000, gUnits:"EBS GB",    gDisplayTitle:0});
// splashGaugeUpdate();
     }


     function getMoniker() {
        var v = "";
        $.ajaxSetup({ async: false });
        $.getJSON("p1?op=version", function( data ) { v=data.rows[0].c[1].v; });
        return "DLCDashboard " + v + " All Rights Reserved";
     }

     function splashHelp($sel, sz) {
        var sz = "";
        var i = 0;
        var url = "";
        var v = "";
        var guid1 = randomStr();
        var guid2 = randomStr();
        var guid3 = randomStr();
        $.ajaxSetup({ async: false });
        $.getJSON("p1?op=version", function( data ) { v=data.rows[0].c[1].v; });
        sz = sz + "<center><table cellspacing=2 cellpadding=2 border=0>";
        sz = sz + "<tr><td><pre class='manpage'>" + getManPageString() + "</pre></td></tr>";
        sz = sz + "</table></center>";
        $sel.append(sz);
     }

