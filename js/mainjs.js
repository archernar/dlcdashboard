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

      function resetTailArea() {
           $("#tail_area").empty();
           resetIntervals();
      }
      function resetClientArea() {
           $("#client_area").empty();
           $("#client_menu_area").empty();
           $("#chart_area").empty();
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
          resetTailArea();
          resetMenuArea();
          var nControl = -1; 
          var $ca = $("#client_area");
          var $sz = $("#"+sz);
          $sz.parent().parent().find('td').css({ 'color': 'White' });
          $sz.css({ 'color': 'Black' });
          $sz.css({ 'background-color': 'Black' });
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
               $ca.DLC("div",guid2).DLC("div",guid);
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
                     //netcost();
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
        var env = "";
        var node = "";
        var reg = "";
        var name = "";
        var purpose = "";
        var g1 = "";
        var g2 = "";
        var disp = getCookie("DISP").toLowerCase();

        $ca = $("#chart_area");
        for (i=0;i<NODESET.length;i++) {
             node = NODESET[i];
             env = ENVSET[i];
             reg = REGSET[i];
             name = NODENAMESET[i];
             purpose = PURPOSESET[i];
             if ( disp == "2by2" )  {
                  if ( (i%2) == 0 ) {
                       g1 = randomStr();
                       g2 = randomStr();
                       $ca.append( table1by2("100%",g1,g2) );
                       graphit(g1,env,reg,node,name,purpose, -1);
                  }
                  if ( (i%2) == 1 ) {
                       graphit(g2,env,reg,node,name,purpose, -1);
                  }
            } else {
                  g1 = randomStr();
                  $ca.append( table1by1("100%",g1) );
                  graphit(g1,env,reg,node,name,purpose, -1);
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

     function graphit(sel, env,reg,node,name,purpose, Hin) {
          var c = ", ";
          var g1         = randomStr();
          var g1h        = randomStr();
          var hours      = getCookie("DHRS",1);
          if (Hin > -1) hours = Hin;
          var period     = getCookieDefault("PER",60);
          var datamode   = getCookieDefault("DMOD","sts");
          var offset     = getCookie("OSET");
          var metric     = getCookie("EC2METRIC");
          var yaxislabel = mapYAxisLabel(metric);


          var url        = serviceUrl3(env,datamode,metric,node,name,reg,period,hours,offset,g1,g1h);
          var maxy;


          var title     = chartjsTitle2(metric+ " " +hours+ " Hours",hours,node,name,purpose,env,url);

          $.ajaxSetup({ async: false });
          //$("#"+sel).append( "<center>" + env +c+ reg +c+ node +c+ name +c+ purpose + "</center>" ).append( table1by1withheaders("100%",g1,g1h) );
          var popps =  title; 
          $("#"+sel).append( table1by1withheaders("100%",g1,g1h) );
          appendAnchor(g1h, url, "json data");
          $.getJSON( url, function( data ) { 
              var targ = "#"+data.v1_param;
              var iw = document.getElementById(data.v1_param).offsetWidth-5;
              console.log(iw);
                      // description: 'This graphics shows Firefox GA downloads for the past six months.',
                      // title: data.name + " "+ data.node + " " + data.aws_env,
              data.monk = MG.convert.date(data.monk, "Date", "%Y-%m-%d %H:%M");
              maxy = data.monkmax * 2;

              maxy = Math.ceil((maxy+1)/10)*10
              if (data.monkmax <= 20) maxy=22;
              if (data.monkmax <= 15) maxy=16;
              if (data.monkmax <= 10) maxy=12;
              if (data.monkmax <= 9) maxy=10;
              if (data.monkmax <= 8) maxy=8;
              if (data.monkmax <= 7) maxy=7;
              if (data.monkmax <= 6) maxy=6;
              if (data.monkmax <= 5) maxy=5;
              if (data.monkmax <= 4) maxy=4;
              if (data.monkmax <= 3) maxy=3;
              if (data.monkmax <= 2) maxy=2;
              if (data.monkmax <= 1) maxy=1;

              MG.data_graphic({
                      data: data.monk, // an array of objects, such as [{value:100,date:...},...]
                      max_y: maxy, 
                      width: iw,
                      buffer: 0,
                      left: 70,
                      top: 10,
                      bottom: 40,
                      height: 120,
                      y_label: "% cpu",
                      x_label: "time",
                      yax_format: d3.format('.2f'),
                      yax_count: 4,
                      area: true,
                      target: targ, // the html element that the graphic is inserted in
                      x_accessor: 'Date',  // the key that accesses the x value
                      y_accessor: 'y', // the key that accesses the y value
                      title: popps
              })


          });
     }
     function graphitxxx(sel, env,reg,node,name,purpose) {
          var c = ", ";
          var g1         = randomStr();
          var g1h        = randomStr();
          var hours      = getCookie("DHRS",1);
          var period     = getCookieDefault("PER",60);
          var datamode   = getCookieDefault("DMOD","sts");
          var offset     = getCookie("OSET");
          var metric     = getCookie("EC2METRIC");
          var yaxislabel = mapYAxisLabel(metric);
          var url        = serviceUrl3(env,datamode,metric,node,reg,period,hours,offset,g1,g1h);
          $.ajaxSetup({ async: false });
          $("#"+sel).append( "<center>" + env +c+ reg +c+ node +c+ name +c+ purpose + "</center>" ).append( table1by1withheaders("100%",g1,g1h) );
          appendAnchor(g1h, url, "json data");
          snapPerf( metric,g1,url,env,reg,node,yaxislabel,chartjsTitle2(metric+" "+hours+ " hour(s)",hours,node,name,purpose,env,url) );
     }
     function snapCpuPerfNow(env,reg,node,name,purpose,hours,period,met) {
         // console.log("met= " + met);
          var c = ", ";
          $ca=$("#chart_area");
          var url = "";
          hours  = getCookie("DHRS",1);
          period = getCookieDefault("PER",60);
          var datamode = getCookieDefault("DMOD","sts");
          var offset=getCookie("OSET");
          $.ajaxSetup({ async: false });
          var g1  = randomStr();
          var g2  = randomStr();
          var g3  = randomStr();
          var g4  = randomStr();
          var g1h  = randomStr();
          var g2h  = randomStr();
          var g3h  = randomStr();
          var g4h  = randomStr();
          var url1  = serviceUrl(env,datamode,met,node,reg,period,1,offset);
          var url2  = serviceUrl(env,datamode,met,node,reg,period,24,offset);
          var url3  = serviceUrl(env,datamode,met,node,reg,period,168,offset);
          var url4  = serviceUrl(env,datamode,met,node,reg,period,240,offset);
          $($ca).empty();
          switch ( getCookie("DISP").toLowerCase() )  {
             case "2by2":
                  $ca.append( table2by2withheaders("100%",g1,g2,g3,g4,g1h,g2h,g3h,g4h) );
                  break; 
             case "4by1":
                  $ca.append( table4by1withheaders("100%",g1,g2,g3,g4,g1h,g2h,g3h,g4h) );
                  break; 
             default:
                  break; 
          }
          //appendAnchor(g1h, url1, "json data");
          //appendAnchor(g2h, url2, "json data");
          //appendAnchor(g3h, url3, "json data");
          //appendAnchor(g4h, url4, "json data");
          var yaxislabel = mapYAxisLabel(met);
          graphit(g1, env,reg,node,name,purpose, 1);
          graphit(g2, env,reg,node,name,purpose, 24);
          graphit(g3, env,reg,node,name,purpose, 24*7);
          graphit(g4, env,reg,node,name,purpose, 24*10);
          //snapPerf( met,g1,url1,env,reg,node,yaxislabel,chartjsTitle2(met+" 1 Hour",1,node,name,purpose,env,url1) );
               //snapPerf( met,g2,url2,env,reg,node,yaxislabel,chartjsTitle2(met+" 1 Day",24,node,name,purpose,env,url2) );
                    //snapPerf( met,g3,url3,env,reg,node,yaxislabel,chartjsTitle2(met+" 7 Day",168,node,name,purpose, env, url3) );
                         //snapPerf( met,g4,url4,env,reg,node,yaxislabel,chartjsTitle2(met+" 10 Day",240,node,name,purpose, env, url4) );
     }

     // SNAPPERF 
     function snapPerf(cht,guid,url,env,reg,node,vlabel,label)        { 
          cht = cht.toUpperCase();
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
     function resetVariableMenu(hardreset) {
     $("#variable_menu_area").empty();
     if(typeof GlobalBannerInterval !== "undefined") clearInterval(GlobalBannerInterval);

     var g1 = openSettingsBar("variable_menu_area");
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
         setCookie("CHARTTYPE"+"DEX", 0, 12);
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
         setCookie("EC2METRIC"+"DEX", 0, 12);
         setCookie("DISP"+"DEX", 0, 12);
         setCookie("GRAPH"+"DEX", 0, 12);
     }
     var cls="booton";
     setCookie("MENU", "hide", 12);
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
     myB(0,g1,cls,"regn","REGL",["E1","E2","W1","W2","ALL"]);
     myB(0,g1,cls,"mode","DMOD",["sts","mts"]);
     myB(0,g1,cls,"zoom","ZOOM",["0","50","100","200","300","400","-25","-50","-100"]);
     myB(0,g1,cls,"hrs","DHRS",["24","48","72","96","120","144","240","1","2","4","6","12","18" ]);
     myB(0,g1,cls,"smpl","PER",["60","180","300","600","90"]);
     myB(0,g1,cls,"off","OSET",["0","12","18","24","30","36","48","60","72","96","120","144","240"]);
     myB(0,g1,cls,"y axis","YAXIS",["auto","100","50","25","10","5","1"]);
     myB(0,g1,cls,"type","CHARTTYPE",["Line","Col","Sca"]);
     //myB(0,g1,cls,"sort","SORTKEY",["name","purpose","type","sys","id","envreg"]);
     myB(0,g1,cls,"disp","DISP",["2by2","4by1"]);
     myB(0,g1,cls,"ec2metric","EC2METRIC",["cpu","netin","netout","readbytes","writebytes","readops","writeops"]);
     myBC(75,g1,"booton","GRAPH","",["SLCT"], function(e) { $("#chart_area").empty(); doCpuTableChart(); });
     myBC(75,g1,"booton","GRAPH ALL","",["SRUN"], function () { 
             resetselectpick();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             renumberTable();
             selectallrunning();
             doCpuTableChart();
     });
     myBC(55,g1,"booton","HIDE CHARTS","",["HDCHT"], function () { 
         $("#chart_area").hide();
     });
     myBC(55,g1,"booton","SHOW CHARTS","",["SHCHT"], function () { 
         $("#chart_area").show();
     });
     closeSettingsBar("variable_menu_area");
     g1 = openSettingsBar("variable_menu_area");
     cls="uitoggle confirm";
     var g2 = "";
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","cpu","CPUOO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","sta","STATUS",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","nti","NIB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","nto","NOB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","drr","DRB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dww","DWB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dro","DRO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dwo","DWO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","mma","MEMA",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","mmu","MEMU",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","mmz","MEMZ",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","bil","BCHT",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","dsk","DISKMET",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(40,g2,"bootonsmall","upd","UPDT",["Off","On"]);
     closeSettingsBar("variable_menu_area");
     }

     function resetMenuArea() {
        $("#client_menu_area").empty();
        var sel = openSettingsBar("client_menu_area");
        // maybe put back in ???? myBC(35,sel,"booton","ALL","",["ALL"], function () { $("#"+GlobalTableId +" tr").show(); netcost(); });
        myBText(35,sel,"booton","Filter:");
        $("#"+ addSettingsElement(sel)).append("<input size=16 type='text' class='searchbartext'  id='regextext'  value=''>");
        myBC(25,sel,"booton","X","",["X"], function () { $("#regextext").val(""); });


        myBText(35,sel,"bootonlabel","Apply:");
        myBC(40,sel,"booton","INST","",["INST"], function () { filterTableByRow(GlobalTableId, "instance",$("#regextext").val()); });
        myBC(40,sel,"booton","NAME","",["NAME"], function () { filterTableByRow(GlobalTableId, "name",$("#regextext").val());  });
        myBC(40,sel,"booton","PURP","",["PURP"], function () { filterTableByRow(GlobalTableId, "purpose",$("#regextext").val()); renumberTable();  });
        myBC(40,sel,"booton","TAG","",["TAG"], function () { filterTableByRow(GlobalTableId, "tag",$("#regextext").val()); renumberTable(); });
        myBC(40,sel,"booton","OWN","",["OWN"], function () { filterTableByRow(GlobalTableId, "owner",$("#regextext").val()); });
        myBC(40,sel,"booton","RENUM","",["RENUM"], function () { renumberTable(); });
        myBC(40,sel,"booton","CSV","",["CSV"], function () { window.open("p1?op=csv"); });
          // doTableChartRepeat(env,"p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg ,guid,"t",0);

        myBText(35,sel,"bootonlabel","Spc:");
        myBC(30,sel,"booton","NI","",["NI"], function () { filterTableByRow(GlobalTableId, "instance", "^$");  });
        myBC(30,sel,"booton","NT","",["NT"], function () { filterTableByRow(GlobalTableId, "tag",      "^-$"); });
        myBC(30,sel,"booton","NP","",["NP"], function () { filterTableByRow(GlobalTableId, "purpose",  "^-$"); });
        
        myBText(35,sel,"bootonlabel","Pick:");
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
        myBText(35,sel,"bootonlabel","Select:");
        myBC(35,sel,"booton","RUN","",["RUN"], function () { 
             resetselectpick();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             $("#"+GlobalTableId +" tr").each(function() {
                  $(this).children('td').css({ 'background-color': '#ffffff' });
             });
             renumberTable();
        });
        myBC(35,sel,"booton","STOP","",["STOP"], function () { 
             resetselectpick();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
             $("#"+GlobalTableId +" tr").each(function() {
                  $(this).children('td').css({ 'background-color': '#ffffff' });
             });
             renumberTable();
        });
        myBC(35,sel,"booton","BOTH","",["BOTH"], function () { 
             resetselectpick();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             $("#"+GlobalTableId +" tr").each(function() {
                  $(this).children('td').css({ 'background-color': '#ffffff' });
             });
             renumberTable();
        });
        closeSettingsBar("client_menu_area");

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
