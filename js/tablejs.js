     var pushpop = new Array(256);
     function pushpop_dump() { for (index = 0; index < pushpop.length; ++index) console.log(pushpop[index]); }
     function pushpop_dumpandclear() { while (pushpop.length > 0) console.log(pushpop.pop()); }
     function pushpop_empty() { pushpop.length = 0; }
     function pushpop_pop() { return(pushpop.pop()); }
     function picked(sel) {
          var bRet = false;
          var p = $(sel).attr("picked")
          if ( p=="Y" ) bRet = true;
          return(bRet);
     }
     //          console.log( "operd1  : " + operd1 );
     function pickwithselector($sel) { $sel.attr("picked","Y"); }
     function pick(sel) { $(sel).attr("picked","Y"); }
     function unpick(sel) { $(sel).attr("picked","N"); }
     var SELECTEDITEMS = 0;
     var NODESET = [];
     var ENVSET = [];
     var REGSET = [];
     var NODENAMESET = [];
     var PURPOSESET = [];

function resetselectpick() {
          NODESET.length = 0;
          ENVSET.length = 0;
          REGSET.length = 0;
          NODENAMESET.length = 0;
          PURPOSESET.length = 0;
          setCookie('NODESET_C', "", 12);
          setCookie('ENVSET_C', "", 12);
          setCookie('REGSET_C', "", 12);
          setCookie('NODENAMESET_C', "", 12);
          setCookie('PURPOSESET_C', "", 12);
     }
     function selectallrunning() {
          var rc = 0;
          var sz = "";
          var szjs = "";
          resetselectpick();
          SELECTEDITEMS = 0;
          i// var $sel = $("#"+GlobalTableId + " > tbody  > tr");
          var $sel = $("#"+GlobalTableId +" tr[status='GREEN']");
          $sel.each(function() {
                    $(this).children('td').css({ 'background-color': '#DCDCDC' });
                    rc++;
                    sz = sz + $(this).attr("node");
                    SELECTEDITEMS++;
                    NODESET[NODESET.length] = $(this).attr("node");
                    ENVSET[ENVSET.length] = $(this).attr("env");
                    REGSET[REGSET.length] = $(this).attr("reg");
                    NODENAMESET[NODENAMESET.length] = $(this).attr("nodename");
                    PURPOSESET[PURPOSESET.length] = $(this).attr("purpose");
          });

          sz = JSON.stringify(NODESET);
          setCookie('NODESET_C', sz, 12);
          sz = getCookieDefault('NODESET_C',"");
          szjs = JSON.parse(sz);

          setCookie('ENVSET_C', JSON.stringify(ENVSET), 12);
          setCookie('REGSET_C', JSON.stringify(REGSET), 12);
          setCookie('NODENAMESET_C', JSON.stringify(NODENAMESET), 12);
          setCookie('PURPOSESET_C', JSON.stringify(PURPOSESET), 12);
          $("#"+selectedbutton).html( SELECTEDITEMS + " SELECTED"); 
     }
     function selectpick() {
          var rc = 0;
          var sz = "";
          var szjs = "";
          resetselectpick();
          SELECTEDITEMS = 0;
          var $sel = $("#"+GlobalTableId + " > tbody  > tr");
          $sel.each(function() {
               if (picked(this)) {
                    rc++;
                    sz = sz + $(this).attr("node");
                    SELECTEDITEMS++;
                    NODESET[NODESET.length] = $(this).attr("node");
                    ENVSET[ENVSET.length] = $(this).attr("env");
                    REGSET[REGSET.length] = $(this).attr("reg");
                    NODENAMESET[NODENAMESET.length] = $(this).attr("nodename");
                    PURPOSESET[PURPOSESET.length] = $(this).attr("purpose");
               }
          });

          sz = JSON.stringify(NODESET);
          setCookie('NODESET_C', sz, 12);
          sz = getCookieDefault('NODESET_C',"");
          szjs = JSON.parse(sz);

          setCookie('ENVSET_C', JSON.stringify(ENVSET), 12);
          setCookie('REGSET_C', JSON.stringify(REGSET), 12);
          setCookie('NODENAMESET_C', JSON.stringify(NODENAMESET), 12);
          setCookie('PURPOSESET_C', JSON.stringify(PURPOSESET), 12);
          $("#"+selectedbutton).html( SELECTEDITEMS + " SELECTED"); 
     }

     function TableRowPick($parenti) {
          // CALLED WITHIN IDENTITY
          if (picked($parenti)) {
               unpick($parenti);
               $parenti.children('td').css({ 'background-color': '#ffffff' });
          } else {
               pick($parenti);
               $parenti.children('td').css({ 'background-color': '#DCDCDC' });
          }
          selectpick();
     }
     function augment() {
          var hours =  getCookieDefault("DHRS",1);
          var szTupple = "";
          var res      = "";
          while (pushpop.length > 0) {
               var url = "";
               var js = "";
               szTupple = pushpop.pop()
               res = szTupple.split(",");
               var op = res[0];
               var $op = $("#" + op);
               var guid=op;
               var operd1=res[1];
               var operd2=res[2];
               var operd3=res[3];
               var operd4=res[4];
               var r5=res[5];
               var r6=res[6];
               // Because it is used so much this way
               var env=res[2];
               var reg=res[3];
               var node=res[4];
               var nodename=res[5];
               var purpose=res[6];
               var periodIn = getCookieDefault("PER",60);
               var aguid="";
               var $aguid="";
               var $p=""; 
               var options;
               switch (operd1) {
                    case "QURL":
                         $op.myUnderlineBlue();
                         $op.attr("spec",$op.html() );
                         $op.on("click", function(e) {
                              var guid = randomStr();
                              options = { gOp:"queue", 
                                          gWidth:400, gValues:1, gIndex1:8, gIndex2:0, gCeil:25000, gUnits:"Msgs",
                                          gTitleFont: "bold 10px Arial", gDisplayTitle:1,
                                          gSpec:$(this).attr("spec")
                                        };
                              var e   = $("#"+guid).gauge(options);
                              $("#"+guid).gaugeset(0,"");
                              clearInterval(QueueMonitorInterval);
                              QueueMonitorInterval = setInterval(function() {
                                   var sz = "p1?env=EAISBX&op="+options.gOp+"&spec="+options.gSpec;
                                   $.getJSON(sz,function(data) {
                                        var m = data.rows[0].c[options.gIndex1].v;
                                        var t = data.rows[0].c[options.gIndex1-2].v;
                                        $("#"+guid).gaugeset(m, t);
                                   });
                              }, 2000);
                         });
                         break;
                    case "POPS":
                         aguid = randomStr();
                         $("#"+op).html("");
                         $("#"+op).DLC("a",aguid,"theanchor");
                         $p = $("#"+ aguid);
                         $p.append("POP");
                         $p = $("#"+ aguid);
                         $p.attr("node",node);
                         $p.attr("env",env);
                         $p.attr("reg",reg);
                         $p.attr("nodename",nodename);
                         $p.attr("purpose",purpose);
                         $p.on("click", function(e) {
                              e.preventDefault();
                              var $pp = $(this).parent().parent();
                              instancePopup( $pp.attr("node"), $pp.attr("env"), $pp.attr("reg") );
                         });
                         break;
                    case "IDENTITY":
                         aguid = randomStr();
                         $("#"+op).html("");
                         $("#"+op).DLC("a",aguid,"theanchor");
                         $aguid = $("#"+ aguid);
                         $aguid.attr( "node", node )
                         $aguid.attr( "env", env )
                         $aguid.attr( "reg", reg )
                         $aguid.attr( "nodename", nodename )
                         $aguid.attr( "purpose", purpose )
                         $p = $aguid.parent().parent();
                         $p.attr("node",node);
                         $p.attr("env",env);
                         $p.attr("reg",reg);
                         $p.attr("nodename",nodename);
                         $p.attr("purpose",purpose);
                         $aguid.append("P>");
                         $aguid.on("click", function(e) {
                              e.preventDefault();
                              TableRowPick( $(this).parent().parent() );
                         });
                         break;
                    case "MEGAFONT":
                         var $element = $("#"+op);
                         var newFontSize;
                         var currentFontSize = $element.css('font-size');
                         var currentFontSizeNum = parseFloat(currentFontSize, 10);
                         newFontSize = currentFontSizeNum * 3.0;
                         $element.css('font-size', newFontSize);
                         break;
                    case "DROPFONT":
                         var $element = $("#"+op);
                         var currentFontSize = $element.css('font-size');
                         var currentFontSizeNum = parseFloat(currentFontSize, 10);
                         var newFontSize = Math.floor(currentFontSizeNum * 0.8);
                         // $element.css('font-size', newFontSize);
                         break;
                    case "CUTTEXT":
                         $("#"+op).html = "<br><br>" + $("#"+op).html;
                         break;
                    case "RIGHTJUSTIFY":
                         $("#"+op).css({ 'textAlign': 'right' });
                         break;
                    case "UNIQUECOLOR":
                         $("#"+op).css({ 'background-color': 'Green' });
                         break;
                    case "DOLLAR":
                         $("#"+op).css({ 'color': 'Green' });
                         $("#"+op).css({ 'text-align': 'Right' });
                         break;
                    case "RED":
                         $op.css({ 'color': 'Red' });
                         $op.parent().attr("status","RED");
                         break;
                    case "GREEN":
                         $op.css({ 'color': 'Green' });
                         $op.parent().attr("status","GREEN");
                         break;
                    case "DARK":
                         $op.children().css({ 'background-color': '#cfd2db' });
                         break;
                    case "HL_ONE":
 //       background-color: #dfe3ee   cfd2db  b2b5bc 999ca3;
  //      xxbackground-color: #89fc63;   
                         if ($("#"+op).html() == "W1")
                              $("#"+op).parent().children('td').css({ 'background-color': '#cfd2db' });
                         if ($("#"+op).html() == "W2")
                              $("#"+op).parent().children('td').css({ 'background-color': '#b2b5bc' });
                         break;
                    case "netin":
                         $("#"+op).html(jsfunc7("snapCpuPerfNow",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"netin"));
                         break;
                    case "netout":
                         $("#"+op).html(jsfunc7("snapCpuPerfNow",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"netout"));
                         break;
                    case "cpu":
                         $("#"+op).html(jsfunc7("snapCpuPerfNow",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"cpu"));
                         break;
                    case "perf":
                         $("#"+op).html(jsfunc7("snapCpuPerfNow",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"cpu"));
                         break;
                    case "performance":
                         $("#"+op).html(jsfunc7("snapCpuPerfNow",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"cpu"));
                         break;
               }
          }
     }

     var GlobalTableId = "";

// This is faster
// Build an array with a[++i] and .join() it instead of string concatenation
// var html = [], h = −1;
// html[++h] = '<table id="nameTable">';
// $('#container')[0].innerHTML = html.join('');

     function myHideRows() {
          $("#"+GlobalTableId +" tr[status='RED']").hide();
     }
     function doTableChart(szDesc, what,where,description,control,cls) {
          doTableChartImpl("T",szDesc,what,where,description,control,cls);
     }
     function doTableChartImpl(tabletype,szDesc,what,where,description,control,cls) {
        var q = "";
        var i = 0;
        var namedex = -1;
        var obj = { namedex: 0, sortkey: "", headers:"" };
        obj.sortkey = getCookieDefault("SORTKEY","name");
        // HEREHERE
        $.ajaxSetup({ async: false });
        $.getJSON( what, function( data ) { 
             var guid = randomStr();
             $("#bar_area").html( $("#bar_area").attr("bartitle") );
             if ( tabletype == "T" ) {
                   $("#"+where).append( myTable(data, guid, cls, obj) );
                   augment();
                   $("#"+guid).tablesorter({ sortList: [[3,0]] }); 
                   selectpick();
             }
             if ( tabletype == "V" ) {
                  $("#"+where).append( myVable(data, guid, cls, obj) );
             }
             if ( 0 == 1) {
                  if (obj.namedex >0) {
                       $("#"+guid).tablesorter({ sortList: [[obj.namedex-1,0]] }); 
                  }
                  else {
                       $("#"+guid).tablesorter({ sortList: [[2,0]] }); 
                  }
             }
        })
        // .done(function() { var fubar = 0; //alert( "second success" ); })
        .fail(function(jqXHR, ts, et) { alert(erString("GET",what,ts));});
        //  alert("incoming Text "+jqXHR.responseText); })
        // .always(function() { var fubar = 0; //alert( "complete" ); });
        // stack.push($("#client_area").html()); 

     renumberTable();
     }
     function erString(op,sz1,sz2) {
          return("Error: " + op + ", " + sz1 + ", " + sz2);
     }

     function myTable(data,tableid,cls,obj) {
          GlobalTableId = tableid;
          var identity = "NONE";
          var tt = "";
          var n = 0;
          var i = 0;
          var k = 0;
          var ct = 0;
          var ID="";
          var THNAME="";
          var f ="";
          var c =",";
          var guid = "";
          var guidct = "";
          var guidnext = "";
          var nextrow = 0;
          var nlook = 1;
          var html = [];
          var h = 0;
          h = -1;
          n = data.cols.length;
          pushpop_empty();
          //html[++h] = "<table border=1 width='100%' id='";
          html[++h] = "<table width='100%' id='";
          html[++h] = tableid;
          html[++h] = "' class='gridtable'>";
          html[++h] = "<thead>";
          html[++h] = "<tr status='HEADER'>";
          html[++h] = "<th>#</th>";
          obj.headers =  "#, ";
          for (i=0;i<n;i++) {
            ID="TH" + tableid + (i); 
            THNAME=data.cols[i].label;
            if ( data.cols[i].label=="IDENTITY" ) {
                 nlook++;  
                 html[++h] = "<th id='";
                 html[++h] = ID;
                 html[++h] = "' POS='";
                 html[++h] = i+1;
                 html[++h] = "' THNAME='";
                 html[++h] = THNAME;
                 html[++h] = "'>p</th>";
            } else
                 if ( !(data.cols[i].label=="HIDE") ) {
                         nlook++;  
                         if ( data.cols[i].label == obj.sortkey) obj.namedex=nlook;  
                         html[++h] = "<th id='";
                         html[++h] = ID;
                         html[++h] = "' POS='";
                         html[++h] = i+1;
                         html[++h] = "' THNAME='";
                         html[++h] = THNAME;
                         html[++h] = "'>";
                         html[++h] = data.cols[i].label; 
                         html[++h] = "</th>";
                         pushpop.push(ID + ",DROPFONT");
                 }
          }
          html[++h] = "</tr>";
          html[++h] = "</thead>";
          // TH IS DONE
          // TD BEGINS
          html[++h] = "<tbody>";
          for (i=0;i<data.rows.length;i++){
               guidnext  = randomStr();
               nextrow = 0;
               ct++;
               ID="TC" + tableid + '0'; 
               guidct  = randomStr();
               html[++h] = "<tr id='";
               html[++h] = randomStr();
               html[++h] = "'>";
               html[++h] = "<td status='CTC' id='";
               html[++h] = guidct;
               html[++h] = "'>";
               html[++h] = ct.toString();
               html[++h] = "</td>";
               pushpop.push(guidct + ",DROPFONT");

               for (j=0;j<n;j++) {
                    ID="TC" + tableid + (j); 
                    tt=data.cols[j].label;
                    if ( tt == "XXXXIDENTITY" ) {
                         guid  = randomStr();
                         f = data.rows[i].c[j].v;
                         identity = data.rows[i].c[j].v;
                         pushpop.push(guid +c+ tt +c+ identity);
                         continue;
                    }
                    if ( !(tt == "HIDE") ) {
                         f = data.rows[i].c[j].v;
                         guid  = randomStr();
                         if ( f == "R" ) pushpop.push(guid + ",GREEN");
                         if ( f == "S" ) pushpop.push(guid + ",RED");
                         switch (tt) {
                              case "$day": 
                              case "$hour": 
                              case "$mon": 
                              case "$strg": 
                              case "$all": 
                              case "dd": 
                                   pushpop.push(guid + ",RIGHTJUSTIFY");
                                   break;
                              case "s": 
                                   break;
                              case "sg-": 
                              case "subnet-": 
                              case "vpc-": 
                              case "placement": 
                              case "key": 
                              case "vpc": 
                              case "pub": 
                              case "prv": 
                              case "mem": 
                                   break;
                              case "devices": 
                              case "owner": 
                              case "network": 
                              case "sg": 
                                   pushpop.push(guid + ",DARK");
                                   break;
                              case "reg": 
                                   pushpop.push(guid + ",HL_ONE");
                                   break;
                              case "fee": 
                                   pushpop.push(guid +c+ "DOLLAR" +c+ f);
                                   break;
                              case "qurl": 
                                   pushpop.push(guid +c+ "QURL");
                                   break;
                              case "POPS": 
                                   pushpop.push(guid +c+ tt +c+ "POPS");
                                   break;
                              case "IDENTITY": 
                                   identity = f;
                                   pushpop.push(guid +c+ tt +c+ identity);
                                   break;
                              case "netin": 
                              case "netout": 
                              case "cpu": 
                              case "perf": 
                              case "performance": 
                                   pushpop.push(guid +c+ tt +c+ identity);
                                   break;
                              case "purpose": 
                                   pushpop.push(guid +c+ "CUTTEXT");
                                   break;
                         }
                         html[++h] = "<td id='";
                         html[++h] = guid;
                         html[++h] = "' class='";
                         html[++h] = ID;
                         html[++h] = "' POS='";
                         html[++h] = j+1;
                         html[++h] = "'>";
                         html[++h] = f;
                         html[++h] = "</td>";
                   }
               }
               html[++h] = "</tr>";
               if ( nextrow == 1) {
                         html[++h] = "<tr><td colspan=100 id='";
                         html[++h] = guidnext;
                         html[++h] = "'></td></tr>";

               }
          }
          html[++h] = "</tbody></table>";
          return(html.join(''));
     }
     function sortTable($table,order,sel){
          var $rows = $('tbody > tr', $table);
          $rows.sort(function (a, b) {
              var keyA = $(sel, a).text();
              var keyB = $(sel, b).text();
              so = $($table).attr("sortorder");
              if (so=='asc')  order='desc'; 
              if (so=='desc') order='asc'; 
              if (so=='')     order='desc'; 
              if (so==null)   order='desc'; 
              if (order=='asc') {
                  return (keyA > keyB) ? 1 : 0;
              } else {
                  return (keyA > keyB) ? 0 : 1;
              }
          });
          $($table).attr("sortorder", order);
          $('tbody > tr', $table).remove();
          $.each($rows, function (index, row) {
              $table.append(row);
              zrd = zrd;
          });
          renumberTable();
     }

function renumberTable() {
          var ct = 1;
          $.each($("#"+GlobalTableId +" td[status='CTC']").filter(':visible'), function (index, row) {
              this.innerHTML = ct++;
          });
}

