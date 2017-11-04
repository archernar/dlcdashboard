/*
 * 
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.5b
 * @requires jQuery v1.2.3
 * 
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
/**
 * 
 * @description Create a sortable table with multi-column sorting capabilitys
 * 
 * @example $('table').tablesorter();
 * @desc Create a simple tablesorter interface.
 * 
 * @example $('table').tablesorter({ sortList:[[0,0],[1,0]] });
 * @desc Create a tablesorter interface and sort on the first and secound column column headers.
 * 
 * @example $('table').tablesorter({ headers: { 0: { sorter: false}, 1: {sorter: false} } });
 *          
 * @desc Create a tablesorter interface and disableing the first and second  column headers.
 *      
 * 
 * @example $('table').tablesorter({ headers: { 0: {sorter:"integer"}, 1: {sorter:"currency"} } });
 * 
 * @desc Create a tablesorter interface and set a column parser for the first
 *       and second column.
 * 
 * 
 * @param Object
 *            settings An object literal containing key/value pairs to provide
 *            optional settings.
 * 
 * 
 * @option String cssHeader (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead of the table. Default value:
 *         "header"
 * 
 * @option String cssAsc (optional) A string of the class name to be appended to
 *         sortable tr elements in the thead on a ascending sort. Default value:
 *         "headerSortUp"
 * 
 * @option String cssDesc (optional) A string of the class name to be appended
 *         to sortable tr elements in the thead on a descending sort. Default
 *         value: "headerSortDown"
 * 
 * @option String sortInitialOrder (optional) A string of the inital sorting
 *         order can be asc or desc. Default value: "asc"
 * 
 * @option String sortMultisortKey (optional) A string of the multi-column sort
 *         key. Default value: "shiftKey"
 * 
 * @option String textExtraction (optional) A string of the text-extraction
 *         method to use. For complex html structures inside td cell set this
 *         option to "complex", on large tables the complex option can be slow.
 *         Default value: "simple"
 * 
 * @option Object headers (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortList (optional) An array containing the forces sorting
 *         rules. This option let's you specify a default sorting rule. Default
 *         value: null
 * 
 * @option Array sortForce (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         prepended to user-selected rules. Default value: null
 * 
 * @option Boolean sortLocaleCompare (optional) Boolean flag indicating whatever
 *         to use String.localeCampare method or not. Default set to true.
 * 
 * 
 * @option Array sortAppend (optional) An array containing forced sorting rules.
 *         This option let's you specify a default sorting rule, which is
 *         appended to user-selected rules. Default value: null
 * 
 * @option Boolean widthFixed (optional) Boolean flag indicating if tablesorter
 *         should apply fixed widths to the table columns. This is usefull when
 *         using the pager companion plugin. This options requires the dimension
 *         jquery plugin. Default value: false
 * 
 * @option Boolean cancelSelection (optional) Boolean flag indicating if
 *         tablesorter should cancel selection of the table headers text.
 *         Default value: true
 * 
 * @option Boolean debug (optional) Boolean flag indicating if tablesorter
 *         should display debuging information usefull for development.
 * 
 * @type jQuery
 * 
 * @name tablesorter
 * 
 * @cat Plugins/Tablesorter
 * 
 * @author Christian Bach/christian.bach@polyester.se
 */

(function ($) {
    $.extend({
        tablesorter: new
        function () {

            var parsers = [],
                widgets = [];

            this.defaults = {
                cssHeader: "header",
                cssAsc: "headerSortUp",
                cssDesc: "headerSortDown",
                cssChildRow: "expand-child",
                sortInitialOrder: "asc",
                sortMultiSortKey: "shiftKey",
                sortForce: null,
                sortAppend: null,
                sortLocaleCompare: true,
                textExtraction: "simple",
                parsers: {}, widgets: [],
                widgetZebra: {
                    css: ["even", "odd"]
                }, headers: {}, widthFixed: false,
                cancelSelection: true,
                sortList: [],
                headerList: [],
                dateFormat: "us",
                decimal: '/\.|\,/g',
                onRenderHeader: null,
                selectorHeaders: 'thead th',
                debug: false
            };

            /* debuging utils */

            function benchmark(s, d) {
                log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
            }

            this.benchmark = benchmark;

            function log(s) {
                if (typeof console != "undefined" && typeof console.debug != "undefined") {
                    console.log(s);
                } else {
                    alert(s);
                }
            }

            /* parsers utils */

            function buildParserCache(table, $headers) {

                if (table.config.debug) {
                    var parsersDebug = "";
                }

                if (table.tBodies.length == 0) return; // In the case of empty tables
                var rows = table.tBodies[0].rows;

                if (rows[0]) {

                    var list = [],
                        cells = rows[0].cells,
                        l = cells.length;

                    for (var i = 0; i < l; i++) {

                        var p = false;

                        if ($.metadata && ($($headers[i]).metadata() && $($headers[i]).metadata().sorter)) {

                            p = getParserById($($headers[i]).metadata().sorter);

                        } else if ((table.config.headers[i] && table.config.headers[i].sorter)) {

                            p = getParserById(table.config.headers[i].sorter);
                        }
                        if (!p) {

                            p = detectParserForColumn(table, rows, -1, i);
                        }

                        if (table.config.debug) {
                            parsersDebug += "column:" + i + " parser:" + p.id + "\n";
                        }

                        list.push(p);
                    }
                }

                if (table.config.debug) {
                    log(parsersDebug);
                }

                return list;
            };

            function detectParserForColumn(table, rows, rowIndex, cellIndex) {
                var l = parsers.length,
                    node = false,
                    nodeValue = false,
                    keepLooking = true;
                while (nodeValue == '' && keepLooking) {
                    rowIndex++;
                    if (rows[rowIndex]) {
                        node = getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex);
                        nodeValue = trimAndGetNodeText(table.config, node);
                        if (table.config.debug) {
                            log('Checking if value was empty on row:' + rowIndex);
                        }
                    } else {
                        keepLooking = false;
                    }
                }
                for (var i = 1; i < l; i++) {
                    if (parsers[i].is(nodeValue, table, node)) {
                        return parsers[i];
                    }
                }
                // 0 is always the generic parser (text)
                return parsers[0];
            }

            function getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex) {
                return rows[rowIndex].cells[cellIndex];
            }

            function trimAndGetNodeText(config, node) {
                return $.trim(getElementText(config, node));
            }

            function getParserById(name) {
                var l = parsers.length;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == name.toLowerCase()) {
                        return parsers[i];
                    }
                }
                return false;
            }

            /* utils */

            function buildCache(table) {

                if (table.config.debug) {
                    var cacheTime = new Date();
                }

                var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0,
                    totalCells = (table.tBodies[0].rows[0] && table.tBodies[0].rows[0].cells.length) || 0,
                    parsers = table.config.parsers,
                    cache = {
                        row: [],
                        normalized: []
                    };

                for (var i = 0; i < totalRows; ++i) {

                    /** Add the table data to main data array */
                    var c = $(table.tBodies[0].rows[i]),
                        cols = [];

                    // if this is a child row, add it to the last row's children and
                    // continue to the next row
                    if (c.hasClass(table.config.cssChildRow)) {
                        cache.row[cache.row.length - 1] = cache.row[cache.row.length - 1].add(c);
                        // go to the next for loop
                        continue;
                    }

                    cache.row.push(c);

                    for (var j = 0; j < totalCells; ++j) {
                        cols.push(parsers[j].format(getElementText(table.config, c[0].cells[j]), table, c[0].cells[j]));
                    }

                    cols.push(cache.normalized.length); // add position for rowCache
                    cache.normalized.push(cols);
                    cols = null;
                };

                if (table.config.debug) {
                    benchmark("Building cache for " + totalRows + " rows:", cacheTime);
                }

                return cache;
            };

            function getElementText(config, node) {
            	
                if (!node) return "";
                
		        var $node = $(node),
		            data = $node.attr('data-sort-value');
		        if (data !== undefined) return data;

                var text = "";

                if (!config.supportsTextContent) config.supportsTextContent = node.textContent || false;

                if (config.textExtraction == "simple") {
                    if (config.supportsTextContent) {
                        text = node.textContent;
                    } else {
                        if (node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
                            text = node.childNodes[0].innerHTML;
                        } else {
                            text = node.innerHTML;
                        }
                    }
                } else {
                    if (typeof(config.textExtraction) == "function") {
                        text = config.textExtraction(node);
                    } else {
                        text = $(node).text();
                    }
                }
                return text;
            }

            function appendToTable(table, cache) {

                if (table.config.debug) {
                    var appendTime = new Date()
                }

                var c = cache,
                    r = c.row,
                    n = c.normalized,
                    totalRows = n.length,
                    checkCell = (n[0].length - 1),
                    tableBody = $(table.tBodies[0]),
                    rows = [];


                for (var i = 0; i < totalRows; i++) {
                    var pos = n[i][checkCell];

                    rows.push(r[pos]);

                    if (!table.config.appender) {

                        //var o = ;
                        var l = r[pos].length;
                        for (var j = 0; j < l; j++) {
                            tableBody[0].appendChild(r[pos][j]);
                        }

                        // 
                    }
                }



                if (table.config.appender) {

                    table.config.appender(table, rows);
                }

                rows = null;

                if (table.config.debug) {
                    benchmark("Rebuilt table:", appendTime);
                }

                // apply table widgets
                applyWidget(table);

                // trigger sortend
                setTimeout(function () {
                    $(table).trigger("sortEnd");
                }, 0);

            };

            function buildHeaders(table) {

                if (table.config.debug) {
                    var time = new Date();
                }

                var meta = ($.metadata) ? true : false;
                
                var header_index = computeTableHeaderCellIndexes(table);

                var $tableHeaders = $(table.config.selectorHeaders, table).each(function (index) {

                    this.column = header_index[this.parentNode.rowIndex + "-" + this.cellIndex];
                    // this.column = index;
                    this.order = formatSortingOrder(table.config.sortInitialOrder);
                    
					
					this.count = this.order;

                    if (checkHeaderMetadata(this) || checkHeaderOptions(table, index)) this.sortDisabled = true;
					if (checkHeaderOptionsSortingLocked(table, index)) this.order = this.lockedOrder = checkHeaderOptionsSortingLocked(table, index);

                    if (!this.sortDisabled) {
                        var $th = $(this).addClass(table.config.cssHeader);
                        if (table.config.onRenderHeader) table.config.onRenderHeader.apply($th);
                    }

                    // add cell to headerList
                    table.config.headerList[index] = this;
                });

                if (table.config.debug) {
                    benchmark("Built headers:", time);
                    log($tableHeaders);
                }

                return $tableHeaders;

            };

            // from:
            // http://www.javascripttoolbox.com/lib/table/examples.php
            // http://www.javascripttoolbox.com/temp/table_cellindex.html


            function computeTableHeaderCellIndexes(t) {
                var matrix = [];
                var lookup = {};
                var thead = t.getElementsByTagName('THEAD')[0];
                var trs = thead.getElementsByTagName('TR');

                for (var i = 0; i < trs.length; i++) {
                    var cells = trs[i].cells;
                    for (var j = 0; j < cells.length; j++) {
                        var c = cells[j];

                        var rowIndex = c.parentNode.rowIndex;
                        var cellId = rowIndex + "-" + c.cellIndex;
                        var rowSpan = c.rowSpan || 1;
                        var colSpan = c.colSpan || 1
                        var firstAvailCol;
                        if (typeof(matrix[rowIndex]) == "undefined") {
                            matrix[rowIndex] = [];
                        }
                        // Find first available column in the first row
                        for (var k = 0; k < matrix[rowIndex].length + 1; k++) {
                            if (typeof(matrix[rowIndex][k]) == "undefined") {
                                firstAvailCol = k;
                                break;
                            }
                        }
                        lookup[cellId] = firstAvailCol;
                        for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
                            if (typeof(matrix[k]) == "undefined") {
                                matrix[k] = [];
                            }
                            var matrixrow = matrix[k];
                            for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                                matrixrow[l] = "x";
                            }
                        }
                    }
                }
                return lookup;
            }

            function checkCellColSpan(table, rows, row) {
                var arr = [],
                    r = table.tHead.rows,
                    c = r[row].cells;

                for (var i = 0; i < c.length; i++) {
                    var cell = c[i];

                    if (cell.colSpan > 1) {
                        arr = arr.concat(checkCellColSpan(table, headerArr, row++));
                    } else {
                        if (table.tHead.length == 1 || (cell.rowSpan > 1 || !r[row + 1])) {
                            arr.push(cell);
                        }
                        // headerArr[row] = (i+row);
                    }
                }
                return arr;
            };

            function checkHeaderMetadata(cell) {
                if (($.metadata) && ($(cell).metadata().sorter === false)) {
                    return true;
                };
                return false;
            }

            function checkHeaderOptions(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].sorter === false)) {
                    return true;
                };
                return false;
            }
			
			 function checkHeaderOptionsSortingLocked(table, i) {
                if ((table.config.headers[i]) && (table.config.headers[i].lockedOrder)) return table.config.headers[i].lockedOrder;
                return false;
            }
			
            function applyWidget(table) {
                var c = table.config.widgets;
                var l = c.length;
                for (var i = 0; i < l; i++) {

                    getWidgetById(c[i]).format(table);
                }

            }

            function getWidgetById(name) {
                var l = widgets.length;
                for (var i = 0; i < l; i++) {
                    if (widgets[i].id.toLowerCase() == name.toLowerCase()) {
                        return widgets[i];
                    }
                }
            };

            function formatSortingOrder(v) {
                if (typeof(v) != "Number") {
                    return (v.toLowerCase() == "desc") ? 1 : 0;
                } else {
                    return (v == 1) ? 1 : 0;
                }
            }

            function isValueInArray(v, a) {
                var l = a.length;
                for (var i = 0; i < l; i++) {
                    if (a[i][0] == v) {
                        return true;
                    }
                }
                return false;
            }

            function setHeadersCss(table, $headers, list, css) {
                // remove all header information
                $headers.removeClass(css[0]).removeClass(css[1]);

                var h = [];
                $headers.each(function (offset) {
                    if (!this.sortDisabled) {
                        h[this.column] = $(this);
                    }
                });

                var l = list.length;
                for (var i = 0; i < l; i++) {
                    h[list[i][0]].addClass(css[list[i][1]]);
                }
            }

            function fixColumnWidth(table, $headers) {
                var c = table.config;
                if (c.widthFixed) {
                    var colgroup = $('<colgroup>');
                    $("tr:first td", table.tBodies[0]).each(function () {
                        colgroup.append($('<col>').css('width', $(this).width()));
                    });
                    $(table).prepend(colgroup);
                };
            }

            function updateHeaderSortCount(table, sortList) {
                var c = table.config,
                    l = sortList.length;
                for (var i = 0; i < l; i++) {
                    var s = sortList[i],
                        o = c.headerList[s[0]];
                    o.count = s[1];
                    o.count++;
                }
            }

            /* sorting methods */
            
            var sortWrapper;

            function multisort(table, sortList, cache) {

                if (table.config.debug) {
                    var sortTime = new Date();
                }

                var dynamicExp = "sortWrapper = function(a,b) {",
                    l = sortList.length;

                // TODO: inline functions.
                for (var i = 0; i < l; i++) {

                    var c = sortList[i][0];
                    var order = sortList[i][1];
                    // var s = (getCachedSortType(table.config.parsers,c) == "text") ?
                    // ((order == 0) ? "sortText" : "sortTextDesc") : ((order == 0) ?
                    // "sortNumeric" : "sortNumericDesc");
                    // var s = (table.config.parsers[c].type == "text") ? ((order == 0)
                    // ? makeSortText(c) : makeSortTextDesc(c)) : ((order == 0) ?
                    // makeSortNumeric(c) : makeSortNumericDesc(c));
                    var s = (table.config.parsers[c].type == "text") ? ((order == 0) ? makeSortFunction("text", "asc", c) : makeSortFunction("text", "desc", c)) : ((order == 0) ? makeSortFunction("numeric", "asc", c) : makeSortFunction("numeric", "desc", c));
                    var e = "e" + i;

                    dynamicExp += "var " + e + " = " + s; // + "(a[" + c + "],b[" + c
                    // + "]); ";
                    dynamicExp += "if(" + e + ") { return " + e + "; } ";
                    dynamicExp += "else { ";

                }

                // if value is the same keep orignal order
                var orgOrderCol = cache.normalized[0].length - 1;
                dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol + "];";

                for (var i = 0; i < l; i++) {
                    dynamicExp += "}; ";
                }

                dynamicExp += "return 0; ";
                dynamicExp += "}; ";

                if (table.config.debug) {
                    benchmark("Evaling expression:" + dynamicExp, new Date());
                }

                eval(dynamicExp);

                cache.normalized.sort(sortWrapper);

                if (table.config.debug) {
                    benchmark("Sorting on " + sortList.toString() + " and dir " + order + " time:", sortTime);
                }

                return cache;
            };

            function makeSortFunction(type, direction, index) {
                var a = "a[" + index + "]",
                    b = "b[" + index + "]";
                if (type == 'text' && direction == 'asc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + a + " < " + b + ") ? -1 : 1 )));";
                } else if (type == 'text' && direction == 'desc') {
                    return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + b + " < " + a + ") ? -1 : 1 )));";
                } else if (type == 'numeric' && direction == 'asc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + a + " - " + b + "));";
                } else if (type == 'numeric' && direction == 'desc') {
                    return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + b + " - " + a + "));";
                }
            };

            function makeSortText(i) {
                return "((a[" + i + "] < b[" + i + "]) ? -1 : ((a[" + i + "] > b[" + i + "]) ? 1 : 0));";
            };

            function makeSortTextDesc(i) {
                return "((b[" + i + "] < a[" + i + "]) ? -1 : ((b[" + i + "] > a[" + i + "]) ? 1 : 0));";
            };

            function makeSortNumeric(i) {
                return "a[" + i + "]-b[" + i + "];";
            };

            function makeSortNumericDesc(i) {
                return "b[" + i + "]-a[" + i + "];";
            };

            function sortText(a, b) {
                if (table.config.sortLocaleCompare) return a.localeCompare(b);
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            };

            function sortTextDesc(a, b) {
                if (table.config.sortLocaleCompare) return b.localeCompare(a);
                return ((b < a) ? -1 : ((b > a) ? 1 : 0));
            };

            function sortNumeric(a, b) {
                return a - b;
            };

            function sortNumericDesc(a, b) {
                return b - a;
            };

            function getCachedSortType(parsers, i) {
                return parsers[i].type;
            }; /* public methods */
            this.construct = function (settings) {
                return this.each(function () {
                    // if no thead or tbody quit.
                    if (!this.tHead || !this.tBodies) return;
                    // declare
                    var $this, $document, $headers, cache, config, shiftDown = 0,
                        sortOrder;
                    // new blank config object
                    this.config = {};
                    // merge and extend.
                    config = $.extend(this.config, $.tablesorter.defaults, settings);
                    // store common expression for speed
                    $this = $(this);
                    // save the settings where they read
                    $.data(this, "tablesorter", config);
                    // build headers
                    $headers = buildHeaders(this);
                    // try to auto detect column type, and store in tables config
                    this.config.parsers = buildParserCache(this, $headers);
                    // build the cache for the tbody cells
                    cache = buildCache(this);
                    // get the css class names, could be done else where.
                    var sortCSS = [config.cssDesc, config.cssAsc];
                    // fixate columns if the users supplies the fixedWidth option
                    fixColumnWidth(this);
                    // apply event handling to headers
                    // this is to big, perhaps break it out?
                    $headers.click(

                    function (e) {
                        var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[0].rows.length) || 0;
                        if (!this.sortDisabled && totalRows > 0) {
                            // Only call sortStart if sorting is
                            // enabled.
                            $this.trigger("sortStart");
                            // store exp, for speed
                            var $cell = $(this);
                            // get current column index
                            var i = this.column;
                            // get current column sort order
                            this.order = this.count++ % 2;
							// always sort on the locked order.
							if(this.lockedOrder) this.order = this.lockedOrder;
							
							// user only whants to sort on one
                            // column
                            if (!e[config.sortMultiSortKey]) {
                                // flush the sort list
                                config.sortList = [];
                                if (config.sortForce != null) {
                                    var a = config.sortForce;
                                    for (var j = 0; j < a.length; j++) {
                                        if (a[j][0] != i) {
                                            config.sortList.push(a[j]);
                                        }
                                    }
                                }
                                // add column to sort list
                                config.sortList.push([i, this.order]);
                                // multi column sorting
                            } else {
                                // the user has clicked on an all
                                // ready sortet column.
                                if (isValueInArray(i, config.sortList)) {
                                    // revers the sorting direction
                                    // for all tables.
                                    for (var j = 0; j < config.sortList.length; j++) {
                                        var s = config.sortList[j],
                                            o = config.headerList[s[0]];
                                        if (s[0] == i) {
                                            o.count = s[1];
                                            o.count++;
                                            s[1] = o.count % 2;
                                        }
                                    }
                                } else {
                                    // add column to sort list array
                                    config.sortList.push([i, this.order]);
                                }
                            };
                            setTimeout(function () {
                                // set css for headers
                                setHeadersCss($this[0], $headers, config.sortList, sortCSS);
                                appendToTable(
	                                $this[0], multisort(
	                                $this[0], config.sortList, cache)
								);
                            }, 1);
                            // stop normal event by returning false
                            return false;
                        }
                        // cancel selection
                    }).mousedown(function () {
                        if (config.cancelSelection) {
                            this.onselectstart = function () {
                                return false
                            };
                            return false;
                        }
                    });
                    // apply easy methods that trigger binded events
                    $this.bind("update", function () {
                        var me = this;
                        setTimeout(function () {
                            // rebuild parsers.
                            me.config.parsers = buildParserCache(
                            me, $headers);
                            // rebuild the cache map
                            cache = buildCache(me);
                        }, 1);
                    }).bind("updateCell", function (e, cell) {
                        var config = this.config;
                        // get position from the dom.
                        var pos = [(cell.parentNode.rowIndex - 1), cell.cellIndex];
                        // update cache
                        cache.normalized[pos[0]][pos[1]] = config.parsers[pos[1]].format(
                        getElementText(config, cell), cell);
                    }).bind("sorton", function (e, list) {
                        $(this).trigger("sortStart");
                        config.sortList = list;
                        // update and store the sortlist
                        var sortList = config.sortList;
                        // update header count index
                        updateHeaderSortCount(this, sortList);
                        // set css for headers
                        setHeadersCss(this, $headers, sortList, sortCSS);
                        // sort the table and append it to the dom
                        appendToTable(this, multisort(this, sortList, cache));
                    }).bind("appendCache", function () {
                        appendToTable(this, cache);
                    }).bind("applyWidgetId", function (e, id) {
                        getWidgetById(id).format(this);
                    }).bind("applyWidgets", function () {
                        // apply widgets
                        applyWidget(this);
                    });
                    if ($.metadata && ($(this).metadata() && $(this).metadata().sortlist)) {
                        config.sortList = $(this).metadata().sortlist;
                    }
                    // if user has supplied a sort list to constructor.
                    if (config.sortList.length > 0) {
                        $this.trigger("sorton", [config.sortList]);
                    }
                    // apply widgets
                    applyWidget(this);
                });
            };
            this.addParser = function (parser) {
                var l = parsers.length,
                    a = true;
                for (var i = 0; i < l; i++) {
                    if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
                        a = false;
                    }
                }
                if (a) {
                    parsers.push(parser);
                };
            };
            this.addWidget = function (widget) {
                widgets.push(widget);
            };
            this.formatFloat = function (s) {
                var i = parseFloat(s);
                return (isNaN(i)) ? 0 : i;
            };
            this.formatInt = function (s) {
                var i = parseInt(s);
                return (isNaN(i)) ? 0 : i;
            };
            this.isDigit = function (s, config) {
                // replace all an wanted chars and match.
                return /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
            };
            this.clearTableBody = function (table) {
                if ($.browser.msie) {
                    while (table.tBodies[0].firstChild) {
                        table.tBodies[0].removeChild(table.tBodies[0].firstChild);
                    }
                } else {
                    table.tBodies[0].innerHTML = "";
                }
            };
        }
    });

    // extend plugin scope
    $.fn.extend({
        tablesorter: $.tablesorter.construct
    });

    // make shortcut
    var ts = $.tablesorter;

    // add default parsers
    ts.addParser({
        id: "text",
        is: function (s) {
            return true;
        }, format: function (s) {
            return $.trim(s.toLocaleLowerCase());
        }, type: "text"
    });

    ts.addParser({
        id: "digit",
        is: function (s, table) {
            var c = table.config;
            return $.tablesorter.isDigit(s, c);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s);
        }, type: "numeric"
    });

    ts.addParser({
        id: "currency",
        is: function (s) {
            return /^[£$€?.]/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "ipAddress",
        is: function (s) {
            return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
        }, format: function (s) {
            var a = s.split("."),
                r = "",
                l = a.length;
            for (var i = 0; i < l; i++) {
                var item = a[i];
                if (item.length == 2) {
                    r += "0" + item;
                } else {
                    r += item;
                }
            }
            return $.tablesorter.formatFloat(r);
        }, type: "numeric"
    });

    ts.addParser({
        id: "url",
        is: function (s) {
            return /^(https?|ftp|file):\/\/$/.test(s);
        }, format: function (s) {
            return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//), ''));
        }, type: "text"
    });

    ts.addParser({
        id: "isoDate",
        is: function (s) {
            return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(
            new RegExp(/-/g), "/")).getTime() : "0");
        }, type: "numeric"
    });

    ts.addParser({
        id: "percent",
        is: function (s) {
            return /\%$/.test($.trim(s));
        }, format: function (s) {
            return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
        }, type: "numeric"
    });

    ts.addParser({
        id: "usLongDate",
        is: function (s) {
            return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });

    ts.addParser({
        id: "shortDate",
        is: function (s) {
            return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
        }, format: function (s, table) {
            var c = table.config;
            s = s.replace(/\-/g, "/");
            if (c.dateFormat == "us") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2");
            }    
            if (c.dateFormat == "pt") {
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");   
            } else if (c.dateFormat == "uk") {
                // reformat the string in ISO format
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
            } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
                s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3");
            }
            return $.tablesorter.formatFloat(new Date(s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "time",
        is: function (s) {
            return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
        }, format: function (s) {
            return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
        }, type: "numeric"
    });
    ts.addParser({
        id: "metadata",
        is: function (s) {
            return false;
        }, format: function (s, table, cell) {
            var c = table.config,
                p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
            return $(cell).metadata()[p];
        }, type: "numeric"
    });
    // add default widgets
    ts.addWidget({
        id: "zebra",
        format: function (table) {
            if (table.config.debug) {
                var time = new Date();
            }
            var $tr, row = -1,
                odd;
            // loop through the visible rows
            $("tr:visible", table.tBodies[0]).each(function (i) {
                $tr = $(this);
                // style children rows the same way the parent
                // row was styled
                if (!$tr.hasClass(table.config.cssChildRow)) row++;
                odd = (row % 2 == 0);
                $tr.removeClass(
                table.config.widgetZebra.css[odd ? 0 : 1]).addClass(
                table.config.widgetZebra.css[odd ? 1 : 0])
            });
            if (table.config.debug) {
                $.tablesorter.benchmark("Applying Zebra widget", time);
            }
        }
    });
})(jQuery);

function startNode(env,reg,node) {
     var url='p1?env='+env+'&op=start&node='+node+'&loc='+reg;
     $.getJSON( url, function( data ) { });
}

function stopNode(env,reg,node) {
     var url='p1?env='+env+'&op=stop&node='+node+'&loc='+reg;
     $.getJSON( url, function( data ) { });
}

function logger_reset(sz) { $("#logger_area").empty(); }
function logger_reset(sz) { $("#logger_area").empty(); }
function logger(sz) { if (getCookieDefault("IM","Off")=="On") $("#logger_area").append(sz); }
function serviceAnchor(env,op,node,reg,period,hours,linklabel) {
     return("<a href='" + serviceUrl(env,op,node,reg,period,hours) + "'>" + linklabel + "</a>");  
}
function serviceUrl(e,op,q,n,r,p,h,o) {
     var sz = "p1?env="+e+"&op="+op+"&qual="+q+"&node="+n+"&loc="+r+"&period="+p+"&hours="+h+"&offset="+o;
     $("#logger_area").empty();
     $("#logger_area").append(sz);
     return(sz);
}

function uibuttonConfirmTROne(sel,label) { 
     var guid  = "";
     var s     = "<tr>";
     for ( var i = 0; i < label.length; i++ ) { 
          guid  = randomString(6);
          s = s + "<td class='uione confirm' id='"+guid+"'>" + label[i] + "</td>";
          returnstack.push(guid);
     }
     s = s + "</tr>";
     $(sel).append(s);
}
function uibuttonConfirmTR(sel,label) { 
     var guid  = randomString(6);
     $(sel).append("<tr><td class='uibutton confirm' id='"+guid+"'></td></tr>");
     var $guid = $("#"+guid);
     $guid.append(label);
     $guid.attr("statcon",label);
     return(guid);
}
function divString(sel) {
    var w  =  $(sel).innerWidth / 2;
    var guid = randomString(8);
    return("<div width='" + w + "' id='" + guid + "'></div>");
}

function tableBy(n) {
    var w  =  $("#client_area").innerWidth / n;
    var h  =  $("#client_area").innerHeight() / n;
    var g1 = randomString(8);
    var g2 = randomString(8);
    returnstack.push(g1)
    returnstack.push(g2)
    //returnstack.pop();
    h=550;
    var sz = "<table width='" +w+ "'><tr><td valign=top height='" +h+ "' id='" + g1 + "'></td>";
    sz = sz + "<td>&nbsp;&nbsp;&nbsp;</td>";
    sz = sz + "<td valign=top id='" + g2 + "'></td></tr></table>";
    return(sz);
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

function capturePage() {
    var str = document.getElementsByTagName('html')[0].innerHTML;
    return (str)
}
function fontUP(sz) { return("<font size=+1>"+sz+"</font>"); }
function fontDOWN(sz) { return("<font size=-1>"+sz+"</font"); }
function maxvalue(n,m,r) { var ret = n; if ( n > m ) { ret = r; } return (ret); }
function minvalue(n,m,r) { var ret = n; if ( n < m ) { ret = r; } return (ret); }

function dq(sz)    { return("\"" + sz + "\"");}
function paren(sz) { return("(" + sz + ")");}
function suig(sz)  { return("{" + sz + "}");}
function sqre(sz)  { return("[" + sz + "]");}
function pad(a){return(1e15+a+"").slice(-4)}
function pad1(sz){return(sz.substring(0,4))}
function pad2(sz){return(sz.substring(4,4))}

function tuple1(op1)             { var js = dq(op1); return(js); }
function tuple2(op1,op2)         { var js = dq(op1) + "," + dq(op2); return(js); }
function tuple3(op1,op2,op3)     { var js = dq(op1) + "," + dq(op2) + "," + dq(op3); return(js); }
function tuple4(op1,op2,op3,op4) { var js = dq(op1) + "," + dq(op2) + "," + dq(op3) + "," + dq(op4); return(js); }
function tuple4(op1,op2,op3,op4)     { var c=","; var js = dq(op1) +c+ dq(op2) +c+ dq(op3) +c+ dq(op4); return(js); }
function tuple5(op1,op2,op3,op4,op5) { var c=","; var js = dq(op1) +c+ dq(op2) +c+ dq(op3) +c+ dq(op4) +c+ dq(op5); return(js); }
function tuple6(op1,op2,op3,op4,op5,op6) { 
         var c=","; var js = dq(op1) +c+ dq(op2) +c+ dq(op3) +c+ dq(op4) +c+ dq(op5) +c+ dq(op6);
         return(js); 
}
function tuple7(op1,op2,op3,op4,op5,op6,op7) { 
         var c=","; var js = dq(op1) +c+ dq(op2) +c+ dq(op3) +c+ dq(op4) +c+ dq(op5) +c+ dq(op6) +c+ dq(op7);
         return(js); 
}

function jsfunc3p(name,op1,op2,op3,label) {
     var js = "<A href='javascript:" + name + "(" + dq(op1) + "," + dq(op2)+ "," + dq(op3) + ");'>" + label + "</A>XX";
     return(js);
}
function jsfunc1(name,op1,label) {
     var js = "<A href='javascript:" + name + paren(tuple1(op1)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc2(name,op1,op2,label) {
     var js = "<A href='javascript:" + name + paren(tuple2(op1,op2)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc3(name,op1,op2,op3,label) {
     var js = "<A href='javascript:" + name + paren(tuple3(op1,op2,op3)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc4(name,op1,op2,op3,op4,label) {
     var js = "<A href='javascript:" + name + paren(tuple4(op1,op2,op3,op4)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc5(name,op1,op2,op3,op4,op5,label) {
     var js = "<A href='javascript:" + name + paren(tuple5(op1,op2,op3,op4,op5)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc6(name,op1,op2,op3,op4,op5,op6,label) {
     var js = "<A href='javascript:" + name + paren(tuple6(op1,op2,op3,op4,op5,op6)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc7(name,op1,op2,op3,op4,op5,op6,op7,label) {
     var js = "<A href='javascript:" + name + paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" + label + "</A>";
     return(js);
}
function jsfunc7a(name,op1,op2,op3,op4,op5,op6,op7,label) {
     var js = "";
     var sz = "ONETWOTHREE";
     sz= "<div class='round'><img src='transparent.gif'></div>";
     js = "<div class='round'><A href='javascript:" +name+ paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" +sz+ "</A></div>";
     js = "<div class='round'><A class='round' href='javascript:" +name+ paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" +sz+ "</A></div>";
     js = "<A class='round' href='javascript:" +name+ paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" +sz+ "</A>";
     js = "<A class='nodec' href='javascript:" +name+ paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" +sz+ "</A>";
     //js = "<A class='round' href='javascript:" +name+ paren(tuple7(op1,op2,op3,op4,op5,op6,op7)) + ";'>" +sz+ "</A>";
     return(js);
}
function timeStamp() {
// Create a date object with the current time
var now = new Date();
// Create an array with the current month, day and time
var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
// Create an array with the current hour, minute and second
var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
// Determine AM or PM suffix based on the hour
var suffix = ( time[0] < 12 ) ? "AM" : "PM";
// Convert hour from military time
//time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
// If hour is 0, set it to 12
//time[0] = time[0] || 12;
// If seconds and minutes are less than 10, add a zero
for ( var i = 1; i < 3; i++ ) {
if ( time[i] < 10 ) {
time[i] = "0" + time[i];
}
}
// Return the formatted string
// return date.join("/") + " " + time.join(":") + " " + suffix;
return time.join(":") + " " + suffix;
}

  function mapChartType(sz) {
     var szRet = sz;
     switch (sz) {
               case "Column":
               case "column":
               case "Col":
               case "col":
                   szRet= "Column";
                   break;
               case "line":
               case "Line":
                   szRet= "Line";
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

function spade(sz,n) {
     var pad      = "";
     var r        = sz.length;
     var j        = Math.floor(  (n-r) / 2 );
     //for ( i=0;i<j;i++ ) pad = pad + "&nbsp;"
     for ( i=0;i<j;i++ ) pad = pad + "++"
     return( pad + sz + pad );
}

var alphaSetConstant = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var charSetConstant  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomString(len) {
     var r        = Math.floor(Math.random() * alphaSetConstant.length);
     var alpha    = alphaSetConstant.substring(r, r+1);
     
     var randomString = '';
     for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSetConstant.length);
          randomString += charSetConstant.substring(randomPoz,randomPoz+1);
     }
     return randomString;
}

function addZero(i) { if (i < 10) { i = "0" + i; } return i; }
function myDateFunction() {
    var d  = new Date();
    var MM = addZero(d.getMonth()+1);
    var DD = addZero(d.getDate());
    var YY = addZero(d.getFullYear());
    var h  = addZero(d.getHours());
    var m  = addZero(d.getMinutes());
    var s  = addZero(d.getSeconds());
    var o  = addZero(d.getTimezoneOffset()/60);
    // return (MM + "/" + DD + "/" + YY + " @ " + h + ":" + m + ":" + s + " (offset " + o + ")" );
    //return (MM + "/" + DD + "/" + YY + " @ " + h + ":" + m + ":" + s );
    return (MM + "/" + DD + "/" + YY );
}
function myGraphDate(x) {
    var d  = new Date(x);
    var MM = addZero(d.getMonth()+1);
    var DD = addZero(d.getDate());
    var YY = addZero(d.getFullYear());
    var h  = addZero(d.getHours());
    var m  = addZero(d.getMinutes());
    var s  = addZero(d.getSeconds());
    var o  = addZero(d.getTimezoneOffset()/60);
    return (MM + "/" + DD + "/" + YY + " @ " + h + ":" + m + ":" + s + " (offset " + o + ")" );
}
var setCookieConstant = 24*60*60*1000;
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*setCookieConstant));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
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

function openSettingsBar(guid) {
     var g1 = randomString(8);
     var sz = "<table cellpadding=0 cellspacing=0><tr id='"+g1+"'>";
     $("#"+guid).append(sz);
     return(g1);
}
function closeSettingsBar(guid) {
     var sz = "</tr></table>";
     $("#"+guid).append(sz);
     return(guid);
}
function addSettingsElement(guid) {
     var g1 = randomString(8);
     $("#"+guid).append("<td id='"+g1+"' align='middle'></td>");
     return(g1);
}
function appendButtonAnchorTDWithGuid(sel,cls,prefix) {
     var g1 = randomString(8);
     var g2 = randomString(8);
     var sz = "<td class='"+cls+"' id='"+g1+"' align='middle'></td>";
     $(sel).append(prefix + sz);
     return(g1);
}
function appendButtonAnchorWithGuid2(sel,cls,prefix) {
     var g1 = randomString(8);
     var sz = "<table><tr><td class='bartable' id='"+g1+"' align='middle'></td></tr></table>";
     $(sel).append(prefix + sz);
     return(g1);
}
function appendButtonAnchorWithGuid(sel,cls,prefix) {
     var g1 = randomString(8);
     var sz = "<table width=70><tr><td class='"+cls+"' id='"+g1+"' valign='middle' align='middle'></td></tr></table>";
     $(sel).append(prefix + sz);
     return(g1);
}

function appendAnchorWithGuid(sel,cls,prefix) {
     var guid = randomString(8);
     $(sel).append(prefix + "<A class='" + cls + "' id='" +guid + "'></A>");
     return(guid);
}
function formatSelfNamedAnchor(url) {
     return("<A href='" + url + "'>" + url + "</A>");
}

function xxxxxxappendAnchorWithNamedGuid(sel,guid,cls,prefix) {
     //$(sel).append(prefix + "<span class='"+cls+"'><A class='"+cls+"' id='"+guid+"'></A></span>");
     $(sel).append(prefix + "<span width='330' class='"+cls+"' id='"+guid+"'></span>");
     return(guid);
}
function appendDivWithGuid(sel) {
     var guid = randomString(8);
     $(sel).append("<div id='"+guid+"'></div>");
     return(guid);
}
function appendTableTrTdWithGuid(sel) {
     var guid = randomString(8);
     var sz = "<table width='100%' border=0 align='middle' valign='middle'><tr><td align='middle' valign='middle' id=" + guid + "></td></tr></table>";
     $(sel).append(sz);
     return(guid);
}

function GUIDappendEmptyTable(thisguid) {
     var guid = randomString(8);
     $("#"+thisguid).append("<table id=" +guid+ "></table>");
     return(guid);
}
function GUIDappendEmptyTr(thisguid) {
     var guid = randomString(8);
     $("#"+thisguid).append("<tr id=" +guid+ "></tr>");
     return(guid);
}
function GUIDappendEmptyTd(thisguid) {
     var guid = randomString(8);
     $("#"+thisguid).append("<td id=" +guid+ "></td>");
     return(guid);
}
function GUIDappendValueTd(thisguid,val) {
     var guid = randomString(8);
     $("#"+thisguid).append("<td id=" +guid+ ">" + val + "</td>");
     return(guid);
}
function GUIDappendEmptyDiv(thisguid) {
     var guid = randomString(8);
     $("#"+thisguid).append("<div id=" +guid+ "></div>");
     return(guid);
}
       


function divGuid(sel) {
     var guid = randomString(8);
     $(sel).append("<div id='"+guid+"'></div>");
     return(guid);
}
                        
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
     function pick(sel) {
          $(sel).attr("picked","Y");
     }
     function unpick(sel) {
          $(sel).attr("picked","N");
     }
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
     function selectpick() {
          var rc = 0;
          var sz = "";
          var szjs = "";
          resetselectpick();
          SELECTEDITEMS = 0;
          $("#"+GlobalTableId + " > tbody  > tr").each(function() {
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

if ( 1 == 0) {
          if ( rc == 0 ) {
               $("#"+GlobalTableId + " > tbody  > tr").each(function() {
                    SELECTEDITEMS++;
                    sz = sz + $(this).attr("node");
                    NODESET[NODESET.length] = $(this).attr("node");
                    ENVSET[ENVSET.length] = $(this).attr("env");
                    REGSET[REGSET.length] = $(this).attr("reg");
                    NODENAMESET[NODENAMESET.length] = $(this).attr("nodename");
                    PURPOSESET[PURPOSESET.length] = $(this).attr("purpose");
               });
          }
}
 sz =sz;
          sz = JSON.stringify(NODESET);
          setCookie('NODESET_C', sz, 12);
          sz = getCookieDefault('NODESET_C',"");
          szjs = JSON.parse(sz);

          setCookie('ENVSET_C', JSON.stringify(ENVSET), 12);
          setCookie('REGSET_C', JSON.stringify(REGSET), 12);
          setCookie('NODENAMESET_C', JSON.stringify(NODENAMESET), 12);
          setCookie('PURPOSESET_C', JSON.stringify(PURPOSESET), 12);
          //var NODESET = JSON.parse(getCookieDefault('NODESET_C',""));
          //var ENVSET = JSON.parse(getCookieDefault('ENVSET_C',""));
          //var REGSET = JSON.parse(getCookieDefault('REGSET_C',""));
          //var NODENAMESET = JSON.parse(getCookieDefault('NODENAMESET_C',""));
          //var PURPOSESET = JSON.parse(getCookieDefault('PURPOSESET_C',""));
          $("#"+selectedbutton).empty(); 
          $("#"+selectedbutton).append( SELECTEDITEMS + " SELECTED"); 
     }
     function tableRowPick(sel) {
          var $sel     = $(sel);
          var parenti  = $sel.parent().parent();
          var $parenti = $(parenti);
          $parenti.attr("node",$sel.attr("node"));
          $parenti.attr("env",$sel.attr("env"));
          $parenti.attr("reg",$sel.attr("reg"));
          $parenti.attr("nodename",$sel.attr("nodename"));
          $parenti.attr("purpose",$sel.attr("purpose"));
          if (picked(parenti)) {
               unpick(parenti);
               $parenti.children('td').css({ 'background-color': '#dfe3ee' });
          } else {
               pick(parenti);
               $parenti.children('td').css({ 'background-color': 'Magenta' });
          }
     }
     function augment() {
          var hours =  getCookieDefault("DHRS",1);
          while (pushpop.length > 0) {
               var js = "";
               var szTupple = pushpop.pop()
               var res = szTupple.split(",");
               var op = res[0];
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
               var aguid=""
               switch (operd1) {
                    case "IDENTITY":
                         $("#"+op).html("");
                         aguid = appendAnchorWithGuid("#"+op,"theanchor","");
                         var $aguid = $("#"+ aguid);
                         $aguid.attr( "node", node )
                         $aguid.attr( "env", env )
                         $aguid.attr( "reg", reg )
                         $aguid.attr( "nodename", nodename )
                         $aguid.attr( "purpose", purpose )
                         $aguid.append("PCK");
                         $aguid.on("click", function(e) {
                              e.preventDefault();
                              var parenti = $(this).parent().parent();
                              var parentid = $(parenti).attr("id");

                              var $parenti = $(parenti);
                              $parenti.attr("node",$(this).attr("node"));
                              $parenti.attr("env",$(this).attr("env"));
                              $parenti.attr("reg",$(this).attr("reg"));
                              $parenti.attr("nodename",$(this).attr("nodename"));
                              $parenti.attr("purpose",$(this).attr("purpose"));

                              if (picked(parenti)) {
                                   unpick(parenti);
                                   $parenti.children('td').css({ 'background-color': '#dfe3ee' });
                              } else {
                                   pick(parenti);
                                   $parenti.children('td').css({ 'background-color': 'Magenta' });
                              }
                              var thisnode = $(this).attr("node")
                              var thisenv= $(this).attr("env")
                              var thisreg= $(this).attr("reg")
                              var thisnodename= $(this).attr("nodename")
                              var thispurpose= $(this).attr("purpose")
                              selectpick();
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
                         var newFontSize;
                         var currentFontSize = $element.css('font-size');
                         var currentFontSizeNum = parseFloat(currentFontSize, 10);
                         newFontSize = currentFontSizeNum * 0.8;
                         $element.css('font-size', newFontSize);
                         break;
                    case "CUTTEXT":
                         $("#"+op).html = "<br><br>" + $("#"+op).html;
                         break;
                    case "RIGHTJUSTIFY":
                         $("#"+op).css({ 'text-align': 'Right' });
                         break;
                    case "DOLLAR":
                         $("#"+op).css({ 'color': 'Green' });
                         $("#"+op).css({ 'text-align': 'Right' });
                         break;
                    case "GREEN":
                         $("#"+op).css({ 'color': 'Green' });
                         $("#"+op).parent().attr("status","GREEN");
                         break;
                    case "RED":
                         $("#"+op).css({ 'color': 'Red' });
                         $("#"+op).parent().attr("status","RED");
                         break;
                    case "perf":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"graph"));
                         break;
                    case "performance":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"graph"));
                         break;
                    case "10DAY":
                         // function snapCpuPerf(env,reg,node,name,purpose,hours,period) {
                         //   szsz = "<img src='chart.png' height=18 width=18>"
                         //   $("#"+op).html(jsfunc7a("snapCpuPerf",operd2,operd3,operd4,r5,r6,24*10,periodIn,szsz));
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3 ,operd4,r5,r6,hours,periodIn,"perf"));
                         //$("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3 ,operd4,r5,r6, 24*10,periodIn,"perf"));
                         break;
                    case "5DAY":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,24*5,periodIn,"perf"));
                         break;
                    case "3DAY":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,24*3,periodIn,"perf"));
                         break;
                    case "2DAY":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,24*2,periodIn,"perf"));
                         break;
                    case "24HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,24,periodIn,"perf"));
                         break;
                    case "12HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,12,periodIn,"perf"));
                         break;
                    case "6HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,6,periodIn,"perf"));
                         break;
                    case "3HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,3,periodIn,"perf"));
                         break;
                    case "2HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,2,periodIn,"perf"));
                         break;
                    case "1HR":
                         $("#"+op).html(jsfunc7("snapCpuPerf",operd2,operd3,operd4,r5,r6,1,periodIn,"perf"));
                         break;
               }
          }
          //if ( f == "RUN" ) $("#"+guid).css({ 'color': 'Green', 'font-size': '150%'});
          //if ( f == "STOP" ) f = "<font color='Blue'>" + f + "</font>";
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
     function myTable(data,tableid,cls,obj) {
          GlobalTableId = tableid;
          var identity = "NONE";
          var tt = "";
          var n = 0;
          var i = 0;
          var k = 0;
          var ct = 0;
          var ID="";
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
          html[++h] = "<table width='100%' id='";
          html[++h] = tableid;
          html[++h] = "' class='gridtable'><thead><tr status='HEADER'><th>#</th>";
          obj.headers =  "#, ";
          for (i=0;i<n;i++) {
            ID="TH" + tableid + (i); 
            if ( data.cols[i].label=="IDENTITY" ) {
                 nlook++;  
                 html[++h] = "<th id='";
                 html[++h] = ID;
                 html[++h] = "'>rem</th>";
            } else
                 if ( !(data.cols[i].label=="HIDE") ) {
                         nlook++;  
                         if ( data.cols[i].label == obj.sortkey) obj.namedex=nlook;  
                         // html[++h] = 
                         html[++h] = "<th id='";
                         html[++h] = ID;
                         html[++h] = "'>";
                         html[++h] = data.cols[i].label; 
                         html[++h] = "</th>";
                         pushpop.push(ID + ",DROPFONT");
                 }
          }
          html[++h] = "</tr></thead>";
          // TH IS DONE
          // TD BEGINS
          html[++h] = "<tbody>";
          for (i=0;i<data.rows.length;i++){
               guidnext  = randomString(3);
               nextrow = 0;
               ct++;
               ID="TC" + tableid + '0'; 
               guidct  = randomString(12);
               html[++h] = "<tr id='";
               html[++h] = randomString(8);
               html[++h] = "'>";
               html[++h] = "<td id='";
               html[++h] = guidct;
               html[++h] = "'>";
               html[++h] = ct.toString();
               html[++h] = "</td>";
               pushpop.push(guidct + ",DROPFONT");

               for (j=0;j<n;j++) {
                    ID="TC" + tableid + (j); 
                    tt=data.cols[j].label;
                    if ( tt == "XXXXIDENTITY" ) {
                         guid  = randomString(4);
                         f = data.rows[i].c[j].v;
                         identity = data.rows[i].c[j].v;
                         pushpop.push(guid +c+ tt +c+ identity);
                         continue;
                    }
                    if ( !(tt == "HIDE") ) {
                         f = data.rows[i].c[j].v;
                         guid  = randomString(5);
                         if ( f == "R" ) pushpop.push(guid + ",GREEN");
                         if ( f == "S" ) pushpop.push(guid + ",RED");
                         switch (tt) {
                              case "$/day": 
                              case "$/hour": 
                                   pushpop.push(guid + ",RIGHTJUSTIFY");
                                   break;
                              case "s": 
                                   break;
                              case "sg-": 
                              case "ami-": 
                              case "subnet-": 
                              case "vpc-": 
                              case "placement": 
                              case "key": 
                              case "launch": 
                              case "vpc": 
                              case "pub": 
                              case "prv": 
                              case "config": 
                                   pushpop.push(guid + ",DROPFONT");
                                   break;
                              case "fee": 
                                   pushpop.push(guid +c+ "DOLLAR" +c+ f);
                                   break;
                              case "IDENTITY": 
                                   identity = f;
                                   pushpop.push(guid +c+ tt +c+ identity);
                                   break;
                              case "perf": 
                                   pushpop.push(guid +c+ tt +c+ identity);
                                   break;
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
     }


function chartjsDoTableChart(what,where,description,control,cls) {
        var mojo = "";
        var sz = "";
        var szLi = "";
        var szsz = "";
        var q = "";
        $.getJSON( what, function( data ) { 
             var guid = randomString(6);
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
           options.legend.textStyle.color             =  "White";
           options.chartArea.backgroundColor          =  "Black";
           options.backgroundColor                    =  "Black";
           options.titleTextStyle.color               =  "White";
           options.vAxis.gridlines.color              =  "White";
           options.vAxis.textStyle.color              =  "White";
           options.vAxis.titleTextStyle.color         =  "White";
           options.hAxis.gridlines.color              =  "White";
           options.hAxis.textStyle.color              =  "White";
           options.hAxis.titleTextStyle.color         =  "White";
           }
           options.legend.textStyle.fontSize          =  9;
           options.vAxis.textStyle.fontSize           =  10;
           options.vAxis.titleTextStyle.fontSize      =  12;

           // -- options.hAxis.textStyle.fontSize           =  10;
           // -- options.hAxis.titleTextStyle.fontSize      =  12;


           options.height = options.height + cfgZoom 
           options.chartArea.height = options.chartArea.height + cfgZoom;
           
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
                options.hAxis.title = data.rows.length + " pts, " + data.effpst + " - " + data.effnow;
                options.vAxis.title = vlabel;
                options.hAxis.gridlines.count = 8;
                var adjustorObject =  {minValue: 0, maxValue: 110};
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


function menuCallBack() {
     if (getCookie("MENU") == "hide") 
          $("#left_area").show();
     else
          $("#left_area").hide();
}

function myBCallBack(sty,g1,cls,title,cookie, s, callback) {
     var g2 = addSettingsElement(g1);
     var guid = myBimpl(sty,g2,cls,title,cookie, s);
     setCookie(cookie, s[0], 12);
     $("#"+guid).on("click", function(e) {
          e.preventDefault();
          callback()
     });
     menuCallBack();
}
function myB(sty,g1,cls,title,cookie, s) {
     var g2 = addSettingsElement(g1);
     myBimpl(sty,g2,cls,title,cookie, s);
}
function myInput(sty,g1,cls,title,cookie, s) {
     var g2 = addSettingsElement(g1);
     myInputimpl(sty,g2,cls,title,cookie, s);
}
function myInputimpl(w,g2,cls,title,cookie, s) {
     var xcls="uibutton confirm";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomString(6);
     if (w == 0) w = 65;
     if (isOnOff(s)) w = w - 10;
     // Not sure this extra table is really required, so I took it out and added the z2=g2; line
     //$("#"+g2).append("<table class='bartable'><tr><td align='middle' id='"+z2+"'></td></tr></table>");
     z2=g2;

     var guid = randomString(18);
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
     
     var inputguid = randomString(6);
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
function myBimpl(w,g2,cls,title,cookie, s) {
     var xcls="uibutton confirm";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomString(6);
     if (w == 0) w = 65;
     if (isOnOff(s)) w = w - 10;
     // Not sure this extra table is really required, so I took it out and added the z2=g2; line
     //$("#"+g2).append("<table class='bartable'><tr><td align='middle' id='"+z2+"'></td></tr></table>");
     z2=g2;

     var guid = randomString(18);
     sz="<table width="+w+"><tr><td class='"+xcls+"' id='"+guid+"'></td></tr></table>";
     $("#"+z2).append(sz);
     var $guid = $("#"+guid);
     
     var temp = getCookie(cookiedex);
     if (isNaN(temp)) setCookie(cookiedex, 0, 12);
     if (temp > (s.length-1)) setCookie(cookiedex, 0, 12);
     if (temp < 0) setCookie(cookiedex, 0, 12);
     temp = (getCookie(cookie+"DEX")*1);
     setCookie(cookie, s[temp], 12);
     var  cv = fontUP(getCookie(cookie));
     //var z= parseInt($('#'+guid).css('font-size')) ;
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
     function dicate(guid,cookie, s) {
             var $guid = $("#"+guid);
             var dex  = (getCookie(cookie+"DEX")*1)+1;
             if (dex == s.length)  dex = 0; 
             setCookie(cookie+"DEX", dex, 12);
             setCookie(cookie, s[dex], 12);
             var cv = fontUP(getCookie(cookie));
             var title= $guid.attr("thistitle")
	     if (isOnOff(s)) {
                     if ( (dex % 2) == 0) 
                       $guid.css({'text-decoration': 'none'}); else $guid.css({'text-decoration': 'underline'});
             }
             else {
                  $guid.empty().append(title+"<br>"+cv);
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
     var xcls="uibutton confirm";
     var sz = "";
     var i = 0;
     var cookiedex = cookie+"DEX";
     var z2  = randomString(6);
     if (w == 0) w = 65;
     z2=g2;
     var guid = randomString(18);
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
function myTextControl($sel,title,s,cookie,getter,setter) {
     var xcls="uibutton confirm";
     var sz = "";
     var i = 0;

     var  guid = randomString(8);
     var iguid = randomString(8);
     var v = getCookie(cookie); 
     if ( v == "") v = getter();
     setter(v); 
     sz = sz +"<tr>"
     sz = sz +"<td valign=middle>" +title+ "</td>";
     sz = sz +"<td valign=middle><input value='" +v+ "' size=" +s+ " id='" +iguid+ "'></td>";
     sz = sz +"<td valign=middle class='"+xcls+"' id='"+guid+"'></td>";
     sz = sz +"</tr>";
     $sel.append(sz);

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

var selectedbutton = "" ;
function isOnOff(s) {
     var bRet = false;
     if (s.length == 2) 
          if ( ((s[0]=="Off") && (s[1]=="On")) || ((s[1]=="Off") && (s[0]=="On"))  ) bRet = true; 
     return(bRet);
}

      function resetClientArea() {
           $bar_area = $("#bar_area");
           $bar_area.html("");
           $bar_area.css({ 'color': 'Black', 'font-size': '60%'});
           $bar_area.css({'text-decoration': 'none'});
           $("#client_area").empty();
           resetIntervals();
      }
      function resetIntervals() {
           var i = 0;
           clearInterval(clientAreaInterval);
           resetIntervalSet();
      }
      function resetIntervalSet() {
           for (i=0;i<INTERVALSET.length;i++) clearInterval(i);
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
      function DAC(sz) {
          var url="";
          var filter="";
          // filter=$("#textentry").val();
          var szComment = "";
          resetClientArea();
          var nControl = -1; 
          document.getElementById("client_area").innerHTML = "";
          switch ( getCommand() )  {
             case "inv": radioOp="inventory"; break; 
             case "cfg": radioOp="instanceconfig"; break; 
             case "prf": radioOp="performance"; break; 
             case "str": radioOp="liststorage"; break; 
             case "tag": radioOp="tags"; break; 
             case "usr": radioOp="users"; break; 
             case "grp": radioOp="groups"; break; 
             case "scg": radioOp="sg"; break; 
             case "que": radioOp="queues"; break; 
             case "vol": radioOp="volumes"; break; 
             case "rle": radioOp="roles"; break; 
             case "ami": radioOp="images"; break; 
             case "bil": radioOp="bill"; break; 
             case "bis": radioOp="billsummary"; break; 
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
               guid  = randomString(6);
               $("#bar_area").attr("bartitle", serviceAnchor(sz,radioOp,"",reg,1,18,detail));
               // $("#notebar").append(serviceAnchor(sz,radioOp,"",reg,1,18,detail));
               $("#client_area").append("<div id='"+guid+"'></div>");
               what="p1?env="+sz+"&op="+radioOp+"&loc="+reg;
               switch (sz) {
               case "XALL": 
                    doTableChartRepeat("p1?env=ALL&op=listall&loc=ALL" ,guid ,"Instance List",nControl);
                    break;
               case "ALLEBS": 
                    doTableChartRepeat("p1?env=ALL&op=volumes&loc=ALL" ,guid ,"EBS List",nControl);
                    break;
               default:
                    if (getCookie("BCHT") == "On" ){
                     url ='p1?env='+sz+'&op=billing&loc='+reg;
                     snapPerf("BILLING",guid,url,sz,reg,"","USD",chartjsSimpleTitle(sz+" Cloud Cost (monthly bill as of date indicated)") );
                    }
                    if ( radioOp == "special" ) {
                     $("#client_area").empty();
                     doCpuTableChart();
                    }
                    else {
                     // ****************************************
                     // *** Default Operations (DEFOP)
                     // ****************************************
                     doTableChartRepeat("p1?env="+sz+"&op="+radioOp+"&filter="+filter+"&loc="+reg ,guid ,"Instance List",nControl);
                    }
                    break;
               }
               break;
          }
      }
// https://developers.google.com/chart/interactive/docs/gallery/barchart#Data_Format
      // @DCA

      // @doTableChart
      function doTableChartRepeat(what,where,description,control) {
           var cp = getCookieDefault("PDCHT","0") * 1000;
           doTableChart(what,where,"",0,"gridtable")
                // ****************************************
                // *** Auto Update Code
                // ****************************************
                // if ( cp > 0) 
                //     clientAreaInterval = setInterval(function() { doTableChart(what,where,"",0, "gridtable") }, cp);
      }

     function snapPerfEnv(env,reg,node) {
          var guid="";
          var g0="";
          var url="";
          guid  = randomString(8);
          $("#client_area").append("<div id='"+guid+"'></div>");
          doTableChartRepeat("p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg ,guid,"t",0);
          g0  = randomString(8);
          $("#client_area").append("<div id='"+g0+"'></div>");
          url ='p1?env='+env+'&op=singletimeseries&qual=cpu&node='+node+'&loc='+reg+'&period='+p+'&hours=' + h;
     }
     function doCpuTableChart() {
        var MB = "MegaBytes";
        var OP = "Ops";
        var PT = "Percent";
        var env = "";
        var reg = "";
        var node = "";
        var status = "";
        var name = "";
        var purpose = "";
        var guid="";
        var dh=getCookie("DHRS");
        if (dh=="") dh="24";
        var offset=getCookie("OSET");
        var h = getCookieDefault("DHRS",24);
        var p = getCookieDefault("PER",60);
        var willie="";
        var panes = [];
        var nextedpane = 0;
        var gp = 0;
        var sz = "";
        var i = 0;
        var PANECT = 60;
        for (i=0;i<PANECT;i++) panes[panes.length] = randomString(6);
        switch ( getCookie("EXP") )  {
           case "One":
             sbInit("<table width='98%'>");
             for (i=0;i<PANECT;i++) sbAdd("<tr><td width='98%' id='"+panes[i]+"'></td></tr>");
             sbAdd("</table>");
             break;
           case "Two":
             sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
             for (i=0;i<(PANECT-2);i++) { 
                  sbAdd("<tr><td width=49% id='"+panes[i]+"'></td>");
                  sbAdd("<td width=2%>&nbsp;</td><td width=49% id='"+panes[i+1]+"'></td></tr>");
                  i++;
             }
             sbAdd("</table>");
             break;
           case "Three":
                sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
                for (i=0;i<(PANECT-3);i++) { 
                  sbAdd("<tr><td width=32% id='"+panes[i]+"'></td>");
                  sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+1]+"'></td>");
                  sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+2]+"'></td></tr>");
                  i++;
                  i++;
                }
                sbAdd("</table>");
                break; 
        }
        $("#client_area").append(sbString());

        for (i=0;i<NODESET.length;i++) {
             node = NODESET[i];
             env = ENVSET[i];
             reg = REGSET[i];
             name = NODENAMESET[i];
             purpose = PURPOSESET[i];
             status = "TBD";
             var datamode = getCookieDefault("DMOD","sts");
             var water=0;
             if (getCookie("CPUOO") == "On" ){
                url = serviceUrl(env,datamode,"cpu",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "CPU",gp,url,env,reg,node,PT,chartjsTitleLong("cpu", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("MEMA") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"mema",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
              snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitleLong("Memory Available",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("MEMZ") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"memz",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
              snapPerf("NET",gp,url,env,reg,node,PT,chartjsTitleLong("Memory Utilization",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("MEMU") == "On" ){
                  url = serviceUrl(env,"l"+datamode,"memu",node,reg,p,dh,offset);
                  gp = panes[nextedpane++];
                  snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitleLong("Menory Used",h,node,name,purpose,h,p,offset));
             }
             if (getCookie("NIB") == "On" ){
                url = serviceUrl(env,datamode,"netin",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitleLong("netin",h,node,name,purpose,h,p,offset) );
             } 
             if (getCookie("NOB") == "On" ){
                url = serviceUrl(env,datamode,"netout",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitleLong("netout", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DRB") == "On" ) {
                url = serviceUrl(env,datamode,"diskreadbytes",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,MB,chartjsTitleLong("diskreadbytes", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DWB") == "On" ) {
                url = serviceUrl(env,datamode,"diskwritebytes",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,MB,chartjsTitleLong("diskwritebytes", h,node,name,purpose,h,p,offset) );
             } 
             if (getCookie("DRO") == "On" ) {
                url = serviceUrl(env,datamode,"diskreadops",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,OP,chartjsTitleLong("diskreadops", h,node,name,purpose,h,p,offset) );
             }
             if (getCookie("DWO") == "On" ) {
                url = serviceUrl(env,datamode,"diskwriteops",node,reg,p,dh,offset);
                gp = panes[nextedpane++];
                snapPerf( "DISK",gp,url,env,reg,node,OP,chartjsTitleLong("diskwriteops", h,node,name,purpose,h,p,offset) );
             } 
        }
     }

     var returnstack = [];
     var stack = [];
     var INTERVALSET = [];

      function doTableChart(what,where,description,control,cls) {
        var q = "";
        var i = 0;
        var namedex = -1;
        var obj = { namedex: 0, sortkey: "", headers:"" };
        obj.sortkey = getCookieDefault("SORTKEY","name");
// HEREHERE
        $.ajaxSetup({ async: false });
        $.getJSON( what, function( data ) { 
             var guid = randomString(6);
             $("#bar_area").html( $("#bar_area").attr("bartitle") );
             $("#"+where).append( myTable(data, guid, cls, obj) );
             augment();
             if (obj.namedex >0) {
                  $("#"+guid).tablesorter({ sortList: [[obj.namedex-1,0]] }); 
             }
             else {
                  $("#"+guid).tablesorter({ sortList: [[2,0]] }); 
             }
             selectpick();
        });
        stack.push($("#client_area").html()); 
     }


     var clientAreaInterval = 0;
     var ScreenInterval = 0;
     function queueMonitor(env) {
        resetClientArea();
        var guid = "";
        var what =   'p1?env='+env+'&op=queuecounts&loc=E1&period=1&hours=18'
        resetClientArea();
        guid  = randomString(6);
        var tablename = randomString(6);
        $("#client_area").append("<div id='"+guid+"'></div>");
        doTableChart(what,guid,"",0,"gridtable")
        clientAreaInterval = setInterval(function() {
             doTableChart(what,guid,"",0,"gridtable")
        }, 200000);
     }

     function setupscreen(r0,r1,r2) {
          var guid  = randomString(8);
          $("#client_area").append("ONE:&nbsp;<input type='text' size=16 id='"+guid+"'>");
          guid  = randomString(8);
          $("#client_area").append("ONE:&nbsp;<input type='text' size=16 id='"+guid+"'>");
          guid  = randomString(8);
          $("#client_area").append("ONE:&nbsp;<input type='text' size=16 id='"+guid+"'>");
          return(0);
     }
     function snapCpuPerf(env,reg,node,name,purpose,hours,period) {
          var $client_area = $("#client_area");
          var MB = "MegaBytes";
          var OP = "Ops";
          var PT = "Percent";
          hours  = getCookie("DHRS",1);
          period = getCookieDefault("PER",60);
          var sz = "";
          var url = "";
          var zzz="";
          var h=hours;
          var p=period;

          var w   =  ($("#client_area").innerWidth / 2) - 30;

          var panes = [];
          var nextedpane = 0;
          var gp = 0;
          var PANECT = 60;
          for (i=0;i<PANECT;i++) panes[panes.length] = randomString(6);
          switch ( getCookie("EXP"))  {
             case "One":
                  sbInit("<table width='98%'>");
                  for (i=0;i<PANECT;i++) sbAdd("<tr><td width='98%' id='"+panes[i]+"'></td></tr>");
                  sbAdd("</table>");
                  break; 
             case "Two":
                  sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
                  for (i=0;i<(PANECT-2);i++) { 
                    sbAdd("<tr><td width=49% id='"+panes[i]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=49% id='"+panes[i+1]+"'></td></tr>");
                    i++;
                  }
                  sbAdd("</table>");
                  break; 
             case "Three":
                  sbInit("<table CELLPADDING=0 CELLSPACING=0 width='98%'>");
                  for (i=0;i<(PANECT-3);i++) { 
                    sbAdd("<tr><td width=32% id='"+panes[i]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+1]+"'></td>");
                    sbAdd("<td width=2%>&nbsp;</td><td width=32% id='"+panes[i+2]+"'></td></tr>");
                    i++;
                    i++;
                  }
                  sbAdd("</table>");
                  break; 
          }

          resetClientArea();
          var guid  = randomString(8);
          $client_area.append("<div id='"+guid+"'></div>");
          $client_area.append(sbString());


          var aa = getCookie("BN0");
          var bb = getCookie("BE0");
          var cc = getCookie("BR0");
          if (node != aa) {
            if (getCookie("LOCK") == "UNLOCKED") {
               setCookie("BN3", getCookie("BN2"), 12);
               setCookie("BE3", getCookie("BE2"),  12);
               setCookie("BR3", getCookie("BR2"),  12);
               setCookie("BM3", getCookie("BM2"),  12);
               setCookie("BN2", getCookie("BN1"), 12);
               setCookie("BE2", getCookie("BE1"),  12);
               setCookie("BR2", getCookie("BR1"),  12);
               setCookie("BM2", getCookie("BM1"),  12);
               setCookie("BN1", getCookie("BN0"), 12);
               setCookie("BE1", getCookie("BE0"),  12);
               setCookie("BR1", getCookie("BR0"),  12);
               setCookie("BM1", getCookie("BM0"),  12);
               setCookie("BN0", node,12);
               setCookie("BE0", env,12);
               setCookie("BR0", reg,12);
               setCookie("BM0", name,12);
            } 
          } 
          setBread2("#bread0",0);
          setBread2("#bread1",1);
          setBread2("#bread2",2);
          setBread2("#bread3",3);


          $.ajaxSetup({ async: false });
          doTableChartRepeat("p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg ,guid,"t",0);
          var datamode = getCookieDefault("DMOD","sts");
          var offset=getCookie("OSET");

          if (getCookie("CPUOO") == "On" ){
               url = serviceUrl(env,datamode,"cpu",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "CPU",gp,url,env,reg,node,PT,chartjsTitle("CPU Utilization",hours,node,name,purpose) );
          }
          if (getCookie("MEMA") == "On" ){
               url = serviceUrl(env,"l"+datamode,"mema",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitle("Memory Available",hours,node,name,purpose) );
          }
          if (getCookie("MEMZ") == "On" ){
               url = serviceUrl(env,"l"+datamode,"memz",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,PT,chartjsTitle("Memory Utilization",hours,node,name,purpose) );
          }
          if (getCookie("MEMU") == "On" ){
               url = serviceUrl(env,"l"+datamode,"memu",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf( "NET",gp,url,env,reg,node,MB,chartjsTitle("Memory Usage",hours,node,name,purpose) );
          }
          if (getCookie("STATUS") == "On" ) {
             url = serviceUrl(env,"sts","statuscheck",node,reg,period,hours,offset);
             gp = panes[nextedpane++];
             snapPerf( "Line",gp,url,env,reg,node,"status",chartjsTitle("Status",hours,node,name,purpose) );
          }
          if (getCookie("NIB") == "On" ){
               url = serviceUrl(env,datamode,"netin",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitle("Net In",hours,node,name,purpose) );
          }
          if (getCookie("NOB") == "On" ){
               url = serviceUrl(env,datamode,"netout",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("NET",gp,url,env,reg,node,MB,chartjsTitle("Net Out",hours,node,name,purpose) );
          }
          var c = "";
          if (getCookie("DRO") == "On" ) {
               url = serviceUrl(env,datamode,"diskreadops",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,OP,chartjsTitle("Disk Reads Ops",hours,node,name,purpose) );
          }
          if (getCookie("DWO") == "On" ) {
               url = serviceUrl(env,datamode,"diskwriteops",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,OP,chartjsTitle("Disk Write Ops",hours,node,name,purpose) );
          }
          if (getCookie("DRB") == "On" ) {
               url = serviceUrl(env,datamode,"diskreadbytes",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,MB,chartjsTitle("Disk Reads Bytes",hours,node,name,purpose) );
          }
          if (getCookie("DWB") == "On" ) {
               url = serviceUrl(env,datamode,"diskwritebytes",node,reg,p,h,offset);
               gp = panes[nextedpane++];
               snapPerf("DISK",gp,url,env,reg,node,MB,chartjsTitle("Disk Write Bytes",hours,node,name,purpose) );
          }

     }
     // SNAPPERF 
     function snapPerf(cht,guid,url,env,reg,node,vlabel,label)        { 
          //logger(formatSelfNamedAnchor(url)+"<br>");
          //$("#"+guid).empty();
          chartjsDoChart(cht,url,guid,vlabel,node,label);
                // ****************************************
                // *** Auto Update Code
                // ****************************************
                // if ( cp > 0) 
                //     clientAreaInterval = setInterval(function() { chartjsDoChart(cht,url,guid,vlabel,node,label); }, cp);
     }


     function setBread2(sel, i) {
        var node = getCookie("BN" + i);
        var env  = getCookie("BE"  + i);
        var reg  = getCookie("BR"  + i);
        var name = getCookie("BM" + i); 
        var $sel = $(sel);
        if ( name == "") name = "not set\nyet";
        $sel.empty();
        var guid = appendAnchorWithGuid(sel,"bread","");
        var $guid = $("#"+guid);

        $guid.append(name);
        $guid.attr("title",env + " " + reg + "\n" + node);
        $sel.append("&nbsp;");
        $guid.on("click", function(e) {
             e.preventDefault();
             resetClientArea();
             var guid2 = appendDivWithGuid("#client_area");
             var url="p1?env="+env+"&op=performancenode&node="+node+"&filter=&loc="+reg;
             doTableChartRepeat(url ,guid2,"t",0);
        });
     }


     function resetNoteBar(hardreset) {
     $("#notebar").empty();
     $("#logger_area").empty();
     var g1 = openSettingsBar("notebar");
     var g2 = "";
     var ACCOUNTSET = [];
     var cmds = ["inv","cfg","str","vol","que","scg","usr","grp","tag","rle","ami","bil","bis","all","fll"]
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
         setCookie("CPUCT"+"DEX", 0, 12);
         setCookie("NETCT"+"DEX", 0, 12);
         setCookie("DISKCT"+"DEX", 0, 12);
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
     }
     var cls="uibutton confirm";
     setCookie("MENU", "hide", 12);
     myBCallBack(0,g1,cls,"menu","MENU",["hide","show"],menuCallBack);
     myB(0,g1,cls,"cmd","CMDSET",cmds);
     myB(0,g1,cls,"region","REGL",["E1","W1","W2","A1","A2","A3","U1","U2","S1"]);
     myB(0,g1,cls,"mode","DMOD",["sts","mts"]);
     myB(0,g1,cls,"zoom","ZOOM",["0","50","100","200","300","400","-25"]);
     myB(0,g1,cls,"hours","DHRS",["1","2","4","6","12","18","24","48","72","96","120","144","240"]);
     myB(0,g1,cls,"sample","PER",["60","180","300","600","90"]);
     myB(0,g1,cls,"offset","OSET",["0","12","18","24","30","36","48","60","72","96","120","144","240"]);
     myB(0,g1,cls,"cpu yaxe","YAXIS",["auto","100","50","25","10","5"]);
     myB(0,g1,cls,"cpu chrt","CPUCT",["Line","Col"]);
     myB(0,g1,cls,"n/m chrt","NETCT",["Line","Col"]);
     myB(0,g1,cls,"dsk chrt","DISKCT",["Line","Col"]);
     //myB(0,g1,cls,"sort","SORTKEY",["name","purpose","type","sys","id","envreg"]);
     myB(0,g1,cls,"charts","EXP",["One","Two","Three"]);
     cls="uitoggle confirm";
     var g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"status","STATUS",["Off","On"]);
     myBimpl(0,g2,cls,"cpu","CPUOO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"netin","NIB",["Off","On"]);
     myBimpl(0,g2,cls,"netout","NOB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"dskr","DRB",["Off","On"]);
     myBimpl(0,g2,cls,"dskw","DWB",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"dskrop","DRO",["Off","On"]);
     myBimpl(0,g2,cls,"dskwop","DWO",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"mema","MEMA",["Off","On"]);
     myBimpl(0,g2,cls,"memu","MEMU",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"memz","MEMZ",["Off","On"]);
     myBimpl(0,g2,cls,"bill","BCHT",["Off","On"]);
     g2 = addSettingsElement(g1);
     myBimpl(0,g2,cls,"disks","DISKMET",["Off","On"]);
     //myBimpl(0,g2,cls,"info","IM",["Off","On"]);
     myBimpl(0,g2,cls,"update","UPDT",["Off","On"]);
     //   var z2 = randomString(10);
     //   $("#'+g1).append("<table><tr><td id='z2'></td></tr></table>");
     //   myT(0,z2,"","","ETEST",["AAAA","BBBB"]);
     // myB(0,g1,"","env","ACCOUNTSET",ACCOUNTSET);
     closeSettingsBar("notebar");
     }


// JQ JQBEGIN    
jQuery(document).ready(function() {

        var $client_area = $("#client_area");
        $.ajaxSetup({ async: false });
        setCookie("ZOOM", 0, 12);
        var meup="";
        what="p1?op=version";
        $.getJSON( what, function( data ) { 
          $keycreds = $("#keycreds");
          $("#version").append("DLCDashboard " + data.rows[0].c[1].v);
          $("#tinyversion").append("DLCDashboard " + data.rows[0].c[1].v);
          $("#tinybanner").hide();
          var sz="";
          sz = getCookieDefault("AKY","");
          $keycreds.append("k:&nbsp;<input class='creds' type='text' size=22 name='key' id='key' value='"+sz+"'>");
          sz = getCookieDefault("ASY","");
          $keycreds.append("&nbsp;&nbsp;&nbsp;s:&nbsp;<input class='creds' type='text' size=38 name='secret' id='secret' value='"+sz+"'>");
          $keycreds.append("&nbsp;");
          $keycreds.append("&nbsp;");
          var guid = appendAnchorWithGuid("#keycreds","btnsmall","");
          $("#"+guid).empty().append("SET");
          $("#"+guid).on("click", function(e) {
               setCookie("AKY", $("#AKY").attr("value"), 12);
               setCookie("ASY", $("#ASY").attr("value"), 12);
          });
        });

        var sel="";
        var env="";
        var what="";
        var url="";
        var guid = "";
        var guid2 ="";
        var cls="modebtn";
        var ztable = "<table><tr><td id='z1'></td><td id='z2'></td><td id='z3'></td></tr></table>";

        //BUTTONS
if ( 1==1) {
     resetNoteBar(0);
     var temp="";
if ( 1 == 1 ) {
        guid = appendAnchorWithGuid("#bread4","btnsmall","");
        if (getCookie("LOCK") == "") setCookie("LOCK", "UNLOCKED", 12);
        $("#"+guid).empty().append(getCookie("LOCK"));
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             if (getCookie("LOCK") == "LOCKED") {
                  setCookie("LOCK", "UNLOCKED", 12);
             } else {
                  setCookie("LOCK", "LOCKED", 12);
             }
             $(this).empty().append(getCookie("LOCK"));
        });
}
        $("#fasttrack").append("<br><br>");

       setBread2("#bread0",0);
       setBread2("#bread1",1);
       setBread2("#bread2",2);
       setBread2("#bread3",3);
}
if ( 1 == 0 ) {
        var guid = randomString(10);
        env="ALL";
        $("#menu_area").append("<tr><td class='uibutton confirm' id='"+env+"'></td></tr>");
        $("#"+env).append(env);
        $("#"+env).on("click", function(e) {
             e.preventDefault();
             DAC(this.id); 
        });
}
        what="p1?op=accounts";
        $.getJSON( what, function( data ) { 
             for (i=0;i<data.rows.length;i++){
                  env=data.rows[i].c[1].v
                  $("#menu_area").append("<tr><td class='uibutton confirm' id='"+env+"'></td></tr>");
                  var $env = $("#"+env);
                  $env.append(env);
                  $env.attr("statcon",env);
                  $env.on("click", function(e) {
                       e.preventDefault();
                       DAC(this.id); 
                  });
             }
        });
        guid  = randomString(6);

        $client_area.append("<table width='100%'><tr><td valign='middle' align='middle' id='"+guid+"'><br>DLCDashboard</td></tr></table>");
        $("#"+guid).css({ 'color': 'Black', 'font-size': '510%'});
        guid  = randomString(6);
        $client_area.append("<table width='100%'><tr><td valign='middle' align='middle' id='"+guid+"'><br>All Rights Reserved</td></tr></table>");
        $("#"+guid).css({ 'color': 'Black', 'font-size': '110%'});

        guid  = randomString(6);
        $("#menu_area").append("<tr><td id='"+guid+"'><hr></td></tr>");

        $.ajaxSetup({ async: true });
if ( 1 == 0 ) {
        guid = uibuttonConfirmTR("#menu_area","PREV");  
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             var sz = stack.pop();
             if ( ! ( typeof sz === 'undefined' || sz === null ) )   $("#client_area").html(sz);
        });

}

        guid = uibuttonConfirmTR("#menu_area",SELECTEDITEMS + " SLCT");
        selectedbutton = guid;
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             $("#client_area").empty();
             doCpuTableChart();
        });


        guid = uibuttonConfirmTR("#menu_area","SETU");  
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             var $client_area = $("#client_area");
             $client_area.empty();
             $client_area.append(tableBy(1));
             var g2 = returnstack.pop();
             var g1 = returnstack.pop();
             var $sa = $("#"+g2);
             $sa.append("<table border=1>");
             myTextControl($sa,"Access Key 1",32,"AK1", 
                           function()  {return(options.ak1);},
                           function(s) {       options.ak1=s; alert(JSON.stringify(options)); }
                          );
             myTextControl($sa,"Secret Key 1",32,"SK1", 
                           function()  {return(options.sk1);},
                           function(s) {       options.sk1=s;}
                          );
             $sa.append("</table>");
             $client_area = $("#"+g1);
             $client_area.append("<table>");
             myTextControl($client_area,"Chart Area Width",8,"CHAW", 
                           function()  {return(options.chartArea.width);},
                           function(s) {       options.chartArea.width=s;}
                          );
             myTextControl($client_area,"Chart Area Height",8,"CHAH", 
                           function()  {return(options.chartArea.height);},
                           function(s) {       options.chartArea.height=s;}
                          );
             myTextControl($client_area,"Chart Width",8,"CHW", 
                           function()  {return(options.width);},
                           function(s) {       options.width=s;}
                          );
             myTextControl($client_area,"Chart Back-Color",8,"CHBC", 
                           function()  {return(options.backgroundColor);},
                           function(s) {       options.backgroundColor=s;}
                          );
             myTextControl($client_area,"Chart Height",8,"CHH", 
                           function()  {return(options.height);},
                           function(s) {       options.height=s;}
                          );
             myTextControl($client_area,"Line Width Zero",8,"LW0", 
                           function()  {return(options.series[0].lineWidth);},
                           function(s) {       options.series[0].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color Zero",8,"LC0", 
                           function()  {return(options.colors[0]);},
                           function(s) {       options.colors[0]=s;}
                          );
             myTextControl($client_area,"Line Width One",8,"LW1", 
                           function()  {return(options.series[1].lineWidth);},
                           function(s) {       options.series[1].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color One",8,"LC1", 
                           function()  {return(options.colors[1]);},
                           function(s) {       options.colors[1]=s;}
                          );
             myTextControl($client_area,"Line Width Two",8,"LW2", 
                           function()  {return(options.series[2].lineWidth);},
                           function(s) {       options.series[2].lineWidth=s;}
                          );
             myTextControl($client_area,"Line Color Two",8,"LC2", 
                           function()  {return(options.colors[2]);},
                           function(s) {       options.colors[2]=s;}
                          );
             myTextControl($client_area,"hAxis Text Font",8,"HXF", 
                           function()  {return(options.hAxis.textStyle.fontSize);},
                           function(s) {options.hAxis.textStyle.fontSize=s;}
                          );
             myTextControl($client_area,"hAxis Format",8,"HXFMT", 
                           function()  {return(options.hAxis.format);},
                           function(s) {options.hAxis.format=s;}
                          );
             $client_area.append("</table>");
             $client_area = $("#client_area");
if ( 1 == 0 ) {
             guid  = randomString(6);
             $("#client_area").append("<table width='50%' ><tr><td id='"+guid+"'></td></tr></table>");
             for (i=0;i<NODESET.length;i++)  {
             $("#client_area").append(NODESET[i] +","+ ENVSET[i] +","+ REGSET[i] +","+ NODENAMESET[i] +","+ PURPOSESET[i]+"<br>");
             }
             guid  = randomString(6);
             $("#client_area").append("<div id='"+guid+"'></div>");
             myB(160,guid,cls,"mil time","SET24",["On","Off","On","Off"]);
             myB(160,guid,cls,"font size","SETFONT",["default","smaller","bigger"]);
             myB(160,guid,cls,"chart update","UPCHT",["Off","On"]);
             myB(160,guid,cls,"update period","PDCHT",["0","7","15","30","60","120"]);
}
        });

        guid = uibuttonConfirmTR("#menu_area","NOUP");  
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             resetIntervals();
        });

        guid = uibuttonConfirmTR("#menu_area","RSET");  
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             resetNoteBar(1);
             resetselectpick();
             $("#client_area").empty();
             stack.length = 0;
        });

        guid = uibuttonConfirmTR("#menu_area","BILL");  
        $("#"+guid).on("click", function(e) {
               e.preventDefault();
               var guid1  = randomString(6);
               var guid2  = randomString(6);
               $.getJSON( "p1?op=zook", function(j) {
               $("#client_area").empty();
        // $("#client_area").append("<table><tr><td><div id='"+guid1+"'></div></td><td><div id='"+guid2+"'></div></td></tr></table>");
                 $("#client_area").append(tableBy(2));
                 var g2 = returnstack.pop();
                 var g1 = returnstack.pop();
                 var data = google.visualization.arrayToDataTable(j);
                 var chart = new google.visualization.PieChart(document.getElementById(g2));
                 chart.draw(data, {title: 'Charges Monthly', is3D: true } );
                 doTableChartRepeat("p1?env=VOID&op=zeek",g1 ,"Charges",-1);
               });
        });


        uibuttonConfirmTROne("#menu_area_foot",["P","B","S","R","A"]);  
        guid = returnstack.pop();
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
        });
        guid = returnstack.pop();
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='GREEN']").show();
        });
        guid = returnstack.pop();
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             $("#"+GlobalTableId +" tr").hide();
             $("#"+GlobalTableId +" tr[status='HEADER']").show();
             $("#"+GlobalTableId +" tr[status='RED']").show();
        });
        guid = returnstack.pop();
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             $("#client_area").empty();
             var guid2  = randomString(6);
             $("#client_area").append("<div id='"+guid2+"'></div>");
             doTableChartRepeat("p1?env=VOID&op=zeek",guid2 ,"Charges",-1);
        });
        guid = returnstack.pop();
        $("#"+guid).on("click", function(e) {
             e.preventDefault();
             if (window.print) window.print();
        });


        var spotguid  = randomString(6);
        $client_area.append("<center><table width='74%'><tr><td id='"+spotguid+"'></td></tr></table></center>");
        snapPerf("CPU",spotguid,"p1?op=fakedata","","","","value","sample data");

});

