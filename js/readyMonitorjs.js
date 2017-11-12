jQuery(document).ready(function() {
     readyMonitor();
});
// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function formatFloatZero(flt) {
     var t = 0.00;
     t = flt * 1.00;
     var tt = t.toFixed(0);
     return tt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function netcost() {
             var t = 0.00; var n = 0.00;
             var tt = 0.00; var nn = 0.00;
             var p1 = "";
             var hr = "";
             var dy = "";
             var all = "";
             var mm = "";
             var msg = "";
             var pos = "";
             var sz = "";
             var memory = "";
             var cpu = "";
             var res;
             sz = "";
             var cmd = getCommand();
             // console.log("["+cmd + "]  [" + cmd.substr(0,4) + "]");
             if ( (cmd.substr(0,3) == "inv") || (cmd == "fke")) {
                  pos = $("#"+GlobalTableId +" th[thname='config']").attr("pos");
                  if ( pos != "" ) {
                       $("#"+GlobalTableId + " > tbody  > tr").filter(':visible').each(function() {
                             res = $.trim($(this).find('td').eq(pos).text()).split(",");
                             t = t + parseFloat(res[0]);
                             tt = tt + parseFloat(res[1]);
                       });
                       cpu = t.toFixed(0);
                       memory = tt.toFixed(0);
                  }
             }
             t = 0.00; n = 0.00; sz = ""; pos = "";
             if ((cmd.substr(0,3) == "inv") || (cmd == "fke")) {
                  pos = $("#"+GlobalTableId +" th[thname='config']").attr("pos");
                  if ( pos != "" ) {
                       $("#"+GlobalTableId + " > tbody  > tr").filter(':visible').each(function() {
                             res = $.trim($(this).find('td').eq(pos).text()).split(","); 
                             t = t + parseFloat(res[6]);
                       });
                       all = t.toFixed(0);
                  }
             }
             t = 0.00; n = 0.00; sz = ""; pos = "";
             if ((cmd.substr(0,3) == "inv") || (cmd == "fke")) {
                  pos = $("#"+GlobalTableId +" th[thname='$hour']").attr("pos");
                  if ( pos != "" ) {
                       $("#"+GlobalTableId + " > tbody  > tr").filter(':visible').each(function() {
                             sz = $.trim($(this).find('td').eq(pos).text()); 
                             t = t + parseFloat(sz);
                       });
                       hr = t.toFixed(0); n = hr * 24.0; dy = n.toFixed(0); n = dy * 31.0; mm = n.toFixed(0);
                       msg = hr.toString() + "/h " +  dy.toString()  + "/d " + mm.toString() + "/m";
                       msg = msg + " " + all.toString()    + " CS";
                       msg = msg + " " + cpu.toString()    + " CPUs";
                       msg = msg + " " + memory.toString() + " GBs";
                       $("#tail_area").html(msg).css({'color':'White','font-size':'100%','font-weight':'bold'});
                       msg = "";
                       msg = msg + "$" + formatFloatZero(hr)       + "/h<br>" 
                       msg = msg + "$" + formatFloatZero(dy)       + "/d<br>" 
                       msg = msg + "$" + formatFloatZero(mm)       + "/m<br>" 
                       msg = msg + "$" + formatFloatZero(all)      + " CS<br>" 
                       msg = msg + ""  + formatFloatZero(cpu)      + " CPUs<br>" 
                       msg = msg + ""  + formatFloatZero(memory)   + " GBs<br>" 
                       // $("#sub_menu_area").html(msg).css({'color':'White','font-size':'140%','font-weight':'bold'});
                  }
             }

             if (getCommand() == "vol") {
                  msg = "";
                  t = 0.00; var n = 0.00;
                  sz = "";
                  pos = $("#"+GlobalTableId +" th[thname='$month'").attr("pos");
                  if ( pos != "" ) {
                       $("#"+GlobalTableId + " > tbody  > tr").filter(':visible').each(function() {
                             sz = $.trim($(this).find('td').eq(pos).text()); 
                             t = t + parseFloat(sz);
                       });
                       mm = t.toFixed(2); 
                       msg = "Volumes: monthly: " + mm.toString();
                       $("#tail_area").html(msg); 
                  }
             }
}
var TestInterval;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function resetTail()  {
     $("#tail_area").empty().html(getMoniker());
}

function readyMonitor() {
setCookie("FIRTH", JSON.stringify(firth), 12);

     var $client_area = $("#client_area");
     var $screen      = $("#screen")
     var $banner      = $("#banner")
     var $footer      = $("#footer").addClass("footer");
     $("#tail_area").attr("width", Math.floor(screen.width/4));
     $("#ticker").hide();
     $.ajaxSetup({ async: false });
     setCookie("ZOOM", 0, 12);
     var meup="";
     // what="p1?op=version";
     // $.getJSON( what, function( data ) { 
     //      $("#tail_area").html("DLCDashboard").css({'color':'Black','font-size':'300%','font-weight':'bold'});
     // });
     $("#tail_area").html(getMoniker());

     var sel="";
     var env="";
     var what="";
     var url="";
     var guid = "";
     var guid2 ="";
     var guid3 ="";
     var guid4 ="";

     //BUTTONS
if ( 1==1) {
     var temp="";
if ( 1 == 1 ) {
        var sel;
        var selright;
        var $sel;
        var a;
        var b;
        sel = openSettingsBar("fixed_menu_area");
        // myBC(55,sel,"booton","SETUP","",["SETUP"],  function () { resetClientArea(); queueTestSetupScreen(); });
        myBC(85,sel,"booton","","BHID",["HIDE MENU","SHOW MENU"], function(e) { hider(); } );
        myBC(55,sel,"booton","HELP","",["HELP"],function(e) { var $s = $("#client_area").empty(); splashHelp($s,"");});
        myBC(55,sel,"booton","RESET","",["RESET"],  function(e) {
                  resetClientArea();
                  resetVariableMenu(1); 
                  resetTail(); 
                  resetselectpick(); 
                  var $ca = $("#client_area");
                  $ca.empty(); 
                  stack.length = 0;
        });
        myBC(55,sel,"booton","GAUGES","",["GAUGES"], function () { resetClientArea(); splashGauges(); });
        myBC(85,sel,"booton","NET COST","",["NET COST"], function () { netcost(); });
        myBC(55,sel,"booton","PRINT","",["PRINT"],  function () { if (window.print) window.print(); });

// https://stackoverflow.com/questions/1203876/how-to-pass-a-variable-by-value-to-an-anonymous-javascript-function
// there is need hee to create proper closure and local scope, thus the function in function.  functions create scope and closure.
//  HOLD myBC(55,"xxxx","booton",data.rows[i].c[1].v,"",[data.rows[i].c[1].v], function() { DAC(this.title); });
//
        myBC(55,sel,"booton","ALL","",["ALL"], (function(mylocalvariable) { return function() { DAC(mylocalvariable); } }) ("ALL") ); 
        $.getJSON("p1?op=accounts", function( data ) { 
             for (i=0;i<data.rows.length;i++) {
                  myBC(55,sel,"booton",data.rows[i].c[1].v,"",[data.rows[i].c[1].v], 
                       (function(mylocalvariable) {
                            return function() { DAC(mylocalvariable); }
                       }) (data.rows[i].c[1].v) ); 
             }
        });

        myBC(55,sel,"booton",SELECTEDITEMS+" SLCT","",["SLCT"], function(e) { doCpuTableChart(); });



        closeSettingsBar("fixed_menu_area");
        $sel         = $("#fixed_menu_area")

     resetVariableMenu(0);

        var GlobalBannerInterval;
        setCookie("LOCK", "UNLOCKED", 12);
}
}

     var guid = randomStr();
     var $sel = $("#menu_area");

     $client_area.empty();
     splashHelp($client_area, "");

     guid  = randomStr();
     $.ajaxSetup({ async: true });
     var $lastrowsNo = "";


// var iid = location.search.split('iid=')[1] ? location.search.split('iid=')[1] : 'nil';
// url = serviceUrl(env,datamode,"cpu",iid,reg,p,dh,offset);
// snapPerf( "CPU",gp,url,env,reg,node,PT,chartjsTitleLong("cpu", h,node,name,purpose,h,p,offset) );
// alert(iid);
        var sz = "";


}
