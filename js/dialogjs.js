function doDialogModeless($sel, sel) {
        $sel.dialog({
            modal: false,
            width:  Math.floor(screen.width/4),
            height: 500,
            buttons: {
                 Close: function() {
                      $( this ).dialog( "close" );
                 }
            }
        });
}
function doDialogModal($sel) {
        $sel.dialog({
            modal: true,
            buttons: {
                 Ok: function() {
                      $( this ).dialog( "close" );
                 }
            }
        });
}
function quickDialogModal(title,body) {
        var guid = randomStr();
        var sz = "<div id='"+guid+"' title='"+title+"'>"+body+"</div>";
        $("#client_area").append(sz);
        var $sel = $("#"+guid);
        $sel.dialog({
            modal: true,
            buttons: {
                 Ok: function() {
                      $( this ).dialog( "close" );
                 }
            }
        });
}
function quickDialog(title,body) {
        var guid = randomStr();
        var sz = "<div id='"+guid+"' title='"+title+"'>"+body+"</div>";
        $("#client_area").append(sz);
        var $sel = $("#"+guid);
        $sel.dialog({
            autoOpen: false,  
        });
        $sel.dialog( "open" );
}
function instancePopup(node,env,reg) {
     var h = getCookieDefault("DHRS",24);
     var p = getCookieDefault("PER",60);
     var m = getCookieDefault("DMOD","sts")
     var o = getCookieDefault("OSET",0);
     var t = "";
     var url = serviceUrl2(env,"inventoryminus","","",reg,p,h,"",node);
     var guid  = randomStr();
     var guid1  = randomStr();
     var guid2  = randomStr();
     var $ca = $("#work_area");
     $ca.append("<TABLE cellspacing=0 cellpadding=0 border=1 width='100%' id='"+guid+"'><TR><TD height=160 width='100%' id='"+guid1+"'></TD></TR><TR><TD width='100%' id='"+guid2+"'></TD></TR></TABLE>");
if ( 1 == 0 ) {
     $("#"+guid).css({ 'background-color': '#dfe3ee' });
     $("#"+guid).css({ 'padding': '0' });
     $("#"+guid).css({ 'margin': '0' });
     doVableChart(url,guid2,"Instance List",-1);
}
     url = "p1?env=" + env + "&op=" +m+ "&qual=cpu&node=" +node+ "&loc=" +reg+"&period="+p+"&hours="+h+"&offset=" +o;
     t = chartjsTitleLong("cpu",h,node,"","",h,p,o);
     snapPerf("POPUP_CPU",guid1,url,"","","","",t);
if ( 1 == 0 ) {
     $("#"+guid).dialog({
            modal: false,
            width:  Math.floor(screen.width/3),
            height: 500,
            buttons: {
                 Close: function() {
                      $( this ).dialog( "close" );
                 }
            }
        });
}
}

