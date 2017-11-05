// <link rel="stylesheet" href="jquery-ui-1.11.2/jquery-ui.css">
// <script type="text/javascript" src="jquery-ui-1.11.2/jquery-ui.min.js"></script>
// <script type="text/javascript" src="jquery-ui-1.11.2/external/jquery/jquery.js"></script>
// * jQuery JavaScript Library v1.10.2
// * http://jquery.com/
// * http://jquery.org/license
// * Date: 2013-07-03T13:48Z
// http://www.color-hex.com/color-palette/185
// https://developers.google.com/fonts/docs/getting_started#Quick_Start
// <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Roboto">
// http://code.tutsplus.com/tutorials/easy-graphs-with-google-chart-tools--net-11771
var selectedbutton = "" ;
var QueueMonitorInterval;

      function resetMessageArea() {
           $("#message_area").empty();
           $("#sub_menu_area").empty();
           resetIntervals();
      }
      function resetClientArea() {
           $("#client_area").empty();
           $("#sub_menu_area").empty();
           $("#temp_area").empty();
           $("#temp_area").hide();
           $("#input_area").empty().hide();
           resetIntervals();
      }
      function resetIntervals() {
           var i = 0;
           clearInterval(clientAreaInterval);
           clearInterval(QueueMonitorInterval);
           resetIntervalSet();
      }
      function resetIntervalSet() {
           for (i=0;i<INTERVALSET.length;i++) clearInterval(INTERVALSET[i]);
           INTERVALSET.length = 0;
      }
      function getCommand() {
           return(getCookieDefault("CMDSET","inv"));
      }
      function getReg() {
           return(getCookieDefault("REGL","E1"));
      }
      var radioOp="inventory";
      var periodIn=2;
      function getCommandArray() {
          return(["inv","inv-","inv+","raw","red","rds","vol","que","bns","usr","grp","rle","trd","tag","s3b","scg","ami","bil","fke"]);
      }
      function DAC(sz) {
          var guid  = "";
          var guid2 = "";
          var url="";
          var filter="";
          // filter=$("#textentry").val();
          var szComment = "";
          resetClientArea();
          resetMessageArea();
          var nControl = -1; 
          var $ca = $("#client_area");
          $("#"+sz).parent().parent().find('td').css({ 'color': 'White' });
          $("#"+sz).css({ 'color': 'Black' });
          $("#"+sz).css({ 'background-color': 'Black' });
          document.getElementById("client_area").innerHTML = "";
          switch ( getCommand() )  {
             case "raw": radioOp="inventoryraw"; break; 
             case "inv": radioOp="inventory"; break; 
             case "red": radioOp="red"; break; 
             case "rds": radioOp="rds"; break; 
             case "bns": radioOp="beans"; break; 
             case "inv-": radioOp="inventoryminus"; break; 
             case "inv+": radioOp="inventoryplus"; break; 
             case "lst": radioOp="list"; break; 
             case "trd": radioOp="trendall"; break; 
             case "tag": radioOp="tag"; break; 
             case "s3b": radioOp="s3buckets"; break; 
             case "fke": radioOp="fakeinventory"; break; 
             case "prf": radioOp="performance"; break; 
             case "tag": radioOp="tags"; break; 
             case "usr": radioOp="users"; break; 
             case "grp": radioOp="groups"; break; 
             case "scg": radioOp="sg"; break; 
             case "que": radioOp="queue"; break; 
             case "vol": radioOp="volumes"; break; 
             case "rle": radioOp="roles"; break; 
             case "ami": radioOp="images"; break; 
             case "bil": radioOp="bill"; break; 
             case "spc": radioOp="special"; break; 
          }

          reg=getReg();
          if ($('#instancesall_radiobutton').is(':checked')) reg="ALL";
          var detail = sz + " in " + reg;
          switch (radioOp) {
             case "queuemonitor":
               queueMonitor(sz);
               break;
             default:
               guid  = randomStr();
               guid2  = randomStr();
               $ca.DLC("div",guid2).append("<br>").DLC("div",guid);
               what="p1?env="+sz+"&op="+radioOp+"&loc="+reg;
               switch (sz) {
               case "XALL": 
                    doTableChartRepeat("ALL","p1?env=ALL&op=listall&loc=ALL" ,guid ,"Instance List",nControl);
                    break;
               case "ALLEBS": 
                    doTableChartRepeat("ALL","p1?env=ALL&op=volumes&loc=ALL" ,guid ,"EBS List",nControl);
                    break;
               default:
                    if (getCookie("BCHT") == "On" ){
                     url ='p1?env='+sz+'&op=billing&loc='+reg;
                     snapPerf("BILLING",guid,url,sz,reg,"","USD",chartjsSimpleTitle(sz+" Cloud Cost (monthly bill as of date indicated)") );
                    }
                    if ( radioOp == "special" ) {
                     $ca.empty();
                     doCpuTableChart();
                    }
                    else {
                     // ****************************************
                     // *** Default Operations (DEFOP)
                     // ****************************************
                     url = serviceUrl2(sz,radioOp,"","",reg,"","","",filter);
                     doTableChartRepeat(sz,url,guid ,"Instance List",nControl);
                     netcost();
                    }
                    break;
               }
               break;
          }
      }
      // https://developers.google.com/chart/interactive/docs/gallery/barchart#Data_Format
      // @DCA

      // @doTableChart
      function doTableChartRepeat(szDesc,what,where,description,control) {
           var cp = getCookieDefault("PDCHT","0") * 1000;
           doTableChart(szDesc,what,where,"",0,"gridtable")
                // ****************************************
                // *** Auto Update Code
                // ****************************************
                // if ( cp > 0) 
                //     clientAreaInterval = setInterval(function() { doTableChart(szDesc,what,where,"",0, "gridtable") }, cp);
      }

     function doCpuTableChart() {
        var MB = "MegaBytes";
        var OP = "Ops";
        var PT = "Percent";
        var env = "";
        var reg = "";
        var node = "";
        var status = "";
        var name = "";
        var purpose = "";
        var guid="";
        var dh=getCookie("DHRS");
        if (dh=="") dh="24";
        var offset=getCookie("OSET");
        var h = getCookieDefault("DHRS",24);
        var p = getCookieDefault("PER",60);
        var willie="";
        var panes = [];
        var nextedpane = 0;
        var gp = 0;
        var sz = "";
        var i = 0;
        var PANECT = 60;
        PANECT = SELECTEDITEMS;
        if (PANECT<3) PANECT = 3;
        for (i=0;i<PANECT;i++) panes[panes.length] = randomStr();
        switch ( getCookie("EXP") )  {
           case "One":
             sbInit("<table width='98%'>");
             for (i=0;i<PANECT;i++) sbAdd("<tr><td width='98%' id='"+panes[i]+"'></td></tr>");
             sbAdd("</table>");
             break;
           case "Two":
             sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
             for (i=0;i<(PANECT-2);i++) { 
                  sbAdd("<tr><td width=49% id='"+panes[i]+"'></td>");
                  sbAdd("<td width=2%>&nbsp;</td><td width=49% id='"+panes[i+1]+"'></td></tr>");
                  i++;
             }
             sbAdd("</table>");
             break;
           case "Three":
             sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
             for (i=0;i<(PANECT-3);i++) { 
               sbAdd("<tr><td width=32% id='"+panes[i]+"'></td>");
               sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+1]+"'></td>");
               sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+2]+"'></td></tr>");
               i++;
               i++;
             }
             sbAdd("</table>");
             break; 
           case "Four":
             sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
             for (i=0;i<(PANECT-4);i++) { 
               sbAdd("<tr><td width=24% id='"+panes[i]+"'></td>");
               sbAdd("<td width=1%>&nbsp;</td><td width=24% id='"+panes[i+1]+"'></td>");
               sbAdd("<td width=1%>&nbsp;</td><td width=24% id='"+panes[i+2]+"'></td>");
               sbAdd("<td width=1%>&nbsp;</td><td width=24% id='"+panes[i+3]+"'></td></tr>");
               i++;
               i++;
               i++;
             }
             sbAdd("</table>");
             break; 
        }


        //$("#client_area").append(sbString());
        $("#temp_area").empty().show();
        booton($("#temp_area"),"hide", function () { $("#temp_area").empty().hide(); });
        $("#temp_area").append(sbString());
// PT
        for (i=0;i<NODESET.length;i++) {
             node = NODESET[i];
             env = ENVSET[i];
             reg = REGSET[i];
             name = NODENAMESET[i];
             purpose = PURPOSESET[i];
             status = "TBD";
             var datamode = getCookieDefault("DMOD","sts");
             var water=0;
             if (getCookie("CPUOO") == "On" ){
                url = serviceUrl(env,datamode,"cpu",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "CPU",gp,url,env,reg,node,PT,chartjsTitleLong("cpu", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("MEMA") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"mema",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
              snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitleLong("Memory Available",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("MEMZ") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"memz",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
              snapPerf("NET",gp,url,env,reg,node,PT,chartjsTitleLong("Memory Utilization",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("MEMU") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"memu",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
                  snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitleLong("Menory Used",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("NIB") == "On" ){
                url = serviceUrl(env,datamode,"netin",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitleLong("netin",h,node,name,purpose,h,p,offset) );
             } 
             if (getCookie("NOB") == "On" ){
                url = serviceUrl(env,datamode,"netout",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitleLong("netout", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DRB") == "On" ) {
                url = serviceUrl(env,datamode,"diskreadbytes",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,MB,chartjsTitleLong("diskreadbytes", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DWB") == "On" ) {
                url = serviceUrl(env,datamode,"diskwritebytes",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,MB,chartjsTitleLong("diskwritebytes", h,node,name,purpose,h,p,offset) );
             } 
             if (getCookie("DRO") == "On" ) {
                url = serviceUrl(env,datamode,"diskreadops",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,OP,chartjsTitleLong("diskreadops", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DWO") == "On" ) {
                url = serviceUrl(env,datamode,"diskwriteops",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,OP,chartjsTitleLong("diskwriteops", h,node,name,purpose,h,p,offset) );
             } 
        }
     }

     var returnstack = [];
     var stack = [];
     var INTERVALSET = [];



     var clientAreaInterval = 0;
     var ScreenInterval = 0;
     function queueMonitor(env) {
        resetClientArea();
        var guid = "";
        var what =   'p1?env='+env+'&op=queuecounts&loc=E1&period=1&hours=18'
        resetClientArea();
        guid  = randomStr();
        var tablename = randomStr();
        var $ca = $("#client_area");
        $ca.DLC("div",guid);
        doTableChart(env,what,guid,"",0,"gridtable")
        clientAreaInterval = setInterval(function() {
             doTableChart(env,what,guid,"",0,"gridtable")
        }, 200000);
     }

     function snapCpuPerf(env,reg,node,name,purpose,hours,period) {
          var $ca = $("#client_area");
          var MB = "MegaBytes";
          var OP = "Ops";
          var PT = "Percent";
          hours  = getCookie("DHRS",1);
          period = getCookieDefault("PER",60);
          var sz = "";
          var url = "";
          var zzz="";
          var h=hours;
          var p=period;

          var w   =  ($ca.innerWidth / 2) - 30;

          var panes = [];
          var nextedpane = 0;
          var gp = 0;
          var PANECT = 60;
          PANECT = SELECTEDITEMS;
          if (PANECT<3) PANECT = 3;
          for (i=0;i<PANECT;i++) panes[panes.length] = randomStr();
          switch ( getCookie("EXP"))  {
             case "One":
                  sbInit("<table border=0 width='98%'>");
                  for (i=0;i<PANECT;i++) sbAdd("<tr><td width='98%' id='"+panes[i]+"'></td></tr>");
                  sbAdd("</table>");
                  break; 
             case "Two":
                  sbInit("<table border=0 CELLPADDING=0 CELLSPACING=0 width='98%'>");
                  for (i=0;i<(PANECT-2);i++) { 
                    sbAdd("<tr><td width=49% id='"+panes[i]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=49% id='"+panes[i+1]+"'></td></tr>");
                    i++;
                  }
                  sbAdd("</table>");
                  break; 
             case "Three":
                  sbInit("<table border=0 CELLPADDING=0 CELLSPACING=0 width='98%'>");
                  for (i=0;i<(PANECT-3);i++) { 
                    sbAdd("<tr><td width=32% id='"+panes[i]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+1]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+2]+"'></td></tr>");
                    i++;
                    i++;
                  }
                  sbAdd("</table>");
                  break; 
          }
// TA
   //       resetClientArea();
          $("#temp_area").empty();
          $("#temp_area").show();
          var guid  = randomStr();
          var $ta = $("#temp_area");
          $ta.DLC("div",guid);
          booton($ta,"hide", function () { $("#temp_area").empty().hide(); });
          $ta.append(sbString());


          $.ajaxSetup({ async: false });
          // doTableChartRepeat(env,"p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg ,guid,"t",0);
          var datamode = getCookieDefault("DMOD","sts");
          var offset=getCookie("OSET");

          // if (getCookie("CPUOO") == "On" ){
          if (cookieIsOn("CPUOO")) {
               url = serviceUrl(env,datamode,"cpu",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "CPU",gp,url,env,reg,node,PT,chartjsTitle("CPU Utilization",hours,node,name,purpose) );
          }
          if (getCookie("MEMA") == "On" ){
               url = serviceUrl(env,"l"+datamode,"mema",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitle("Memory Available",hours,node,name,purpose) );
          }
          if (getCookie("MEMZ") == "On" ){
               url = serviceUrl(env,"l"+datamode,"memz",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,PT,chartjsTitle("Memory Utilization",hours,node,name,purpose) );
          }
          if (getCookie("MEMU") == "On" ){
               url = serviceUrl(env,"l"+datamode,"memu",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitle("Memory Usage",hours,node,name,purpose) );
          }
          if (getCookie("STATUS") == "On" ) {
             url = serviceUrl(env,"sts","statuscheck",node,reg,period,hours,offset);
             gp = panes[nextedpane++];
             snapPerf( "Line",gp,url,env,reg,node,"status",chartjsTitle("Status",hours,node,name,purpose) );
          }
          if (getCookie("NIB") == "On" ){
               url = serviceUrl(env,datamode,"netin",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitle("Net In",hours,node,name,purpose) );
          }
          if (getCookie("NOB") == "On" ){
               url = serviceUrl(env,datamode,"netout",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitle("Net Out",hours,node,name,purpose) );
          }
          var c = "";
          if (getCookie("DRO") == "On" ) {
               url = serviceUrl(env,datamode,"diskreadops",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,OP,chartjsTitle("Disk Reads Ops",hours,node,name,purpose) );
          }
          if (getCookie("DWO") == "On" ) {
               url = serviceUrl(env,datamode,"diskwriteops",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,OP,chartjsTitle("Disk Write Ops",hours,node,name,purpose) );
          }
          if (getCookie("DRB") == "On" ) {
               url = serviceUrl(env,datamode,"diskreadbytes",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,MB,chartjsTitle("Disk Reads Bytes",hours,node,name,purpose) );
          }
          if (getCookie("DWB") == "On" ) {
               url = serviceUrl(env,datamode,"diskwritebytes",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,MB,chartjsTitle("Disk Write Bytes",hours,node,name,purpose) );
          }

     }
     // SNAPPERF 
     function snapPerf(cht,guid,url,env,reg,node,vlabel,label)        { 
          chartjsDoChart(cht,url,guid,vlabel,node,label);
                // ****************************************
                // *** Auto Update Code
                // ****************************************
                // if ( cp > 0) 
                //     clientAreaInterval = setInterval(function() { chartjsDoChart(cht,url,guid,vlabel,node,label); }, cp);
     }

     // ***************************************************************************
     // ***************************************************************************
     //         "lst      display instance inventory (summary)       ok\n"+
     // ***************************************************************************
     // ***************************************************************************
     function resetNoteBar(hardreset) {
     if(typeof GlobalBannerInterval !== "undefined") clearInterval(GlobalBannerInterval);
     $("#ticker").hide();

     $("#notebar").empty();
     $("#logger_area").empty();
     var g1 = openSettingsBar("notebar");
     var g2 = "";
     var ACCOUNTSET = [];

     var cmds = getCommandArray();

     what="p1?op=accounts";
     $.ajaxSetup({ async: false });
     $.getJSON( what, function( data ) { 
          for (i=0;i<data.rows.length;i++) ACCOUNTSET[ACCOUNTSET.length] = env=data.rows[i].c[1].v;
     });
     if (hardreset == 1){
         setCookie("CMDSET"+"DEX", 0, 12);
         setCookie("REGL"+"DEX", 0, 12);
         setCookie("ZOOM"+"DEX", 0, 12);
         setCookie("DMOD"+"DEX", 0, 12);
         setCookie("DHRS"+"DEX", 0, 12);
         setCookie("PER"+"DEX", 60, 12);
         setCookie("YAXIS"+"DEX", 0, 12);
         setCookie("CPUCT"+"DEX", 0, 12);
         setCookie("NETCT"+"DEX", 0, 12);
         setCookie("DISKCT"+"DEX", 0, 12);
         setCookie("BCHTYPE"+"DEX", 0, 12);
         setCookie("PEAKONLY"+"DEX", 0, 12);
         setCookie("SORTKEY"+"DEX", 0, 12);
         setCookie("OSET"+"DEX", 0, 12);
         setCookie("IM"+"DEX", 0, 12);
         setCookie("DISKMET"+"DEX", 0, 12);
         setCookie("MEMA"+"DEX", 0, 12);
         setCookie("MEMZ"+"DEX", 0, 12);
         setCookie("MEMU"+"DEX", 0, 12);
         setCookie("PDCHT"+"DEX", 0, 12);
         setCookie("UPCHT"+"DEX", 0, 12);
         setCookie("MENU"+"DEX", 0, 12);
     }
     var cls="booton";
     setCookie("MENU", "hide", 12);
     //myBCallBack(0,g1,cls,"menu","MENU",["hide","show"],menuCallBack);
     var g2 = addSettingsElement(g1);
     var guid = randomStr();
     var guid1 = randomStr();
     $("#"+g2).append("<table width=65><tr><td width='100%' align='middle' class='booton' id='"+guid+"'></td></tr></table>");
     if (getCookie("CMDSET") == "" ) setCookie("CMDSET","inv",12);
     // setCookie("CMDSET","inv",12);
     var szsz="";
     var szSelected="";
     szsz = szsz + "<select id='cmdselect'>";
     for (var i = 0; i < cmds.length; i++) {
          szSelected="";
          if (getCookie("CMDSET") == cmds[i]) szSelected="selected";
          szsz = szsz + "<option value='" + cmds[i] + "' "+ szSelected + ">" + cmds[i] + "</option>";
          szSelected="";
     }
     szsz = szsz + "</select>";
     $("#"+guid).append(szsz);
     $("#cmdselect").addClass("booton").css('font-size', 14);
     $("#cmdselect").addClass("booton").css('border', 0);
     $("#cmdselect").change(function() {
          var v = $("#cmdselect :selected").text();
          setCookie("CMDSET", v, 12);
     });
     //myB(0,g1,cls,"cmd","CMDSET",cmds);
     // myB(0,g1,cls,"region","REGL",["ALL","E1","W1","W2","A1","A2","A3","U1","U2","S1"]);
     myB(0,g1,cls,"regn","REGL",["E1","W1","W2","ALL"]);
     myB(0,g1,cls,"mode","DMOD",["sts","mts"]);
     myB(0,g1,cls,"zoom","ZOOM",["0","50","100","200","300","400","-25","-50","-100"]);
     myB(0,g1,cls,"hrs","DHRS",["24","48","72","96","120","144","240","1","2","4","6","12","18" ]);
     myB(0,g1,cls,"smpl","PER",["60","180","300","600","90"]);
     myB(0,g1,cls,"off","OSET",["0","12","18","24","30","36","48","60","72","96","120","144","240"]);
     myB(0,g1,cls,"cpu y","YAXIS",["auto","100","50","25","10","5","1"]);
     myB(0,g1,cls,"cpu","CPUCT",["Line","Col","Sca"]);
     myB(0,g1,cls,"n/m","NETCT",["Line","Col","Sca"]);
     myB(0,g1,cls,"dcht","DISKCT",["Line","Col","Sca"]);
     //myB(0,g1,cls,"sort","SORTKEY",["name","purpose","type","sys","id","envreg"]);
     myB(0,g1,cls,"chrts","EXP",["One","Two","Three","Four"]);
     // THIS IS GOOD myB2(0,g1,cls,"","EXP",["One","Two","Three","Four"],"","EXP2",["a","b","c"]);
     cls="uitoggle confirm";
     var g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","sta","STATUS",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","cpu","CPUOO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","nti","NIB",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","nto","NOB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","drr","DRB",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","dww","DWB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dro","DRO",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","dwo","DWO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","mma","MEMA",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","mmu","MEMU",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","mmz","MEMZ",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","bil","BCHT",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dsk","DISKMET",["Off","On"]);
     myBimpl(40,g2,"bootonsmall","upd","UPDT",["Off","On"]);
     closeSettingsBar("notebar");

        var $sel = $("#searchbar");
        $sel.empty();


        var sel = openSettingsBar("searchbar");
        myBC(35,sel,"booton","ALL","",["ALL"], function () { $("#"+GlobalTableId +" tr").show(); netcost(); });
        myBText(35,sel,"antibooton","Filter:");
        $("#"+ addSettingsElement(sel)).append("<input size=16 type='text' class='searchbartext'  id='regextext'  value=''>");
        myBC(25,sel,"booton","X","",["X"], function () { $("#regextext").val(""); });


        myBText(35,sel,"antibooton","Apply:");
        myBC(40,sel,"booton","INST","",["INST"], function () { filterTableByRow(GlobalTableId, "instance",$("#regextext").val()); netcost(); });
        myBC(40,sel,"booton","NAME","",["NAME"], function () { filterTableByRow(GlobalTableId, "name",$("#regextext").val()); netcost(); });
        myBC(40,sel,"booton","PURP","",["PURP"], function () { filterTableByRow(GlobalTableId, "purpose",$("#regextext").val()); renumberTable(); netcost(); });
        myBC(40,sel,"booton","TAG","",["TAG"], function () { filterTableByRow(GlobalTableId, "tag",$("#regextext").val()); renumberTable(); netcost(); });
        myBC(40,sel,"booton","OWN","",["OWN"], function () { filterTableByRow(GlobalTableId, "owner",$("#regextext").val()); netcost(); });
        myBC(40,sel,"booton","RENUM","",["RENUM"], function () { renumberTable(); });
        myBC(40,sel,"booton","CSV","",["CSV"], function () { window.open("p1?op=csv"); });
          // doTableChartRepeat(env,"p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg ,guid,"t",0);

        myBText(35,sel,"antibooton","Spc:");
        myBC(30,sel,"booton","NI","",["NI"], function () { filterTableByRow(GlobalTableId, "instance", "^$"); netcost(); });
        myBC(30,sel,"booton","NT","",["NT"], function () { filterTableByRow(GlobalTableId, "tag",      "^-$"); netcost(); });
        myBC(30,sel,"booton","NP","",["NP"], function () { filterTableByRow(GlobalTableId, "purpose",  "^-$"); netcost(); });
        
        myBText(35,sel,"antibooton","Pick:");
        myBC(35,sel,"booton","ALL","",["ALL"], function () { 
             var $sel = $("#"+GlobalTableId).find('tr');
             $sel.attr("picked","N");
             $sel = $("#"+GlobalTableId).find('tr').filter(':visible');
             $sel.attr("picked","Y");
             $sel.children('td').css({ 'background-color': 'Magenta' });
             selectpick();
        });
        myBC(35,sel,"booton","NONE","",["NONE"], function () { 
             var $sel = $("#"+GlobalTableId).find('tr');
             $sel.attr("picked","N");
             $sel = $("#"+GlobalTableId).find('tr').filter(':visible');
             $sel.attr("picked","N");
             $sel.children('td').css({ 'background-color': '#dfe3ee' });
             selectpick();
        });

        myBText(35,sel,"antibooton","State:");
        myBC(35,sel,"booton","RUN","",["RUN"], function () { 
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             renumberTable();
             netcost();
        });
        myBC(35,sel,"booton","STOP","",["STOP"], function () { 
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
             renumberTable();
             netcost();
        });
        myBC(35,sel,"booton","BOTH","",["BOTH"], function () { 
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             renumberTable();
             netcost();
        });
        closeSettingsBar("searchbar");

        $("#ckcasesensitive").prop('checked', true);
     }
function filterTableByRow(TableId, ColLabel, Regextext) {
     $("#" + TableId + " tr").show();
     var pos = $("#" + TableId + " th[thname='" + ColLabel + "']").attr("pos");
     var $rowsNo = $("#" + TableId + " tr").filter(function () {
     var sztemp = $.trim($(this).find('td').eq(pos).text());
     return (sztemp.search(Regextext) == -1);
     }).hide();
     $("#"+ TableId + " tr[status='HEADER']").show();
     renumberTable();
}

function setUpAccountTD(env,$sel) {
     if (env != "") {
          if ( env.charAt( 0 ) == '$' ) {
               env = env.substring(1);
               $sel.append("<td class='designate'>" +env+ "</td>");
          } else {
               $sel.append("<td class='uibutton confirm' id='"+env+"'></td>");
               var $env = $("#"+env);
               $env.append(env);
               $env.attr("statcon",env);
               $env.on("click", function(e) { e.preventDefault(); DAC(this.id); });
          }
     }
}
