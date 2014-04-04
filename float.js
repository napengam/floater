/*************************************************************************
 float.js 1.0 Copyright (c) 2013 Heinrich Schweitzer
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
 
 To use this funtion your table must have an id speficied.
 Once alle tables are rendered you call floatHeader(tableId,head),
 this returns the header object.
 
 /////////////////////////////////////////////////////////////*/

function floatHeader(tableId, head) {
    'use strict';
    var mytable
            , row = [], flo, myBody, scrollParent, tableParent
            , i, nc, nr, th, delta, debug = false
            , tf, tlc = {style: null}, lc = {style: null}, lcw = 0;


    function setAtt(s, o) {
        var opt;
        for (opt in o) {
            s[opt] = o[opt];
        }
        return s;
    }
    function absPos(obj) {// return absolute x,y position of obj
        var ob, pos = {};
        pos.x = obj.offsetLeft;
        pos.y = obj.offsetTop;
        ob = obj.offsetParent;
        while (ob !== null && ob.tagName !== 'BODY') {
            pos.x += ob.offsetLeft;
            pos.y += ob.offsetTop;
            ob = ob.offsetParent;
        }
        return pos;
    }
    function createDivHead(mytable, id, x) {
        var div = document.createElement('div');
        setAtt(div, {id: id + mytable.id,
            className: 'outerFloatHead',
            see: false}
        );
        setAtt(div.style, {
            width: mytable.clientWidth + 'px',
            left: x + 'px',
            position: 'absolute',
            zIndex: 15
        }
        );
        return div;
    }
    function createDivLeftColumn(mytable, x) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatleftcolumn_' + mytable.id,
            className: 'outerFloatHead',
            see: false}
        );
        setAtt(div.style, {zIndex: 12,
            //background: 'yellow',
            left: x + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px',
            position: 'absolute'}
        );
        return div;
    }
    function createHeaderCell(theCell, top, ci, flag) {
        var div = document.createElement('div');
        div=updateHeaderCell(div, theCell, top, ci, flag);
        return div;
    }
    function updateHeaderCell(div, theCell, top, ci, flag) {
        var p = 'absolute';
        setAtt(div, {className: 'floatHead ' + theCell.className,
            innerHTML: theCell.innerHTML,
            vAlign: theCell.vAlign,
            cellIndex: ci}
        );
        if (theCell.hasAttribute("data-rotate") && flag === 1) {
            p = p;//'relative';
            div.firstChild.style.top = theCell.clientHeight - theCell.firstChild.clientHeight + 'px';
        }
        setAtt(div.style, {
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px',
            position: p
        });
        return div;
    }
    function createLeftColumn(theCell, top, ci, ri) {
        var div = document.createElement('div');
        updateLeftColumn(div, theCell, top, ci, ri);
        return div;
    }
    function updateLeftColumn(div, theCell, top, ci, ri) {
        setAtt(div, {className: 'floatCol ' + theCell.className + ' ' + theCell.parentNode.className,
            innerHTML: theCell.innerHTML,
            cellIndex: ci,
            rowIndex: ri}
        );
        setAtt(div.style, {
            background: theCell.style.background,
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px',
            height: theCell.clientHeight + 'px',
            position: 'absolute'}
        );
        return div;
    }
    function setLeftColumngeometry(head) {
        setAtt(lc.style, {
            top: absPos(mytable.rows[head.ncpth.length].cells[0]).y + 'px',
            left: flo.x + 'px',
            height: mytable.clientHeight - mytable.rows[head.ncpth.length].offsetTop + 'px',
            width: lcw + 'px',
            position: 'absolute'});
    }
    function setTopLeftCornergeometry() {
        setAtt(tlc.style, {
            borderRight: '1px solid black',
            height: tf.style.height,
            left: flo.x + 'px',
            top: absPos(mytable.rows[head.ncpth.length]).y + 'px',
            width: lcw + 2 + 'px',
            position: 'absolute'}
        );
        tf.rightEdge = tlc.rightEdge;
    }
    function setTableHeadgeometry() {
        setAtt(tf.style, {
            left: flo.x + 'px',
            top: flo.y + 'px',
            width: mytable.clientWidth + 'px',
            position: 'absolute'});
    }
    function setFlo(flo) {
        var nr;
        flo.dx = 0;
        flo.dy = 0;
        if (tableParent !== document.body) {
            flo.dy = absPos(tableParent).y;
            flo.dx = absPos(tableParent).x;
            flo.y = flo.y - flo.dy;
            flo.x = flo.x - flo.dx;
        }
        nr = mytable.rows.length;
        flo.lcw = mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        flo.yEdge = flo.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
        flo.xEdge = flo.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        flo.right = flo.x + mytable.clientWidth - 1;
        flo.bottom = flo.y + mytable.clientHeight - 1;
        flo.ylc = absPos(mytable.rows[head.ncpth.length]).y;
        flo.sx = -1;
        flo.sy = -1;
        return flo;
    }
    function withRows(row, ri) {
        var aCell, i,th;
        if (row.cells[0].tagName === 'TH') {
            ///////////////////////
            //// header column cells  only
            ///////////////////////
            nc = row.cells.length;
            for (i = 0; i < nc; i++) { // copy content of header cells from table   
                aCell = row.cells[i];
                th = createHeaderCell(aCell, aCell.offsetTop, i, 1);
                tf.appendChild(th);
                th.style.height = aCell.clientHeight + 'px';
                if (ri < head.ncpth.length && i < head.ncpth[ri]) {// copy cells into top left corner div  
                    th = createHeaderCell(aCell, aCell.offsetTop, i, 1);
                    tlc.appendChild(th);
                    th.style.height = aCell.clientHeight + 'px';
                }
            }
            tf.style.height = row.offsetTop + row.clientHeight + 'px';
            tf.rightEdge = 0;
            return true; // next row
        }
        ///////////////////////
        //// left column cells  only
        ///////////////////////
        if (head.nccol > 0) {
            delta = mytable.rows[head.ncpth.length].offsetTop;
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                aCell = row.cells[i];
                th = createLeftColumn(aCell, aCell.offsetTop - delta, i, row.rowIndex);
                lc.appendChild(th);
            }
            return true; // next row
        }
        return false; // stop every;
    }

////////////////////////////////////////////////////////////////////////
///////////////////////////// Main /////////////////////////////////////
////////////////////////////////////////////////////////////////////////
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
    flo = absPos(mytable);
    tf = createDivHead(mytable, 'float_', flo.x); // entire header
    if (typeof head.ncpth === 'undefined') {
        head.ncpth = [];
        head.nccol = 0; // default  
    } else {
        tlc = createDivHead(mytable, 'float_corner', flo.x); // top left corener
        lc = createDivLeftColumn(mytable, flo.x); //  left column      
        tableParent.appendChild(lc);
    }
    tableParent.appendChild(tf);
    nr = mytable.rows.length;
    if (head.nccol > 0) {
        tableParent.appendChild(tlc);
    }
    for (i = 0; i < mytable.rows.length; i++) {
        withRows(mytable.rows[i], i);
    }

    nr = mytable.rows.length;
    nc = mytable.rows[nr - 1].cells.length;
    if (head.nccol > 0) {
        row = mytable.rows[nr - 1];
        lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
        setLeftColumngeometry(head);
        lc.style.display = 'none';
        setTopLeftCornergeometry();
        tlc.style.display = 'none';
    }

    setTableHeadgeometry();
    tf.style.display = 'none';
    // flo keeps all neccessary geometry
    flo = setFlo(flo);
    if (tableParent !== document.body) {
        tableParent.style.position = 'relative';
    }
    if (debug) {
        tf.style.display = 'block';
        if (head.nccol > 0) {
            tlc.style.display = 'block';
            lc.style.display = 'block';
        }
    }
    tf.hsync = function(x, y) {
        var t = this.style;
        if (t.position === 'fixed') {
            t.position = 'absolute';
            t.left = flo.x + 'px';
            t.top = y + 'px';
        }
    };
    tf.vsync = function(x, y) {
        var t = this.style;
        if ((y < flo.y || y > flo.bottom)) {
            t.display !== 'none' ? t.display = 'none' : '';
            return;
        }
        t.display === 'none' ? t.display = '' : '';
        if (t.position !== 'fixed') {
            t.position = 'fixed';
            t.left = flo.x - x + 'px';
            t.top = 0 + 'px';
        }
    };
    tf.vsyncR = function(x, y) {
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
    lc.hsync = function(x, y) {
        var t = this.style, tt = this.tlc.style;
        if (t === null)
            return;
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
            t.left = 0 + 'px';
            t.top = flo.ylc - y + 'px';
        }
        tt.display === 'none' && y < flo.bottom ? tt.display = '' : '';
        if (tt.position === 'absolute') { // the corner
            tt.position = 'fixed';
            tt.left = '0px';
            if (y <= flo.y) {
                tt.top = (flo.y - y) + 'px';
            } else {
                tt.top = '0px';
            }
        }
    };
    lc.vsync = function(x, y) {
        var t = this.style, tt = this.tlc.style;
        if (t === null)
            return;
        if (y > flo.bottom || x > flo.xEdge) {
            t.display !== 'none' ? t.display = 'none' : '';
            tt.display = t.display;
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
                t.left = parseInt(t.left) + x + 'px';
                return;
            }
        }
        if (tt.display !== 'none') { // the corner
            if (tt.position === 'absolute') {
                if (y > flo.y) {
                    tt.position = 'fixed';
                    tt.top = 0 + 'px';
                    tt.left = 0 + 'px';
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
    lc.hsyncR = function(x, y) {
        var t = this.style, tt = this.tlc.style;
        if (t === null)
            return;
        if ((x < flo.x || x > flo.xEdge)) {
            t.display !== 'none' ? t.display = 'none' : '';
            tt.display = t.display;
            t.position = 'absolute';
            return;
        }
        t.display === 'none' ? t.display = '' : '';
        if (tt.display === 'none') {
            tt.top = flo.y + 'px';
        }
        tt.display === 'none' ? tt.display = '' : '';
        t.top = flo.ylc - flo.dy + 'px';
        if (t.position === 'absolute') {
            t.left = x + 'px';
        }
        tt.left = /*flo.x  +*/ x + 'px';
    };
    lc.vsyncR = function(x, y) {
        var t = this.style, tt = this.tlc.style;
        if (t === null)
            return;
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
    if (tableParent === document.body) {
        tf.scroll = function() {
            var y, x;
            y = window.pageYOffset;
            x = window.pageXOffset;
            if (flo.sy !== y) {// vertical scrolling
                flo.sy = y;
                tf.vsync(x, y);
                lc.vsync(x, y);
            }
            if (flo.sx !== x) { // horizontal scrolling
                flo.sx = x;
                tf.hsync(x, y);
                lc.hsync(x, y);
            }
        };
    } else {
        tf.scroll = function(e) {
            var y, x;
            if (typeof e !== 'undefined') {
                y = e.target.scrollTop;
                x = e.target.scrollLeft;
            } else {
                flo.sy++;
                flo.xs++;
            }
            if (flo.sy !== y) {// vertical scrolling
                flo.sy = y;
                tf.vsyncR(x, y);
                lc.vsyncR(x, y);
            }
            if (flo.sx !== x) { // horizontal scrolling
                flo.sx = x;
                lc.hsyncR(x, y);
            }
        };
    }
    tf.sync = function(ri, what) {
        tf.syncRow(ri, what);
        flo.sx = -1;
        flo.sy = -1;
        tf.scroll();
    };
    tf.syncRow = function(ri, what) { // method to force a new layout of pseudo header
        var mytable, nc, nr, k, i, j, l, th, aCell, row;
        mytable = document.getElementById(this.id.split('_')[1]);
        nr = mytable.rows.length;
        flo = absPos(mytable);
        for (k = 0, j = 0, l = 0; k < nr; k++) {
            if (mytable.rows[k].cells[0].tagName !== 'TH') {
                break;
            }
            row = mytable.rows[k];
            nc = row.cells.length;
            for (i = 0; i < nc; i++) { // copy content of header cells from table   
                aCell = row.cells[i];
                th = updateHeaderCell(tf.childNodes[j++], aCell, aCell.offsetTop, i);
                th.style.height = aCell.clientHeight + 'px';
                if (k < head.ncpth.length && i < head.ncpth[k]) {// copy cells into top left corner div  
                    th = updateHeaderCell(tlc.childNodes[l++], aCell, aCell.offsetTop, i);
                    th.style.height = aCell.clientHeight + 'px';
                }
            }
        }
        if (head.nccol > 0) {
            if (what !== 99)
                this.row(ri, what);
            row = mytable.rows[head.ncpth.length];
            lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
            setLeftColumngeometry(head);
            setTopLeftCornergeometry();
        }
        setTableHeadgeometry();
        // flo keeps all neccessary geometry    
        flo = setFlo(flo);
    };
    tf.row = function(ri, what) { // method to force a new layout of pseudo header
        var mytable, nc, k, row, i, aCell;
        mytable = document.getElementById(this.id.split('_')[1]);
        nr = mytable.rows.length;
        ri = ri * 1;
        what = what * 1;
        if (what === 1) {// insert        
            row = mytable.rows[ri];
            nc = row.cells.length;
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table  
                aCell = row.cells[i];
                th = createLeftColumn(aCell, aCell.offsetTop - delta, i, ri);
                tf.lc.appendChild(th);
            }
        } else if (what === -1) {// delete 
            // delete a pseudo row from left column
            for (k = 0; k < head.nccol; k++) {
                tf.lc.removeChild(tf.lc.childNodes[0]);
            }
        }
        this.syncLeft();
    };
    tf.syncLeft = function() {
        var nr, aCell, j, k, i, ntc;
        //////////////////////////////
        /// brute force sync/rearange left columns
        /// //////////////////////////
        nr = mytable.rows.length;
        ntc = tf.lc.childNodes.length;
        for (k = head.ncpth.length, j = 0; k < nr; k++) {
            row = mytable.rows[k];
            for (i = 0; i < head.nccol && j < ntc; i++, j++) { // copy content of column cells from table   
                aCell = row.cells[i];
                updateLeftColumn(tf.lc.childNodes[j], aCell, aCell.offsetTop - delta, i, row.rowIndex);
            }
        }
        return;
    };

    function addEvent(obj, ev, fu) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fu, false);
        } else {
            var eev = 'on' + ev;
            obj.attachEvent(eev, fu);
        }
    }
    addEvent(scrollParent, 'scroll', tf.scroll);
    // pointers to corner and left column;
    tf.tlc = tlc;
    tf.lc = lc;
    lc.tlc = tlc;
    return tf;
}