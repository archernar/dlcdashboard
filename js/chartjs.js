function chartjsDoTableChart(what,where,description,control,cls) {
        var mojo = "";
        var sz = "";
        var szLi = "";
        var szsz = "";
        var q = "";
        $.getJSON( what, function( data ) { 
             var guid = randomStr();
             sz = myTable(data, guid, cls); 
             szsz = $("#bar_area").attr("bartitle");
             $("#bar_area").html(szsz);
             $("#"+where).append(sz);
             augment();
             var sel0='#' + guid;
             var sel1='#TC' + guid + '1';
             var sel2='#TH' + guid + '1';
             $(sel0).tablesorter();
        });
     }

      function chartjsDoChart(ctype,what,where,vlabel,node,title) {
        var cfgZoom  = getCookie("ZOOM")*1;
        var cfgYAxis = -1;
        if (getCookie("YAXIS") != "auto") cfgYAxis = getCookie("YAXIS")*1;
        chartjsDoChartRRR(ctype,what,where,vlabel,node,title, cfgZoom, cfgYAxis);
        if (getCookieDefault("UPDT","Off")=="On")
             INTERVALSET[INTERVALSET.length] = setInterval(function() {
                  chartjsDoChartRRR(ctype,what,where,vlabel,node,title, cfgZoom, cfgYAxis);
             }, 60000);


      }

      function chartjsDoChartRRR(ctype,what,where,vlabel,node,title,  cfgZoom, cfgYAxis) {
           var $client_area = $("#client_area");
           var ctype_actual = "Line";
           var t;
           var nb=", ";
           var mydate = new Date();
           // COLOR UP
           if ( 1 == 0 ) {
                options.legend.textStyle.color        =  "White";
                options.chartArea.backgroundColor     =  "Black";
                options.backgroundColor               =  "Black";
                options.titleTextStyle.color          =  "White";
                options.vAxis.gridlines.color         =  "White";
                options.vAxis.textStyle.color         =  "White";
                options.vAxis.titleTextStyle.color    =  "White";
                options.hAxis.gridlines.color         =  "White";
                options.hAxis.textStyle.color         =  "White";
                options.hAxis.titleTextStyle.color    =  "White";
           }
           options.legend.textStyle.fontSize          =  9;
           options.vAxis.textStyle.fontSize           =  10;
           options.vAxis.titleTextStyle.fontSize      =  12;

           // -- options.hAxis.textStyle.fontSize           =  10;
           // -- options.hAxis.titleTextStyle.fontSize      =  12;
           if ( getCookie("EXP") == "Two" ) {
                options.hAxis.textStyle.fontSize           =  10;
                options.hAxis.titleTextStyle.fontSize      =  10;
                options.titleTextStyle.fontSize            =  10;
           }
           if ( getCookie("EXP") == "Three" ) {
                options.hAxis.textStyle.fontSize           =  9;
                options.hAxis.titleTextStyle.fontSize      =  9;
                options.titleTextStyle.fontSize            =  9;
                options.legend.textStyle.fontSize          =  9;
                options.titleTextStyle.fontSize            =  9;
                options.vAxis.textStyle.fontSize           =  9;
                options.vAxis.titleTextStyle.fontSize      =  9;
           }
           if ( getCookie("EXP") == "Four" ) {
                options.hAxis.textStyle.fontSize           =  9;
                options.hAxis.titleTextStyle.fontSize      =  9;
                options.titleTextStyle.fontSize            =  9;
                options.legend.textStyle.fontSize          =  9;
                options.titleTextStyle.fontSize            =  9;
                options.vAxis.textStyle.fontSize           =  9;
                options.vAxis.titleTextStyle.fontSize      =  9;
           }

           options.height = options.baseheight + cfgZoom 
           options.chartArea.height = options.chartArea.baseheight + cfgZoom;
           
           if ( ctype == "Line" ) {
                options.width =  $client_area.innerWidth / 2;
                options.chartArea.width = $client_area.innerWidth / 2;
           }

           if ( ctype == "BILLING" ) {
                options.width =  $client_area.innerWidth;
                options.chartArea.width = '90%';
                options.vAxis.viewWindowMode = 'pretty';
                if (cfgYAxis == -1) {
                     ctype_actual="Column";
                }
                else {
                     options.vAxis.viewWindow ={ max:100, min:0 };
                     options.vAxis.viewWindow.max = cfgYAxis;
                     ctype_actual="Column";
                }
           }
           if ( ctype == "CPU" ) {
                options.width =  $client_area.innerWidth;
                options.width =  $("#"+where).innerWidth;
                options.chartArea.width = '90%';
                options.vAxis.viewWindowMode = 'pretty';
                if (cfgYAxis == -1) {
                     ctype_actual=mapChartType(getCookie("CPUCT")); 
                }
                else {
                     options.vAxis.viewWindow ={ max:100, min:0 };
                     options.vAxis.viewWindow.max = cfgYAxis;
                     ctype_actual=mapChartType(getCookie("CPUCT")); 
                }
           }
           if ( ctype == "NET" ) {
                options.width =  $client_area.innerWidth;
                options.chartArea.width = '90%';
                ctype_actual=mapChartType(getCookie("NETCT")); 
           }
           if ( ctype == "DISK" ) {
                options.width =  $client_area.innerWidth;
                options.chartArea.width = '90%';
                ctype_actual=mapChartType(getCookie("DISKCT")); 
           }
           $.getJSON( what, function( data ) { 
                var d = 1;
                var labels = 0;
                var anchor="";
                options.title = title;
                labels = getCookieDefault("LABELS",0);

                options.vAxis.title = vlabel;
                options.hAxis.gridlines.count = 8;
                options.hAxis.title = data.rows.length + " pts, " + data.effpst + " - " + data.effnow;
                if ( ctype == "MINI_CPU" ) {
                     options.backgroundColor = "#dfe3ee";
                     options.hAxis.title = "";
                     options.hAxis.gridlines.count = 0;
                     options.vAxis.gridlines.count = 0;
                     options.legend.position = 'none';
                     options.width =   120;
                     options.height =  20;
                     options.chartArea.left     =  0;
                     options.chartArea.top      =  0;
                     options.chartArea.width    =  options.width;
                     options.chartArea.height   =  options.height;
                     options.chartArea.backgroundColor = "#dfe3ee";
                     options.vAxis.viewWindow ={ max:100, min:0 };
                     ctype_actual="Column";
                }
                if ( ctype == "POPUP_CPU" ) {
                     var mfw =  Math.floor(screen.width/4);
                     options.backgroundColor = "#dfe3ee";
                     options.title = "CPU Utilization";
                     options.vAxis.title = "% CPU";
                     options.hAxis.textStyle.fontSize = 9;
                     options.hAxis.titleTextStyle.fontSize = 9;

                     options.width =   mfw;
                     options.height =  120;
                     options.hAxis.gridlines.count = 4;
                     options.vAxis.gridlines.count = 4;
                     options.vAxis.textStyle.fontSize = 9;
                     options.vAxis.titleTextStyle.fontSize = 9;
                     options.chartArea.top      =  10;
                     options.chartArea.left     =  40;
                     options.chartArea.width    =  Math.floor(options.width*.80);
                     options.chartArea.height   =  Math.floor(options.height*.50);
                     options.chartArea.backgroundColor = "Cyan";
                     options.chartArea.backgroundColor = "#dfe3ee";
                     options.hAxis.slantedText  = true;
                     options.legend.position = 'in';
                     options.legend.fontSize =  9;
                     ctype_actual="Line";


                }


                var vd = new google.visualization.DataTable( JSON.stringify(data) ); 
                switch (ctype_actual) {
                     case "Line":
                          (new google.visualization.LineChart(document.getElementById(where))).draw(vd, options);
                          break;
                     case "Column":
                          (new google.visualization.ColumnChart(document.getElementById(where))).draw(vd, options);
                          break;
                     case "Scatter":
                          (new google.visualization.ScatterChart(document.getElementById(where))).draw(vd, options);
                          break;
                }
           });
      }

     function chartjsSimpleTitle(sz) {
          var szRet="";
          szRet = szRet + sz + "\n"
          return(szRet);
     }
     function chartjsTitleLong(sz,n,node,name,purpose,hours,period,offset) {
          var szRet="";
          var spc = ", ";
          var slash = "/";
          szRet = szRet + sz +spc+ name +spc+ node +spc+ purpose + spc
          szRet = szRet + hours +slash+ period +slash+ offset;
          return(szRet);
     }
     function chartjsTitle(sz,n,node,name,purpose) {
          var szRet="";
          var spc = ", ";
          szRet = szRet + sz + spc + name + spc + node + spc + purpose 
          return(szRet);
     }

     function chartjsSnapPerf(cht,guid,url,env,reg,node,vlabel,label)  { chartjsDoChart(cht,url,guid,vlabel,node,label); }


