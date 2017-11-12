function booton($sel,name,func) {
        var guid = randomStr();
        $sel.append("<button class='booton' id='"+guid+"'>"+name+"</button>&nbsp;&nbsp;");
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             func();
        });
        return(guid);
}
function namedbooton($sel,name,func) {
        $sel.append("<button class='booton' id='"+name+"'>"+name+"</button>");
        $("#"+name).on("click", function(e) {
             e.preventDefault();
             func();
        });
        return(name);
}

var GlobalHiderId = "";
var GlobalGaugeHiderId = "";
function gaugehider() {
     var $sel = $("#" + GlobalGaugeHiderId);
     if ($sel.html().toUpperCase() == "SHOW GAUGES") { 
          $("#gauge_area").show();
          $sel.empty().append("HIDE GAUGES");
     }
     else {
          $("#gauge_area").hide();
          $sel.empty().append("SHOW GAUGES");
     }
}
function hider() {
     // NOTENOTE
     var $sel = $("#" + GlobalHiderId);
     var sz = getCookie("BHID");
     //if ($sel.html().toUpperCase() == "SHOW MENU") { 
     if (sz.toUpperCase() == "SHOW MENU") { 
          $("#variable_menu_area").hide();
     }
     else {
          $("#variable_menu_area").show();
     }
}

function myBCV(sty,g1,cls,title,cookie, s, callback) {
     var g2 = addSettingsVElement$(g1);
     var guid = myBimpl(sty,g2,cls,title,cookie, s);
     setCookie(cookie, s[0], 12);
     $("#"+guid).on("click", function(e) {
          e.preventDefault();
          callback()
     });
     return(guid);
}
function myTextArea(g1,r,c) {
     var guid = randomStr();
     $("#"+g1).html("<textarea rows=" +r+ " cols="+c+" id="+guid+"></textarea>");
     return(guid);
}

function myBC(sty,g1,cls,title,cookie, s, callback) {
     var g2 = addSettingsElement(g1);
     var guid = myBimpl(sty,g2,cls,title,cookie, s);
     setCookie(cookie, s[0], 12);
     $("#"+guid).attr("guidtag",title);
     $("#"+guid).on("click", function(e) {
          e.preventDefault();
          callback()
     });
     return(guid);
}

function myB(sty,g1,cls,title,cookie, s) {
     var g2 = addSettingsElement(g1);
     myBimpl(sty,g2,cls,title,cookie, s);
}
function myB2(sty,g1,cls,title,cookie,s,title2,cookie2,s2) {
     var g2 = addSettingsElement(g1);
     myBimpl(sty,g2,cls,title,cookie, s);
     myBimpl(sty,g2,cls,title2,cookie2, s2);
}
function myInput(sty,g1,cls,title,cookie, s) {
     var g2 = addSettingsElement(g1);
     myInputimpl(sty,g2,cls,title,cookie, s);
}
function myInputimpl(w,g2,cls,title,cookie, s) {
     var xcls="booton";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomStr();
     if (w == 0) w = 65;
     if (isOnOff(s)) w = w - 10;
     z2=g2;

     var guid = randomStr();
     sz="<table width="+w+"><tr><td class='"+xcls+"' id='"+guid+"'></td></tr></table>";
     $("#"+z2).append(sz);

     var temp = getCookie(cookiedex);
     if (isNaN(temp)) setCookie(cookiedex, 0, 12);
     if (temp > (s.length-1)) setCookie(cookiedex, 0, 12);
     if (temp < 0) setCookie(cookiedex, 0, 12);
     temp = (getCookie(cookie+"DEX")*1);
     setCookie(cookie, s[temp], 12);
     var  cv = fontUP(getCookie(cookie));
     var z= parseInt($('#'+guid).css('font-size')) ;
     $("#"+guid).css({'color': 'White'});
     
     var inputguid = randomStr();
     sz = "<input type='text' id='"+inputguid+"'>";
     $("#"+guid).empty().append(title+"<br>"+sz);
     $("#"+inputguid).attr("size",3);
     $("#"+inputguid).attr("value","12C")


        $("#"+guid).on("click", function(e) {
             e.preventDefault();
//             dicate(guid,cookie, s);
        });
        return(guid);
}
function oT(guid, w) {
     return("<table id='" + guid + "' width=" + w + ">");
}
function myBimplSelector(w,$sel,cls,title,cookie, s) {
     var xcls="booton";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     if (w == 0) w = 65;
     if (isOnOff(s)) w = w - 10;
     var guid = randomStr();
     sz="<table width="+w+"><tr><td class='"+xcls+"' id='"+guid+"'></td></tr></table>";
     $($sel).append(sz);
     var $guid = $("#"+guid);
     var temp = getCookie(cookiedex);
     if (isNaN(temp)) setCookie(cookiedex, 0, 12);
     if (temp > (s.length-1)) setCookie(cookiedex, 0, 12);
     if (temp < 0) setCookie(cookiedex, 0, 12);
     temp = (getCookie(cookie+"DEX")*1);
     setCookie(cookie, s[temp], 12);
     var  cv = fontUP(getCookie(cookie));
     var z= parseInt($guid.css('font-size')) ;
     $guid.css({'color': 'White'});
        if (isOnOff(s)) {
             $guid.append(title).attr("thistitle",title).css('padding-top','1px').css('padding-bottom','1px');
               if ( (temp % 2) == 0) 
                  $guid.css({'text-decoration': 'none'}); else $guid.css({'text-decoration': 'underline'});
        }
        else {
             $guid.empty().append(title+"<br>"+cv).attr("thistitle",title);
        }

        $guid.on("click", function(e) {
             e.preventDefault();
             dicate(guid,cookie, s);
        });
        return(guid);
}
function myBText(w,g2,cls,text) {
     var sz = "";
     var guid = randomStr();
     sz="<table width="+w+"><tr><td width='100%' align='middle' class='"+cls+"' id='"+guid+"'></td></tr></table>";
     $("#"+g2).append(sz);
     $("#"+guid).append(text);
     return(guid);
}
// MYBIMPL
function myBimpl(w,g2,cls,title,cookie, s) {
     // var xcls="booton";
     // cls = "bootonsmall";
     //if ( cls == "bootonsmall" ) xcls =cls;
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomStr();
     if (w == 0) w = 55;
     if (isOnOff(s)) w = w - 10;
     z2=g2;

     var guid = randomStr();
     sz="<table width="+w+"><tr><td width='100%' align='middle' class='"+cls+"' id='"+guid+"'></td></tr></table>";
     $("#"+z2).append(sz);
     var $guid = $("#"+guid);
     var szTitle = ""; 
     var temp = "";
     var cv = "";
     if ( cookie != "" ) {
          temp = getCookie(cookiedex);
          if (isNaN(temp)) setCookie(cookiedex, 0, 12);
          if (temp > (s.length-1)) setCookie(cookiedex, 0, 12);
          if (temp < 0) setCookie(cookiedex, 0, 12);
          temp = (getCookie(cookie+"DEX")*1);
          setCookie(cookie, s[temp], 12);
          cv = fontUP(getCookie(cookie));
          cv = getCookie(cookie);
     }
     //var z= parseInt($('#'+guid).css('font-size')) ;
     var z= parseInt($guid.css('font-size')) ;
     // $guid.css({'color': 'White'});
        if (isOnOff(s)) {
             $guid.append(title).attr("thistitle",title).css('padding-top','1px').css('padding-bottom','1px');
               if ( (temp % 2) == 0) 
                  $guid.css({'text-decoration': 'none'}); else $guid.css({'text-decoration': 'underline'});
        }
        else {
             szTitle = title+"<br>";
             if (title == "") szTitle = "";
             cv = "";
             if ( cookie != "" ) cv = getCookie(cookie);
             $guid.html(szTitle+cv).attr("thistitle",title).css('padding-top','0px').css('padding-bottom','0px');
        }
        $guid.css('text-align','center');
        $guid.css('vertical-align','center');
        $guid.on("click", function(e) {
             e.preventDefault();
             dicate(guid,cookie, s);
        });
        return(guid);
}
     function dicate(guid,cookie, s) {
             var szTitle = "";
             var $guid = $("#"+guid);
             var dex  = "";
             var cv  = "";
             var sz  = "";
             if ( cookie != "" ) {
                  dex  = (getCookie(cookie+"DEX")*1)+1;
                  if (dex == s.length)  dex = 0; 
                  setCookie(cookie+"DEX", dex, 12);
                  setCookie(cookie, s[dex], 12);
                  cv = fontUP(getCookie(cookie));
                  cv = getCookie(cookie);
             }
             var title= $guid.attr("thistitle")
	     if (isOnOff(s)) {
                     if ( (dex % 2) == 0) 
                       $guid.css({'text-decoration': 'none'}); else $guid.css({'text-decoration': 'underline'});
             }
             else {
                  szTitle = title+"<br>";
                  if (title == "") szTitle = "";
                  cv = "";
                  if ( cookie != "" ) cv = getCookie(cookie);
                  $guid.html(szTitle+cv);
             }
     }
     function dicateSimple(guid,cookie, s) {
             var $guid = $("#"+guid);
             var dex  = (getCookie(cookie+"DEX")*1)+1;
             if (dex == s.length)  dex = 0; 
             setCookie(cookie+"DEX", dex, 12);
             setCookie(cookie, s[dex], 12);
             var cv = getCookie(cookie);
             var title= $guid.attr("thistitle")
             $guid.empty().append(cv);
     }

function mySimpleButton(w,g2,cls,title,cookie, s) {
     var xcls="booton";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomStr();
     if (w == 0) w = 65;
     z2=g2;
     var guid = randomStr();
     sz="<table><tr><td class='"+xcls+"' id='"+guid+"'></td></tr></table>";
     $("#"+z2).append(sz);
     var $guid = $("#"+guid);
     var temp = getCookie(cookiedex);
     if (isNaN(temp)) setCookie(cookiedex, 0, 12);
     if (temp > (s.length-1)) setCookie(cookiedex, 0, 12);
     if (temp < 0) setCookie(cookiedex, 0, 12);
     temp = (getCookie(cookie+"DEX")*1);
     setCookie(cookie, s[temp], 12);
     var  cv = getCookie(cookie);
     var z= parseInt($guid.css('font-size')) ;
     $guid.css({'color': 'White'});
     $guid.empty().append(cv).attr("thistitle",title);
     $guid.on("click", function(e) {
          e.preventDefault();
          dicateSimple(guid,cookie, s);
     });
     return(guid);
}

(function ( $ ) {
    $.fn.textcontrol = function (title,s,cookie,getter,setter) {
     var html = [];
     var h = -1;
     var  guid = randomStr();
     var iguid = randomStr();
     var v = getCookie(cookie); 
     if ( v == "") v = getter();
     setter(v); 
     h = -1;
     html[++h] = "<br><br>";
     html[++h] = "<ul>";
     html[++h] = "<div class='large'>"+title+":</div>";
     html[++h] = "<br>";
     html[++h] = "<input class='largeinput' value='" +v+ "' size=" +s+ " id='" +iguid+ "'>";
     html[++h] = "<br><br>";
     html[++h] = "<button id='"+guid+"'>update</button>";
     html[++h] = "</ul>";
     this.append(html.join(''));
     $("#"+guid).on("click", function(e) {
          e.preventDefault();
          setter( dicateTextControl(guid,iguid,cookie));
     });
     return this;
    };
}( jQuery ));
(function ( $ ) {
    $.fn.textcontroldialog = function (title,cookie,getter,setter) {
     var s = 66;
     var html = [];
     var h = -1;
     var  guid = randomStr();
     var iguid = randomStr();
     var dial = randomStr();
     var v = getCookie(cookie); 
     if ( v == "") v = getter();
     setter(v); 
     h = -1;
     html[++h] = "<div id='"+dial+"' title='"+title+"'>";
     html[++h] = "<input class='largeinput' value='" +v+ "' size=" +s+ " id='" +iguid+ "'>";
     html[++h] = "</div>";
     this.append(html.join(''));
     $("#"+dial).dialog({ width:600, height:100, buttons: { "Cancel": function() { $("#"+dial).dialog('close');},
                                                 "Update": function() { 
                                                             setter(dicateTextControl(guid,iguid,cookie));
                                                              $("#"+dial).dialog('close'); 
                                                          }
                                               }
                         });
     //$("#"+guid).on("click", function(e) {
     //     e.preventDefault();
     //     setter( dicateTextControl(guid,iguid,cookie));
     //});
     return this;
    };
}( jQuery ));

// Example Call
// var $ia = $("#xxxx").empty().show().textcontroldialog("MESSAGE SIZE","MSGSZ",
//                                           function() {return(options.msgsz);},
//                                           function(s) {options.msgsz=s;});

(function ( $ ) {
    $.fn.textareadialog = function (title,r,c,cookie,getter,setter) {
     var s = 66;
     var html = [];
     var h = -1;
     var  guid = randomStr();
     var iguid = randomStr();
     var dial = randomStr();
     var v = getCookie(cookie); 
     if ( v == "") v = getter();
     setter(v); 
     setCookie(cookie, v, 100);
     v = getCookie(cookie); 
     h = -1;
     html[++h] = "<div id='"+dial+"' title='"+title+"'>";
     html[++h] = "<br><br><textarea rows=" +r+ " cols=" +c+ " id='" +iguid+ "'>";
     html[++h] = unescape(v);
     html[++h] = "</textarea>";
     html[++h] = "</div>";
     this.append(html.join(''));
     $("#"+iguid).css({'color':'Black','font-size':'110%','font-weight':'bold'});


     $("#"+dial).dialog({closeOnEscape: false, width:675, height:475, buttons: { "Cancel": function() { $("#"+dial).dialog('close');},
                                                 "Update": function() { 
                                                             var t = $("#"+iguid).val();
                                                             var text = t;
                                                             testJSON(t);
                                                             var escapedtext = escape(t);
                                                             setter(escapedtext);
                                                             setCookie(cookie, escapedtext, 100);
                                                             $("#"+dial).dialog('close'); 
                                                          }
                                               }
                         });
     return this;
    };
}( jQuery ));
(function ( $ ) {
    $.fn.viewer = function (title,r,c,v) {
     var s = 66;
     var html = [];
     var h = -1;
     var  guid = randomStr();
     var iguid = randomStr();
     var dial = randomStr();
     h = -1;
     html[++h] = "<div id='"+dial+"' title='"+title+"'>";
     html[++h] = "<br><br><textarea rows=" +r+ " cols=" +c+ " id='" +iguid+ "'>";
     html[++h] = unescape(v);
     html[++h] = "</textarea>";
     html[++h] = "</div>";
     this.append(html.join(''));
     $("#"+iguid).css({'color':'Black','font-size':'110%','font-weight':'bold'});

     $("#"+dial).dialog({closeOnEscape: false, width:675, height:475, buttons: { 
                                                 "Cancel": function() {  
                                                             $("#"+dial).dialog('close');
                                                           },
                                                 "Update": function() { 
                                                             var t = $("#"+iguid).val();
                                                             var obj = JSON.parse(t);
                                                             $.extend(options, obj);
                                                             $.post("p1", { crack : JSON.stringify(options), op : "figgy" } );
                                                             $("#"+dial).dialog('close');
                                                           }
                                                  }});
     return this;
   };
}( jQuery ));

function myTextControl($sel,title,cls,s,cookie,getter,setter) {
     var xcls="booton";
     if (cls == "") cls = xcls;

     var sz = "";
     var i = 0;

     var  guid = randomStr();
     var iguid = randomStr();
     var tguid = randomStr();
     var v = getCookie(cookie); 
     if ( v == "") v = getter();
     setter(v); 
     var thisurl="http://localhost:8080/s3u/p1?env=POPEYE&op=ding&loc=E1&cry=" +cryEncode(v);
     thisurl = "<A href='" + thisurl + "'>" + cryEncode(v) + "</A>" 
     // hexString = yourNumber.toString(16);
     // yourNumber = parseInt(hexString, 16);

     sz = sz +"<tr>"
     sz = sz +"<td valign=middle>" +title+ "</td>";
     sz = sz +"<td valign=middle id='"+tguid+"'><input value='" +v+ "' size=" +s+ " id='" +iguid+ "'></td>";
     // sz = sz +"<td><b>" + thisurl + "</b></td>";
     sz = sz +"<td valign=middle class='"+cls+"' id='"+guid+"'></td>";
     sz = sz +"</tr>";
     $sel.append(sz);
     // $("#"+iguid).attr("size", $tguid.attr("width")-6 );

     var $guid = $("#"+guid);
     var  cv = "set";
     $guid.empty().append(cv);
     $guid.on("click", function(e) {
          var sz = "";
          e.preventDefault();
          sz = dicateTextControl(guid,iguid,cookie);
          setter(sz); 
     });
     return(guid);
}
     function dicateTextControl(guid,iguid,cookie) {
             var $guid = $("#"+guid);
             var $iguid = $("#"+iguid);
             var sz = "";
             var sz = document.getElementById(iguid).value;
             setCookie(cookie, sz, 12);
             $iguid.attr("value", sz);
             return(sz);
     }

