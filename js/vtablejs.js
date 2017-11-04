
     function doVableChart(what,where,description,control,cls) {
          doTableChartImpl("V",what,where,description,control,cls);
     }
     function myVable(data,tableid,cls,obj) {
          GlobalTableId = tableid;
          var html = [];
          var n = 0;
          var i = 0;
          var j = 0;
          var ct = 0;
          var h = -1;
          var c =",";
          n = data.cols.length;
          html[++h] = "<table width='98%' id='";
          html[++h] = tableid;
          html[++h] = "' class='gridtable'>";
          html[++h] = "<thead>";
          html[++h] = "<tr status='HEADER'>";
             // html[++h] = "<th>#</th>";
          html[++h] = "<th>label</th>";
          html[++h] = "<th>value</th>";
          html[++h] = "</tr>";
          html[++h] = "</thead>";
          html[++h] = "<tbody>";
          for (j=0;j<data.cols.length;j++){
               guidnext  = randomStr();
               nextrow = 0;
               ct++;
               ID="TC" + tableid + '0'; 
               guid  = randomStr();
               html[++h] = "<tr id='";
               html[++h] = randomStr();
               html[++h] = "'>";
                  // html[++h] = "<td id='";
                  // html[++h] = guid;
                  // html[++h] = "'>";
                  // html[++h] = ct.toString();
                 //  html[++h] = "</td>";
                         guid      = randomStr();
                         html[++h] = "<td id='";
                         html[++h] = guid;
                         html[++h] = "'>";
                         html[++h] = data.cols[j].label;
                         html[++h] = "</td>";

                         guid      = randomStr();
                         html[++h] = "<td id='";
                         html[++h] = guid;
                         html[++h] = "'>";
                         html[++h] = data.rows[0].c[j].v;
                         html[++h] = "</td>";
                         switch (data.cols[j].label) {
                              case "IDENTITY": 
                                   pushpop.push(guid +c+ data.cols[j].label +c+ data.rows[0].c[j].v);
                                   break;
                         }
          html[++h] = "</tr>";
          }
          html[++h] = "</tbody>";
          html[++h] = "</table>";
          return(html.join(''));
     }
