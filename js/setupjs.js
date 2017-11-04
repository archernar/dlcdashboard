function setupScreen() {
             var $client_area = $("#client_area");
             $client_area.empty();
             $client_area.append(tableBy(1));
             var g2 = returnstack.pop();
             var g1 = returnstack.pop();
             var $sa = $("#"+g2);
             $sa.append("<table border=1>");
             myTextControl($sa,"Acct   1",   "",42,"ACC1", function() {return(options.acc1);}, function(s) { options.acc1=s; });
             myTextControl($sa,"Acct # 1",   "",42,"ACN1", function() {return(options.acn1);}, function(s) { options.acn1=s; });
             myTextControl($sa,"AccKey 1",   "",42,"AK1",  function() { return(options.ak1);}, function(s)  { options.ak1=s; });
             myTextControl($sa,"SecKey 1",   "",42,"SK1",  function() { return(options.sk1);}, function(s)  { options.sk1=s;});
             myTextControl($sa,"Acct   2",   "",42,"ACC2", function() {return(options.acc2);}, function(s) { options.acc2=s; });
             myTextControl($sa,"Acct # 2",   "",42,"ACN2", function() {return(options.acn2);}, function(s) { options.acn2=s; });
             myTextControl($sa,"AccKey 2",   "",42,"AK2",  function() { return(options.ak2);}, function(s)  { options.ak2=s; });
             myTextControl($sa,"SecKey 2",   "",42,"SK2",  function() { return(options.sk2);}, function(s)  { options.sk2=s;});
             myTextControl($sa,"Acct   3",   "",42,"ACC3", function() {return(options.acc3);}, function(s) { options.acc3=s; });
             myTextControl($sa,"Acct # 3",   "",42,"ACN3", function() {return(options.acn3);}, function(s) { options.acn3=s; });
             myTextControl($sa,"AccKey 3",   "",42,"AK3",  function() { return(options.ak3);}, function(s)  { options.ak3=s; });
             myTextControl($sa,"SecKey 3",   "",42,"SK3",  function() { return(options.sk3);}, function(s)  { options.sk3=s;});
             myTextControl($sa,"Acct   4",   "",42,"ACC4", function() {return(options.acc4);}, function(s) { options.acc4=s; });
             myTextControl($sa,"Acct # 4",   "",42,"ACN4", function() {return(options.acn4);}, function(s) { options.acn4=s; });
             myTextControl($sa,"AccKey 4",   "",42,"AK4",  function() { return(options.ak4);}, function(s)  { options.ak4=s; });
             myTextControl($sa,"SecKey 4",   "",42,"SK4",  function() { return(options.sk4);}, function(s)  { options.sk4=s;});
             myTextControl($sa,"Acct   5",   "",42,"ACC5", function() {return(options.acc5);}, function(s) { options.acc5=s; });
             myTextControl($sa,"Acct # 5",   "",42,"ACN5", function() {return(options.acn5);}, function(s) { options.acn5=s; });
             myTextControl($sa,"AccKey 5",   "",42,"AK5",  function() { return(options.ak5);}, function(s)  { options.ak5=s; });
             myTextControl($sa,"SecKey 5",   "",42,"SK5",  function() { return(options.sk5);}, function(s)  { options.sk5=s;});
             $sa.append("</table>");


             $client_area = $("#"+g1);
             myTextControl($client_area,"Chart Area Width","",8,"CHAW", 
                           function()  {return(options.chartArea.width);},
                           function(s) {       options.chartArea.width=s;}
                          );
             myTextControl($client_area,"Chart Area Height","",8,"CHAH", 
                           function()  {return(options.chartArea.height);},
                           function(s) {       options.chartArea.height=s;}
                          );
             myTextControl($client_area,"Chart Width","",8,"CHW", 
                           function()  {return(options.width);},
                           function(s) {       options.width=s;}
                          );
             myTextControl($client_area,"Chart Back-Color","",8,"CHBC", 
                           function()  {return(options.backgroundColor);},
                           function(s) {       options.backgroundColor=s;}
                          );
             myTextControl($client_area,"Chart Height","",8,"CHH", 
                           function()  {return(options.height);},
                           function(s) {       options.height=s;}
                          );
             myTextControl($client_area,"Line Width Zero","",8,"LW0", 
                           function()  {return(options.series[0].lineWidth);},
                           function(s) {       options.series[0].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color Zero","",8,"LC0", 
                           function()  {return(options.colors[0]);},
                           function(s) {       options.colors[0]=s;}
                          );
             myTextControl($client_area,"Line Width One","",8,"LW1", 
                           function()  {return(options.series[1].lineWidth);},
                           function(s) {       options.series[1].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color One","",8,"LC1", 
                           function()  {return(options.colors[1]);},
                           function(s) {       options.colors[1]=s;}
                          );
             myTextControl($client_area,"Line Width Two","",8,"LW2", 
                           function()  {return(options.series[2].lineWidth);},
                           function(s) {       options.series[2].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color Two","",8,"LC2", 
                           function()  {return(options.colors[2]);},
                           function(s) {       options.colors[2]=s;}
                          );
             myTextControl($client_area,"hAxis Text Font","",8,"HXF", 
                           function()  {return(options.hAxis.textStyle.fontSize);},
                           function(s) {options.hAxis.textStyle.fontSize=s;}
                          );
             myTextControl($client_area,"hAxis Format","",8,"HXFMT", 
                           function()  {return(options.hAxis.format);},
                           function(s) {options.hAxis.format=s;}
                          );
             $client_area.append("</table>");
             $client_area = $("#client_area");
     if ( 1 == 0 ) {
             guid  = randomStr();
             $("#client_area").append("<table width='50%' ><tr><td id='"+guid+"'></td></tr></table>");
             for (i=0;i<NODESET.length;i++)  {
             $("#client_area").append(NODESET[i] +","+ ENVSET[i] +","+ REGSET[i] +","+ NODENAMESET[i] +","+ PURPOSESET[i]+"<br>");
             }
             guid  = randomStr();
             $("#client_area").append("<div id='"+guid+"'></div>");
             myB(160,guid,cls,"mil time","SET24",["On","Off","On","Off"]);
             myB(160,guid,cls,"font size","SETFONT",["default","smaller","bigger"]);
             myB(160,guid,cls,"chart update","UPCHT",["Off","On"]);
             myB(160,guid,cls,"update period","PDCHT",["0","7","15","30","60","120"]);
     }
}
function queueTestSetupScreen() {
             var $client_area = $("#client_area");
             myTextControl($client_area,"Test Queue (https://...)","",66,"QQTARN", 
                           function()  {return(options.qqtarn);},
                           function(s) {       options.qqtarn=s;}
                          );
}
