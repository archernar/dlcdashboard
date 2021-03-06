var options = {
             message_count: 16,
             message_size: 16,
             message_multiplier: 1,
             watchq1: "",
             watchq2: "",
             watchq3: "",
             watchq4: "",
             watchq5: "",
             ttt: "ttt the initial value",
             qqtarn: "",
             msgsz: 1024,
             msgct: 1,
             refresh: 1000,
             filter0: "not set",
             filter1: "not set",
             filter2: "not set",
             filter3: "not set",
             acc1: "", acn1: "", ak1: "", sk1: "",
             acc2: "", acn2: "", ak2: "", sk2: "",
             acc3: "", acn3: "", ak3: "", sk3: "",
             acc4: "", acn4: "", ak4: "", sk4: "",
             acc5: "", acn5: "", ak5: "", sk5: "",
             acc6: "", acn6: "", ak6: "", sk6: "",
             series: {
                  0: { lineWidth: 1 },
                  1: { lineWidth: 1 },
                  2: { lineWidth: 1 },
                  3: { lineWidth: 1 },
                  4: { lineWidth: 1 },
                  5: { lineWidth: 1 }
             },
             colors: ['black', 'blue', 'red', 'green', 'yellow', 'gray'],
             fontSize: 8,
             width:  530,
             basewidth:  530,
             height: 160,
             baseheight: 160,
             chartArea: {left: 65, top:30, width: 430, height: 75, basewidth: 430, baseheight: 75, backgroundColor: "White" }, 
             allowHtml : true, 
             backgroundColor: "#dfe3ee",
             legend : {position: "in", textStyle: {color: "Black", fontSize: 9}},
             titleTextStyle: { color: "Black",  fontName: "arial", fontSize: 12, bold: "True", italic: "False" },
             vAxis:  { gridlines:      { color: "#D0D0D0",   count: 6},
                       textStyle:      { color: "Black",  fontName: "arial", fontSize: 10, bold: "False", italic: "False" },
                       titleTextStyle: { color: "Black",  fontName: "arial", fontSize: 12, bold: "True", italic: "False" }
                     },
             hAxis:  { title: "timethis",
                       format: 'MM/dd HH:mm',
                       gridlines:      { color: "#D0D0D0", count: -1 },
                       textStyle:      { color: "Black",  fontName: "arial", fontSize: 10, bold: "False", italic: "False" },
                       titleTextStyle: { color: "Black",  fontName: "arial", fontSize: 12, bold: "True", italic: "False" }
                     }
            };
           var firth = {
             filter: {
                  0: { sz:"str",nm:"name",cfg:"cfg" },
                  1: { sz:"str",nm:"name",cfg:"cfg" },
                  2: { sz:"str",nm:"name",cfg:"cfg" },
                  3: { sz:"str",nm:"name",cfg:"cfg" }
             },
             desc: "AA set",
             link: "https://developers.google.com/chart/interactive/docs/lines",
             pointsDocumentationLink: "https://developers.google.com/chart/interactive/docs/points",
             linesDocumentationLink: "https://developers.google.com/chart/interactive/docs/lines",
             xxxpointSize: 4,
             xxxpointShape: { type: 'star', sides: 4 }
};
