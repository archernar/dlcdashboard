var DLCQUEUE = [];
function pushQueue(sz) {
    DLCQUEUE.push(sz);
}
function popQueue() {
    var value = DLCQUEUE.shift();
    return(value);
}
function tablefilter(regextext,thname) {
     var $rowsNo = $("#"+GlobalTableId +" tr").filter(function () {
          var  pos = $("#"+GlobalTableId +" th[thname='" + thname + "']").attr("pos");
          var sztemp = $.trim($(this).find('td').eq(pos).text());
          return (sztemp.search(regextext) == -1);
     }).hide();
     $("#"+GlobalTableId +" tr[status='HEADER']").show();
}

function reggie(r,sz,prefix) {
     return ( (r.test(sz)) ? prefix+sz : "" );
}

function median(values) {
        values.sort( function(a,b) {return a - b;} );
            var half = Math.floor(values.length/2);
                if(values.length % 2)
                      return values[half];
                else
                      return (values[half-1] + values[half]) / 2.0;
}
var StringBuilderArray = [];
var StringBuilderArrayIndex = -1;
function sbInit(sz)   { stringBuilderInit(sz); }
function stringBuilderInit(sz)   { stringBuilderEmpty(); stringBuilderAdd(sz); }
function stringBuilderEmpty()    { StringBuilderArray.length = 0; StringBuilderArrayIndex = -1; }
function sbAdd(sz)               { stringBuilderAdd(sz); }
function stringBuilderAdd(sz)    { StringBuilderArray[++StringBuilderArrayIndex] = sz; }
function stringBuilderString()   { return(StringBuilderArray.join('')); }
function sbString()              { return(StringBuilderArray.join('')); }
function fontUP2CENTER(sz) { return("<center>"+fontUP2(sz)+"</center>"); }
function fontUPCENTER(sz) { return("<center>"+fontUP(sz)+"</center>"); }
function fontCENTER(sz) { return("<center>"+sz+"</CENTER>"); }
function fontUP(sz) { return("<font size=+1>"+sz+"</font>"); }
function fontUP2(sz) { return("<font size=+2>"+sz+"</font>"); }
function fontDOWN(sz) { return("<font size=-1>"+sz+"</font"); }
function fontDOWN2(sz) { return("<font size=-2>"+sz+"</font"); }
function maxvalue(n,m,r) { var ret = n; if ( n > m ) { ret = r; } return (ret); }
function minvalue(n,m,r) { var ret = n; if ( n < m ) { ret = r; } return (ret); }
function dq(sz)    { return("\"" + sz + "\"");}
function paren(sz) { return("(" + sz + ")");}
function suig(sz)  { return("{" + sz + "}");}
function sqre(sz)  { return("[" + sz + "]");}
function nada() { var x = 0; }
function cookieIsOn(cookie)  { return( (getCookie(cookie) == "On"  ) ); }
function cookieIsOff(cookie) { return( (getCookie(cookie) == "Off" ) ); }
function isOnOff(s) {
     var bRet = false;
     if (s.length == 2) 
          if ( ((s[0]=="Off") && (s[1]=="On")) || ((s[1]=="Off") && (s[0]=="On"))  ) bRet = true; 
     return(bRet);
}
function cryEncode(sz) {
     var radix = 28;
     var q=Math.floor((Math.random() * 100) + 492);
     var r="";
     var n=0;
     var k=0;
     var z = q.toString(radix) + "";
     // z = z + Math.floor((Math.random() * 100) + 492).toString(radix) + "";
     // z = z + Math.floor((Math.random() * 100) + 492).toString(radix);
     for(n=0;n<sz.length;n++) {
          r=sz.charCodeAt(n);
          k=r+q;
          z = z + "" + k.toString(radix);
     }
     return(z);
}
function undies(o, szIn) {
     var sz = szIn + o;
     if( typeof o === 'undefined' || o === null || (o.length == 0) ) sz = "";
     return(sz);
}
function serviceUrl2(e,op,q,n,r,p,h,o,f) {
     var uq = undies(q,"&qual=");
     var un = undies(n,"&node=");
     var ur = undies(r,"&loc=");
     var urr = undies(r,"&reg=");
     var up = undies(p,"&period=");
     var uh = undies(h,"&hours=");
     var uo = undies(o,"&offset=");
     var uf = undies(f,"&filter=");
     var y0 = undies(getCCry("AK1",""),"&y0=");
     var y1 = undies(getCCry("SK1",""),"&y1=");
     // var sz = "p1?env="+e+"&op="+op+uq+un+ur+urr+uf+up+uh+uo+y0+y1;
     var sz = "p1?env="+e+"&op="+op+uq+un+ur+uf+up+uh+uo;
     var le = undies(sz.length,"&le=");
     sz = sz + le;
     var szURL = "<a href='" + sz + "'>"+ sz + "</a>";
     $("#tail_area").empty().append(szURL);
     return(sz);
}
function serviceUrl3(e,op,q,n,name,r,p,h,o,iv1,iv2) {
     var uq = undies(q,"&qual=");
     var un = undies(n,"&node=");
     var nm = undies(name,"&name=");
     var ur = undies(r,"&loc=");
     var up = undies(p,"&period=");
     var uh = undies(h,"&hours=");
     var uo = undies(o,"&offset=");
     var v1 = undies(iv1,"&v1=");
     var v2 = undies(iv2,"&v2=");
     var cry = undies(getCCry("ACN1",""),"&cry=");
     var sz = "p1?env="+e+"&op="+op+uq+un+nm+ur+up+uh+uo+v1+v2+cry;
     var szURL = "<a href='" + sz + "'>"+ sz + "</a>";
     $("#tail_area").empty().append(szURL);
     return(sz);
}
function serviceUrl(e,op,q,n,r,p,h,o) {
     var uq = undies(q,"&qual=");
     var un = undies(n,"&node=");
     var ur = undies(r,"&loc=");
     var up = undies(p,"&period=");
     var uh = undies(h,"&hours=");
     var uo = undies(o,"&offset=");
     var cry = undies(getCCry("ACN1",""),"&cry=");
     var sz = "p1?env="+e+"&op="+op+uq+un+ur+up+uh+uo+cry;
     var szURL = "<a href='" + sz + "'>"+ sz + "</a>";
     $("#tail_area").empty().append(szURL);
     return(sz);
}

function trable2by1(g1,g2) {
    var sz = "<table class='trable' border=0 width='100%' CELLSPACING=0 CELLPADDING=0><tr id='" + g1 + "'></tr><tr id='" + g2 + "'></tr></table>";
    return(sz);
}
function table2by1(g1,g2) {
    var tguid = "";
    var sz = "<table border=0 width='100%' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr>";
    sz = sz + "<td id='" + g1 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g2 + "'></td>";
    sz = sz + "</tr></table>";
    return(sz);
}
function table3by1(g1,g2,g3) {
    var tguid = "";
    var sz = "<table border=0 width='100%' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr>";
    sz = sz + "<td id='" + g1 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g2 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g3 + "'></td>";
    sz = sz + "</tr></table>";
    return(sz);
}
function table4by1(w,g1,g2,g3,g4) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr>";
    sz = sz + "<td id='" + g1 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g2 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g3 + "'></td>";
    sz = sz + "</tr><tr>";
    sz = sz + "<td id='" + g4 + "'></td>";
    sz = sz + "</tr></table>";
    return(sz);
}
function table1by1withheaders(w,g1,g1h) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr><th align='right' id='" + g1h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g1 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table4by1withheadersb(w,g1,g2,g3,g4,g1h,g2h,g3h,g4h) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=6>"
    sz = sz + "<tr><th align='middle' id='" + g1h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g1 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g2h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g2 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g3h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g3 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g4h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g4 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table4by1withheaders(w,g1,g2,g3,g4,g1h,g2h,g3h,g4h) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr><th align='middle' id='" + g1h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g1 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g2h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g2 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g3h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g3 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' id='" + g4h + "'></th></tr>";
    sz = sz + "<tr><td id='" + g4 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function fulltable(g1) {
    var sz = "<center><table align='middle' valign='middle' border=0 CELLSPACING=0 CELLPADDING=5><tr>"
    sz = sz + "<td align='middle' valign='middle' id='" + g1 + "'>XXX</td></tr></table></center>";
    return(sz);
}
function table1by1b(w,g1) {
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=12><tr><td width='100%' id='" + g1 + "'></td></tr></table>";
    return(sz);
}
function table1by1(w,g1) {
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=12><tr><td width='100%' id='" + g1 + "'></td></tr></table>";
    return(sz);
}
function table1by2b(w,g1,g2) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=12>"
    sz = sz + "<tr><td width='50%' id='" + g1 + "'></td><td width='50%' id='" + g2 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table1by2(w,g1,g2) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=12>"
    sz = sz + "<tr><td width='50%' id='" + g1 + "'></td><td width='50%' id='" + g2 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table2by2(w,g1,g2,g3,g4) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr><td width='50%' id='" + g1 + "'></td><td id='" + g2 + "'></td></tr>";
    sz = sz + "<tr><td width='50%' id='" + g3 + "'></td><td id='" + g4 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table2by2withheadersb(w,g1,g2,g3,g4,g1h,g2h,g3h,g4h) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr><th align='middle' width='50%' id='" + g1h + "'></th><th align='middle' id='" + g2h + "'></th></tr>";
    sz = sz + "<tr><td width='50%' id='" + g1 + "'></td><td id='"  + g2 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' width='50%' id='" + g3h + "'></th><th align='middle' id='" + g4h + "'></th></tr>";
    sz = sz + "<tr><td width='50%' id='" + g3 + "'></td><td id='"  + g4 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function table2by2withheaders(w,g1,g2,g3,g4,g1h,g2h,g3h,g4h) {
    var tguid = "";
    var sz = "<table border=0 width='" +w+ "' CELLSPACING=0 CELLPADDING=0>"
    sz = sz + "<tr><th align='middle' width='50%' id='" + g1h + "'></th><th align='middle' id='" + g2h + "'></th></tr>";
    sz = sz + "<tr><td width='50%' id='" + g1 + "'></td><td id='"  + g2 + "'></td></tr>";
    sz = sz + "<tr><th align='middle' width='50%' id='" + g3h + "'></th><th align='middle' id='" + g4h + "'></th></tr>";
    sz = sz + "<tr><td width='50%' id='" + g3 + "'></td><td id='"  + g4 + "'></td></tr>";
    sz = sz + "</table>";
    return(sz);
}
function tableWXQ(n,x) {
    var i = 0;
    var guid = "";
    var tguid = "";
    var w  =  $("#client_area").innerWidth / n;
    tguid = randomStr();
    var sz = "<center><table id='" + tguid + "' CELLSPACING=0 CELLPADDING=0><tr>"
    for (i=0;i<x;i++) {
        guid = randomStr();
        pushQueue(guid);
        sz = sz + "<td id='" + guid + "'></td>";
    }
    sz = sz + "</tr>";
    sz = sz + "</table></center>";
    return(sz);
}
function tableWX(n,x) {
    var i = 0;
    var guid = "";
    var tguid = "";
    var w  =  $("#client_area").innerWidth / n;
    tguid = randomStr();
    // var sz = "<table CELLSPACING=0 CELLPADDING=0 width='" +w+ "'>"
    var sz = "<center><table id='" + tguid + "' CELLSPACING=0 CELLPADDING=0><tr>"
    for (i=0;i<x;i++) {
        guid = randomStr();
        returnstack.push(guid)
        sz = sz + "<td id='" + guid + "'></td>";
    }
    sz = sz + "</tr>";
    sz = sz + "</table></center>";
    returnstack.push(tguid)
    return(sz);
}
function tableBy(n) {
    var w  =  $("#client_area").innerWidth / n;
    var h  =  $("#client_area").innerHeight() / n;
    var g1 = randomStr();
    var g2 = randomStr();
    returnstack.push(g1)
    returnstack.push(g2)
    h=550;
    var sz = "<table width='" +w+ "'><tr><td valign=top height='" +h+ "' id='" + g1 + "'></td>";
    sz = sz + "<td>&nbsp;&nbsp;&nbsp;</td>";
    sz = sz + "<td valign=top id='" + g2 + "'></td></tr></table>";
    return(sz);
}
function tuple7(op1,op2,op3,op4,op5,op6,op7,op8) { 
         var c=","; var js = dq(op1) +c+ dq(op2) +c+ 
                             dq(op3) +c+ dq(op4) +c+ dq(op5) +c+ dq(op6) +c+ dq(op7) +c+ dq(op8);
         return(js); 
}
function jsfunc7(name,op1,op2,op3,op4,op5,op6,op7,label) {
     var js = "<A href='javascript:" + name + 
              paren(tuple7(op1,op2,op3,op4,op5,op6,op7,label)) + ";'>" + label + "</A>";
     return(js);
}

  function mapYAxisLabel(sz) {
     var szRet = "MegaBytes";;
     switch (sz.toUpperCase()) {
               case "CPUUTILIZATION":
               case "CPU":
                   szRet= "Percent";
                   break;
     }
    return (szRet);
  }
  function mapChartType(sz) {
     var szRet = sz;
     switch (sz.toUpperCase()) {
               case "COLUMN":
               case "COL":
                   szRet= "Column";
                   break;
               case "LINE":
                   szRet= "Line";
                   break;
               case "SCATTER":
               case "SCAT":
               case "SCA":
               case "SCT":
                   szRet= "Scatter";
                   break;
     }
    return (szRet);
  }
  function mapSpecialCode(sz) {
     var szRet = sz;
     switch (sz) {
               case "nin":
                   szRet= "netin";
                   break;
               case "nut":
                   szRet= "netout";
                   break;
               case "drb":
                   szRet= "diskreadbytes";
                   break;
               case "dwb":
                   szRet= "diskwritebytes";
                   break;
               case "dro":
                   szRet= "diskreadops";
                   break;
               case "dwb":
                   szRet= "diskwriteops";
                   break;
     }
    return (szRet);
  }
  function mapRegionCodesToNames(sz) {
     var szRet = "";
     switch (sz) {
               case "E1":
                   szRet= "US EAST 1";
                   break;
               case "W1":
                   szRet="US WEST 1 Ca";
                   break;
               case "W2":
                   szRet="US WEST 2";
                   break;
               case "A1":
                   szRet="AP NORTHEAST 1";
                   break;
               case "A2":
                   szRet="AP SOUTHEAST 1";
                   break;
               case "A3":
                   szRet="AP SOUTHEST 2";
                   break;
               case "C1":
                   szRet="CN NORTH 1";
                   break;
               case "U1":
                   szRet="EU CENTRAL 1";
                   break;
               case "U2":
                   szRet="EU WEST 1";
                   break;
               case "S1":
                   szRet="SA EAST 1";
                   break;
     }
    return (szRet);
    }

function addZero(i) { if (i < 10) { i = "0" + i; } return i; }
function myDateTimeFunction() {
    var d  = new Date();
    var MM = addZero(d.getMonth()+1);
    var DD = addZero(d.getDate());
    var YY = addZero(d.getFullYear());
    var h  = addZero(d.getHours());
    var m  = addZero(d.getMinutes());
    var s  = addZero(d.getSeconds());
    var o  = addZero(d.getTimezoneOffset()/60);
    return (MM + "/" + DD + "/" + YY + " @ " + h + ":" + m + ":" + s + " (offset " + o + ")" );
    //return (MM + "/" + DD + "/" + YY + " @ " + h + ":" + m + ":" + s );
    //return (MM + "/" + DD + "/" + YY );
}


var setCookieConstant = 24*60*60*1000;
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*setCookieConstant));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function testJSON(sz) {
     var b = true;
     try{
          var obj = JSON.parse(sz);
     } catch(e){
        b = false;
        alert(e);
     }
     return(b)
} 
function getJSONOBJCookie(cname) {
     var sz = getCookieImpl(cname);
     if( typeof sz === 'undefined' || sz === null ) sz = "{}";
     try{
          var obj = JSON.parse(unescape(sz));
     } catch(e){
        alert(e); //error in the above string(in this case,yes)!
        alert(sz);
     }
     return(obj)
} 
function getCookie(cname) {
     var sz = getCookieImpl(cname);
     if( typeof sz === 'undefined' || sz === null ) sz = "";
     return(sz)
} 
function getCookieImpl(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function getCookieDefault(cname,d) {
    var sz = getCookie(cname);
    if ( sz == "") sz = d; 
    return sz;
}
function getC(cname,d) { return getCookieDefault(cname,d); } 
function getCCry(cname,d) { return cryEncode(getCookieDefault(cname,d)); } 

function openSettingsVBar(guid) {
     var g1 = randomStr();
     var sz = "<table cellpadding=0 cellspacing=0 id='"+g1+"'>";
     $("#"+guid).append(sz);
     return(g1);
}
function closeSettingsVBar(guid) {
     var sz = "</table>";
     $("#"+guid).append(sz);
     return(guid);
}
function addSettingsVElement$($guid) {
     var g1 = randomStr();
     $guid.append("<tr><td id='"+g1+"' align='middle'></td></tr>");
     return(g1);
}
function addSettingsVElement(guid) {
     var g1 = randomStr();
     $("#"+guid).append("<tr><td id='"+g1+"' align='middle'></td></tr>");
     return(g1);
}
function openSettingsBar100(guid) {
     var g1 = randomStr();
     var sz = "<table border=0 cellpadding=0 cellspacing=0><tr id='"+g1+"'>";
     $("#"+guid).append(sz);
     return(g1);
}
function openSettingsBar(guid,title) {
     var g1 = randomStr();
     var sz = "<table border=0 cellpadding=0 cellspacing=0><tr id='" +g1+ "'>";
     $("#"+guid).append(sz);
     return(g1);
}
function closeSettingsBar(guid) {
     var sz = "</tr></table>";
     $("#"+guid).append(sz);
     return(guid);
}
function addSettingsElement(guid) {
     var g1 = randomStr();
     $("#"+guid).append("<td id='"+g1+"' align='middle'></td>");
     return(g1);
}

function sAnchor(url,label) {
     return("<A target='_blank' href='" +url+ "'>" +label+ "</A>");
}
function simpleAnchor(url,label) {
     return("<A target='_blank' href='" +url+ "'>" +label+ "</A>");
}
function appendAnchor(sel,url,label) {
     $("#"+sel).append("<A target='_blank' href='" +url+ "'>" +label+ "</A>");
}
function appendAnchorWithGuid(sel,cls,prefix) {
     var guid = randomStr();
     $(sel).append(prefix + "<A class='" + cls + "' id='" +guid + "'></A>");
     return(guid);
}

function appendDivWithGuid(sel) {
     var guid = randomStr();
     $(sel).append("<div id='"+guid+"'></div>");
     return(guid);
}
