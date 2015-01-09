/*************************************************************************
 float.js 1.0 Copyright (c) 2013 - 2015 Heinrich Schweitzer
 Contact me at hgs@hgsweb.de
 This copyright notice MUST stay intact for use.
 
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 'Software'), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ***************************************************************************/

/*//////////////////////////////////////////////////////////////
 Creates divs to mimic the table header.
 
 This header is allways displayed at the top of the table, if
 the original header is scrolled out of view.
 
 To use this function your table must have an id speficied.
 Once alle tables are rendered you call floatHeader(tableId,head),
 this returns the header object.
 
 /////////////////////////////////////////////////////////////*/

function floatHeader(tableId, head) {
    'use strict';
    var mytable
            , row = [], flo, myBody, scrollParent, tableParent, padding = 4
            , i, nc, nr, th, delta, debug = false, topDif = 0, leftDif = 0
            , theHead, topLeftCorner = {style: null}, theLeftColumn = {style: null}, lcw = 0, setFloAgain = true;

    function rotate90(tableId) {
        // 
        // if a TH-cell carries the data-rotate attribute 
        // we rotate it 90 degrees counter clock wise
        //
        var aRows = document.getElementById(tableId).rows, padding = 4;
        [].every.call(aRows, function (row) {
            if (row.cells[0].tagName !== 'TH') {
                return false;
            }
            rotateCell(row);
            return true;
        });
        function rotateCell(row) {
            var maxw = -1;
            [].forEach.call(row.cells, function (cell) {
                var w;
                if (!cell.hasAttribute("data-rotate")) {
                    cell.vAlign = 'bottom';
                    return;
                }
                cell.vAlign = 'middle';
                cell.innerHTML = '<div class=hgs_rotate>' + cell.innerHTML + '</div>';
                w = cell.firstChild.clientWidth;
                if (w > maxw) {
                    maxw = w;
                    cell.style.height = maxw + padding + 'px';
                }
                cell.firstChild.style.width = cell.firstChild.clientHeight + 'px';
            });
            if (maxw === -1) {
                return;
            }
            [].forEach.call(row.cells, function (cell) {
                var dd;
                if (!cell.hasAttribute("data-rotate")) {
                    return;
                }
                dd = cell.firstChild;
                dd.style.top = (cell.clientHeight - dd.clientHeight - padding) / 2 + 'px';
                dd.style.left = '0px';
                dd.style.position = 'relative';

            });
        }
    }
    rotate90(tableId); // rotate header cell if any ..

    function setAtt(s, o) {
        var opt;
        for (opt in o) {
            s[opt] = o[opt];
        }
        return s;
    }

    function absPos(obj) {// return absolute x,y position of obj

        var ob, x = obj.offsetLeft, y = obj.offsetTop;
        ob = obj.offsetParent;
        while (ob !== null && ob.tagName !== 'BODY') {
            x += ob.offsetLeft;
            y += ob.offsetTop;
            ob = ob.offsetParent;
        }
        return {'x': x, 'y': y};
    }
    function createDivHead(mytable, id, x) {
        var div = document.createElement('div');
        setAtt(div, {id: id + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {
            width: mytable.clientWidth + 'px',
            left: x + 'px',
            position: 'absolute',
            background: 'black',
            display: 'none',
            zIndex: 15
        }
        );
        return div;
    }
    function createDivLeftColumn(mytable, x) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatleftcolumn_' + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {zIndex: 12,
            background: 'black',
            left: x + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px',
            position: 'absolute',
            display: 'none'}
        );
        return div;
    }
    function createHeaderCell(theCell, top, ci) {
        var div = document.createElement('div');
        div = updateHeaderCell(div, theCell, top, ci);
        return div;
    }
    function updateHeaderCell(div, theCell, top, ci) {
        var bs = '', es = '', cpStyle;
        if (!theCell.hasAttribute("data-rotate")) {
            bs = '<span>';
            es = '</span>';
        }
        setAtt(div, {className: 'floatHead ' + theCell.className,
            innerHTML: bs + theCell.innerHTML + es,
            vAlign: theCell.vAlign,
            title: theCell.title,
            cellIndex: ci}
        );
        if (theCell.hasAttribute("data-rotate")) {
            div.firstChild.style.top = theCell.clientHeight - theCell.firstChild.clientHeight - padding + 'px';
        }
        cpStyle = window.getComputedStyle(theCell, null);
        setAtt(div.style, {
            background: theCell.style.background,
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px',
            position: 'absolute',
            borderTop: cpStyle.borderTopWidth + ' ' + cpStyle.borderTopStyle + ' ' + cpStyle.borderTopColor,
            borderLeft: cpStyle.borderLeftWidth + ' ' + cpStyle.borderLeftStyle + ' ' + cpStyle.borderLeftColor,
            borderBottom: cpStyle.borderBottomWidth + ' ' + cpStyle.borderBottomStyle + ' ' + cpStyle.borderBottomColor,
            borderRight: cpStyle.borderRightWidth + ' ' + cpStyle.borderRightStyle + ' ' + cpStyle.borderRightColor,
            fontFamily: cpStyle.fontFamily,
            fontSize: cpStyle.fontSize
        });
        return div;
    }
    function createLeftColumn(theCell, top, ci, ri) {
        var div = document.createElement('div');
        updateLeftColumn(div, theCell, top, ci, ri);
        return div;
    }
    function updateLeftColumn(div, theCell, top, ci, ri) {
        var cpStyle;
        setAtt(div, {className: 'floatCol ' + theCell.className + ' ' + theCell.parentNode.className,
            innerHTML: theCell.innerHTML,
            cellIndex: ci,
            rowIndex: ri}
        );
        cpStyle = window.getComputedStyle(theCell, null);
        setAtt(div.style, {
            background: theCell.style.background,
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px',
            height: theCell.clientHeight + 'px',
            borderTop: cpStyle.borderTopWidth + ' ' + cpStyle.borderTopStyle + ' ' + cpStyle.borderTopColor,
            borderLeft: cpStyle.borderLeftWidth + ' ' + cpStyle.borderLeftStyle + ' ' + cpStyle.borderLeftColor,
            borderBottom: cpStyle.borderBottomWidth + ' ' + cpStyle.borderBottomStyle + ' ' + cpStyle.borderBottomColor,
            borderRight: cpStyle.borderRightWidth + ' ' + cpStyle.borderRightStyle + ' ' + cpStyle.borderRightColor,
            fontFamily: cpStyle.fontFamily,
            fontSize: cpStyle.fontSize,
            position: 'absolute'}
        );
        return div;
    }
    function setLeftColumnGeometry(head) {
        setAtt(theLeftColumn.style, {
            top: absPos(mytable.rows[head.ncpth.length].cells[0]).y - 0 + 'px',
            left: flo.x + 'px',
            height: mytable.clientHeight - mytable.rows[head.ncpth.length].offsetTop + 'px',
            width: lcw + 1 + 'px',
            position: 'absolute'});
    }
    function setTopLeftCornerGeometry() {
        setAtt(topLeftCorner.style, {
            //borderRight: '1px solid black',
            height: theHead.style.height,
            left: flo.x + 'px',
            top: absPos(mytable.rows[0]).y + 'px',
            width: lcw + 1 + 'px',
            position: 'absolute'}
        );
        theHead.rightEdge = topLeftCorner.rightEdge;
    }
    function setTableHeadGeometry() {
        setAtt(theHead.style, {
            left: flo.x + 'px',
            top: flo.y + 'px',
            width: mytable.clientWidth + 'px',
            position: 'absolute'});
    }
    function setFlo(flo) {
        var nr, nc;
        flo.dx = 0;
        flo.dy = 0;
        if (tableParent !== document.body) {
            flo.dy = absPos(tableParent).y;
            flo.dx = absPos(tableParent).x;
            flo.y = flo.y - flo.dy;
            flo.x = flo.x - flo.dx;
        }
        nr = mytable.rows.length;
        nc = mytable.rows[nr - 1].cells.length;
        flo.lcw = mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        flo.yEdge = flo.y + mytable.clientHeight - theHead.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
        flo.xEdge = flo.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        flo.right = flo.x + mytable.clientWidth - 1;
        flo.bottom = flo.y + mytable.clientHeight - 1;
        flo.ylc = absPos(mytable.rows[head.ncpth.length]).y;
        flo.sx = -1;
        flo.sy = -1;
        return flo;
    }

    function fillContainers() {
        var row, aCell, i, ri, th;
        for (ri = 0; ri < mytable.rows.length; ri++) {
            row = mytable.rows[ri];
            if (ri < head.ncpth.length ) {
                ///////////////////////
                //// header column cells  now
                ///////////////////////
                nc = row.cells.length;
                for (i = 0; i < nc; i++) { // copy content of header cells from table   
                    aCell = row.cells[i];
                    th = createHeaderCell(aCell, aCell.offsetTop, i);
                    theHead.appendChild(th);
                    th.style.height = aCell.clientHeight + 'px';
                    if (head.nccol === 0) {
                        continue; // header only
                    }
                    if (i < head.ncpth[ri]) {// copy cells into top left corner div  
                        th = createHeaderCell(aCell, aCell.offsetTop, i);
                        topLeftCorner.appendChild(th);
                        th.style.height = aCell.clientHeight + 'px';
                    }
                }
                theHead.style.height = row.offsetTop + row.clientHeight + 'px';
                theHead.rightEdge = 0;
                continue;
            }
            ///////////////////////
            //// left column cells  now
            ///////////////////////
            if (head.nccol > 0) {
                delta = mytable.rows[head.ncpth.length].offsetTop;
                for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                    aCell = row.cells[i];
                    th = createLeftColumn(aCell, aCell.offsetTop - delta, i, row.rowIndex);
                    theLeftColumn.appendChild(th);
                }
            } else {
                break; // header only we are done 
            }
        }
    }   

////////////////////////////////////////////////////////////////////////
///////////////////////////// Main /////////////////////////////////////
////////////////////////////////////////////////////////////////////////

    /**********************************************************************
     *************** FIRST BLOCK OF LOGIC: CONSTRUCTION*********************
     ***********************************************************************/

    mytable = document.getElementById(tableId);
    myBody = document.getElementById(tableId + '_parent');
    if (myBody !== null) {
        tableParent = myBody;
        scrollParent = tableParent;
    } else {
        tableParent = document.body;
        scrollParent = window;
    }

    head = head || {};
    if (typeof head.ncpth === 'undefined') {
        head.ncpth = [];
        head.nccol = 0; // default  
        head.topDif = 0;
        head.leftDif = 0;
    } else {
        topDif = 0;
        if (typeof head.topDif !== 'undefined') {
            topDif = head.topDif + 0;
        }
        leftDif = 0;
        if (typeof head.leftDif !== 'undefined') {
            leftDif = head.leftDif;
        }
    }
    //
    /// create necessary containers
    //
    flo = absPos(mytable);
    theHead = createDivHead(mytable, 'float_', flo.x); //container for  entire header
    tableParent.appendChild(theHead);
    if (head.nccol > 0) {
        topLeftCorner = createDivHead(mytable, 'float_corner', flo.x); //container top left corener
        tableParent.appendChild(topLeftCorner);
        theLeftColumn = createDivLeftColumn(mytable, flo.x); //container  left column      
        tableParent.appendChild(theLeftColumn);
    }
    //
    // fill container with cells
    //
    fillContainers();
    //
    // set all geometry and container positions we need, hide them
    //
    setTableHeadGeometry();
    theHead.style.display = 'none';
    if (head.nccol > 0) {
        row = mytable.rows[mytable.rows.length - 1];
        lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
        setLeftColumnGeometry(head);
        theLeftColumn.style.display = 'none';
        setTopLeftCornerGeometry();
        topLeftCorner.style.display = 'none';
    }
    //
    // flo keeps all neccessary Geometry
    //
    flo = setFlo(flo);
    if (tableParent !== document.body) {
        tableParent.style.position = 'relative';
    }
    if (debug) {
        theHead.style.display = 'block';
        if (head.nccol > 0) {
            topLeftCorner.style.display = 'block';
            theLeftColumn.style.display = 'block';
        }
    }

    /**********************************************************************
     ************ SECOND BLOCK OF LOGIC: SCROLLING *************************
     ***********************************************************************/



    theHead.hsync = function (x, y) {
        var t = this.style;
        if (t.position === 'fixed') {
            t.position = 'absolute';
            t.left = flo.x + 'px';
            t.top = y + 'px';
        }
    };
    theHead.vsync = function (x, y) {
        var t = this.style;
        if ((y < flo.y || y > flo.bottom)) {
            t.display !== 'none' ? t.display = 'none' : '';
            return;
        }
        t.display === 'none' ? t.display = '' : '';
        if (t.position !== 'fixed') {
            t.position = 'fixed';
            t.left = flo.x - x + leftDif + 'px';
            t.top = topDif + 'px';
        }
    };
    theLeftColumn.hsync = function (x, y) {
        var t = this.style, tt = this.topLeftCorner.style;
        if (t === null) {
            return;
        }
        if ((x - 1 < flo.x || x > flo.xEdge)) {
            t.display !== 'none' ? t.display = 'none' : '';
            t.position = 'absolute';
            tt.display = t.display;
            tt.position = t.position;
            return;
        }
        t.display === 'none' && y < flo.bottom ? t.display = '' : '';
        if (t.position === 'absolute') {
            t.position = 'fixed';
            t.left = leftDif + 'px';
            t.top = (flo.ylc - y) + topDif - 0 + 'px';
        }
        tt.display === 'none' && y < flo.bottom ? tt.display = '' : '';
        if (tt.position === 'absolute') { // the corner
            tt.position = 'fixed';
            tt.left = leftDif + 'px';
            if (y <= flo.y) {
                tt.top = (flo.y - y) + topDif + 'px';
            } else {
                tt.top = topDif + 'px';
            }
        }
    };
    theLeftColumn.vsync = function (x, y) {
        var t = this.style, tt = this.topLeftCorner.style;
        if (t === null) {
            return;
        }
        if (y > flo.bottom || x > flo.xEdge) {
            t.display !== 'none' ? t.display = 'none' : '';
            tt.display === t.display ? '' : tt.display = t.display;
            return;
        }
        if (flo.x < x - 1 && t.display === 'none') {
            t.display = '';
            tt.display = t.display;
        }
        if (t.display !== 'none') {
            if (t.position === 'fixed') {
                t.position = 'absolute';
                t.top = flo.ylc + 'px';
                t.left = parseInt(t.left, 10) + x - leftDif + 'px';
                return;
            }
        }
        if (tt.display !== 'none') { // the corner
            if (tt.position === 'absolute') {
                if (y > flo.y) {
                    tt.position = 'fixed';
                    tt.top = topDif + 'px';
                    tt.left = leftDif + 'px';
                }
            } else {
                if (y < flo.y) {
                    tt.position = 'absolute';
                    tt.top = flo.y + 'px';
                    tt.left = x + 'px';
                }
            }
        }
    };
    theHead.vsyncR = function (x, y) {
        var t = this.style;
        if ((y - 1 < flo.y || y > flo.bottom)) {
            t.display !== 'none' ? t.display = 'none' : '';
            return;
        }
        t.display === 'none' ? t.display = '' : '';
        if (t.display !== 'none') {
            t.position !== 'absolute' ? t.position = 'absolute' : '';
            t.left = flo.x + 'px';
            t.top = y + 'px';
        }
    };
    theLeftColumn.hsyncR = function (x, y) {
        var t = this.style, tt = this.topLeftCorner.style;
        if (t === null) {
            return;
        }
        if ((x < flo.x || x > flo.xEdge)) {
            t.display !== 'none' ? t.display = 'none' : '';
            tt.display === t.display ? '' : tt.display = t.display;
            t.position = 'absolute';
            return;
        }
        t.display === 'none' ? t.display = '' : '';
        if (tt.display === 'none') {
            tt.top = flo.y + y + 'px';
        }
        tt.display === 'none' ? tt.display = '' : '';
        t.top = flo.ylc - flo.dy + 'px';
        if (t.position === 'absolute') {
            t.left = x + 'px';
        }
        tt.left = /*flo.x  +*/ x + 'px';
    };
    theLeftColumn.vsyncR = function (x, y) {
        var t = this.style, tt = this.topLeftCorner.style;
        if (t === null) {
            return;
        }
        if (y > flo.bottom) {
            t.display !== 'none' ? t.display = 'none' : '';
            tt.display = t.display;
            return;
        }
        if (flo.x < x && t.display === 'none') {
            t.display = '';
        }
        if (t.display !== 'none') {
            t.position !== 'absolute' ? t.position = 'absolute' : '';
            if (t.top !== flo.ylc - flo.dy + 'px') {
                t.top = flo.ylc - flo.dy + 'px';
                t.left = 0 + 'px';
            }
            y = y > flo.y ? -flo.y + y : 0;
            tt.top = flo.y + y + 'px';
            return;
        }
    };
    function debugR(w, t, tt) {
        var dd = document.getElementById('debug');
        dd.innerHTML = 'wo=' + w + '    tt.top=' + tt.top + '  tt.left=' + tt.left + ' t.top=' + t.top + '  t.left=' + t.left;
    }
    function scrollBody() {
        var y, x;
        y = window.pageYOffset + topDif;
        x = window.pageXOffset + leftDif;

        if (setFloAgain) {
            setFloAgain = false;
            flo.y = absPos(mytable).y;
            flo.x = absPos(mytable).x;
            flo = setFlo(flo);
        }

        if (flo.sy !== y) {// vertical scrolling
            flo.sy = y;
            theHead.vsync(x, y);
            theLeftColumn.vsync(x, y);
        }
        if (flo.sx !== x) { // horizontal scrolling
            flo.sx = x;
            theHead.hsync(x, y);
            theLeftColumn.hsync(x, y);
        }
    }
    function scrollDiv(e) {
        var y, x;
        if (typeof e !== 'undefined') {
            y = e.target.scrollTop;
            x = e.target.scrollLeft;
        } else {
            flo.sy++;
            flo.sx++;
        }
        if (flo.sy !== y) {// vertical scrolling
            flo.sy = y;
            theHead.vsyncR(x, y);
            theLeftColumn.vsyncR(x, y);
        }
        if (flo.sx !== x) { // horizontal scrolling
            flo.sx = x;
            theLeftColumn.hsyncR(x, y);
        }
    }
    if (tableParent === document.body) {
        theHead.scroll = scrollBody;
    } else {
        theHead.scroll = scrollDiv;
    }

    /*********************************************************************
     *********** THIRD BLOCK OF LOGIC: SYNCHRONIZATION ********************
     ***********************************************************************/


    function copyHeaderAndCorner(mytable, head) {
        var i, j, k, l, nr, nc, row, aCell, th;
        nr = mytable.rows.length;
        theHead.style.display = 'none';
        theHead.topLeftCorner.style !== null ? theHead.topLeftCorner.style.display = 'none' : '';
        for (k = 0, j = 0, l = 0; k < nr; k++) {
            if (mytable.rows[k].cells[0].tagName !== 'TH') {
                break;
            }
            row = mytable.rows[k];
            nc = row.cells.length;
            for (i = 0; i < nc; i++) { // copy content of header cells from table   
                aCell = row.cells[i];
                th = updateHeaderCell(theHead.childNodes[j++], aCell, aCell.offsetTop, i);
                th.style.height = aCell.clientHeight + 'px';
                if (k < head.ncpth.length && i < head.ncpth[k]) {// copy cells into top left corner div  
                    th = updateHeaderCell(topLeftCorner.childNodes[l++], aCell, aCell.offsetTop, i);
                    th.style.height = aCell.clientHeight + 'px';
                }
            }
        }
        theHead.style.display = '';
        theHead.topLeftCorner.style !== null ? theHead.topLeftCorner.style.display = 'none' : '';
    }


    function  rowAddDelete() {
        //
        // check if rows have been added or deleted  
        // from original table.
        //                 
        var diff, nr, aCell, i, aCell;
        nr = mytable.tBodies[0].rows.length;
        if (mytable.tHead === null) {
            nr = nr - head.ncpth.length;
        }
        diff = nr * head.nccol - theHead.theLeftColumn.childNodes.length;
        theHead.theLeftColumn.style.display = 'none'; // to avoid DOM repaint
        if (diff > 0) {// add cells for pseudo rows
            aCell = mytable.rows[nr - 1].cells[0]; // any cell will do
            for (i = 0; i < diff; i++) { // copy content of a column cell ;
                th = createLeftColumn(aCell, aCell.offsetTop - delta, i, nr - 1);
                theHead.theLeftColumn.appendChild(th);
            }
        }
        else if (diff < 0) { //delete cells of pseudo rows
            for (i = 0; i < -diff; i++) {
                theHead.theLeftColumn.removeChild(theHead.theLeftColumn.childNodes[0]);
            }
        }
        syncLeftColumn();
    }
    ;
    function syncLeftColumn() {
        var nr, aCell, j, k, kd = 0, i, ntc, tflccn;
        //////////////////////////////
        /// brute force sync/rearange left columns
        /// //////////////////////////
        nr = mytable.tBodies[0].rows.length;
        if (mytable.tHead === null) {
            kd = head.ncpth.length;
        }
        ntc = theHead.theLeftColumn.childNodes.length;
        tflccn = theHead.theLeftColumn.childNodes;
        theHead.theLeftColumn.style.display = 'none'; // to avoid DOM repaint
        for (k = kd, j = 0; k < nr; k++) {
            row = mytable.tBodies[0].rows[k];
            for (i = 0; i < head.nccol && j < ntc; i++, j++) { // copy content of column cells from table   
                aCell = row.cells[i];
                updateLeftColumn(tflccn[j], aCell, aCell.offsetTop - delta, i, row.rowIndex);
            }
        }
        theHead.theLeftColumn.style.display = ''; // go back to previous state
        return;
    }
    function syncHeadAndCorner() { // method to force a new layout of pseudo header
        var aCell;
        flo = absPos(mytable);
        copyHeaderAndCorner(mytable, head);
        if (head.nccol > 0) {
            rowAddDelete();
            aCell = mytable.rows[head.ncpth.length].cells[head.nccol - 1];
            lcw = aCell.offsetLeft + aCell.clientWidth;
            setLeftColumnGeometry(head);
            setTopLeftCornerGeometry();
        }
        setTableHeadGeometry();
        // flo keeps all neccessary Geometry    
        flo = setFlo(flo);
    }

    function addEvent(obj, ev, fu) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fu, false);
        } else {
            obj.attachEvent('on' + ev, fu);
        }
    }
    theHead.sync = function (ri, what) {
        syncHeadAndCorner();
        flo.sx = -1;
        flo.sy = -1;
        theHead.scroll();
    };

    addEvent(scrollParent, 'scroll', theHead.scroll);
    // pointers to corner and left column;
    theHead.topLeftCorner = topLeftCorner;
    theHead.theLeftColumn = theLeftColumn;
    theLeftColumn.topLeftCorner = topLeftCorner;
    return theHead;
}