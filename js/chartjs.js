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
           options.legend.textStyle.fontSize          =  9;
           options.vAxis.textStyle.fontSize           =  10;
           options.vAxis.titleTextStyle.fontSize      =  12;
           options.height = options.baseheight + cfgZoom 
           options.chartArea.height = options.chartArea.baseheight + cfgZoom;
           

                options.legend.textStyle.fontSize          =  10;
                options.vAxis.textStyle.fontSize           =  10;
                options.vAxis.titleTextStyle.fontSize      =  10;
                options.width =  $("#"+where).innerWidth;
                options.height = 160
                options.backgroundColor               =  "#F5F5F5";
                options.chartArea.left = 70;
                options.chartArea.top = 30;
                options.chartArea.width = options.width;
                options.chartArea.height = 80;
                options.chartArea.backgroundColor     =  "#F5F5F5";
                options.vAxis.viewWindowMode = 'pretty';
                if (cfgYAxis == -1) {
                     ctype_actual=mapChartType(getCookie("CHARTTYPE")); 
                }
                else {
                     options.vAxis.viewWindow ={ max:100, min:0 };
                     options.vAxis.viewWindow.max = cfgYAxis;
                     ctype_actual=mapChartType(getCookie("CHARTTYPE")); 
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

                var vd = new google.visualization.DataTable( JSON.stringify(data) ); 
                switch (ctype_actual) {
                     case "MOE":
                          var svg = dimple.newSvg("body", 800, 400);
                          var data = [
                               { "Word":"Hello", "Awesomeness":2000 },
                               { "Word":"Hello2", "Awesomeness":2000 },
                               { "Word":"Hello33", "Awesomeness":2000 },
                               { "Word":"Hello4", "Awesomeness":2000 },
                               { "Word":"Hello33", "Awesomeness":2000 },
                               { "Word":"World", "Awesomeness":3000 },
                               { "Word":"World2", "Awesomeness":1000 }
                          ];
                          var chart = new dimple.chart(svg, data);
                          chart.addCategoryAxis("x", "Word");
                          chart.addMeasureAxis("y", "Awesomeness");
                          chart.addSeries(null, dimple.plot.line);
                          chart.draw();
                          break;
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
     function chartjsTitle2(sz,n,node,name,purpose,env, url) {
          var szRet="";
          var spc = ", ";
          szRet = szRet + sz + spc + env + spc + name + spc + node + spc + purpose; 
          return(szRet);
     }

     function chartjsSnapPerf(cht,guid,url,env,reg,node,vlabel,label)  { chartjsDoChart(cht,url,guid,vlabel,node,label); }


