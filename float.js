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
 Once alle tables are rendered you call floatHeader(tableId),
 this returns the header object.
 
 /////////////////////////////////////////////////////////////*/

function floatHeader(tableId, head) {
    'use strict';
    function setAtt(s, o) {
        var opt;
        for (opt in o) {
            s[opt] = o[opt];
        }
        return s;
    }
    function absPos(obj) {
        var ob, pos = {};
        pos.x = obj.offsetLeft;
        pos.y = obj.offsetTop;
        ob = obj.offsetParent;
        while (ob.tagName !== 'BODY') {
            pos.x += ob.offsetLeft;
            pos.y += ob.offsetTop;
            ob = ob.offsetParent;
        }
        return pos;
    }
    function createDivHead(mytable, x) {
        var div = document.createElement('div');
        setAtt(div, {id: 'float_' + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {zIndex: 15,
            width: mytable.clientWidth + 'px',
            left: x + 'px'
        }
        );
        return div;
    }
    function createDivCornerHead(mytable, x) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatcorner_' + mytable.id,
            className: 'floatCorner'}
        );
        setAtt(div.style, {zIndex: 15,
            left: x + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px'}
        );
        return div;
    }
    function createDivLeftColumn(mytable, x) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatleftcolumn_' + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {zIndex: 12,
            left: x + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px'}
        );
        return div;
    }
    function createHeaderCell(theCell, top, ci) {
        var div = document.createElement('div');
        updateHeaderCell(div, theCell, top, ci);
        return div;
    }
    function updateHeaderCell(div, theCell, top, ci) {
        setAtt(div, {className: 'floatHead',
            innerHTML: theCell.innerHTML,
            cellIndex: ci}
        );
        setAtt(div.style, {
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px'
        }
        );
        return div;
    }
    function createLeftColumn(theCell, top, ci, ri) {
        var div = document.createElement('div');
        updateLeftColumn(div, theCell, top, ci, ri);
        return div;
    }
    function updateLeftColumn(div, theCell, top, ci, ri) {
        setAtt(div, {className: 'floatCol',
            innerHTML: theCell.innerHTML,
            cellIndex: ci,
            rowIndex: ri}
        );
        setAtt(div.style, {
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px',
            height: theCell.clientHeight + 'px'}
        );
        return div;
    }
    function setLeftColumnGeomtry(head) {
        lc.style.top = absPos(mytable.rows[head.ncpth.length].cells[0]).y + 'px';
        lc.style.left = floatPos.x + 'px';
        lc.style.height = mytable.clientHeight - mytable.rows[head.ncpth.length].offsetTop + 'px';
        lc.style.width = lcw + 'px';
    }
    function setTopLeftCornerGeometry() {
        var nr, nc;
        nr = mytable.rows.length;
        nc = mytable.rows[nr - 1].cells.length;
        tlc.style.height = tf.style.height;
        tlc.rightEdge = floatPos.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        tlc.left = floatPos.x;
        tlc.x = floatPos.x;
        tlc.style.left = floatPos.x + 'px';
        tlc.style.top = floatPos.y + 'px';
        tlc.style.height = tf.style.heigh;
        tlc.style.width = lcw + 2 + 'px';
        tf.rightEdge = tlc.rightEdge;
    }
    function setTableHeadGeometry() {
        tf.ybottom = floatPos.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
        tf.tabtop = floatPos.y;
        tf.x = floatPos.x;
        tf.y = floatPos.y;
        tf.left = floatPos.x;
        tf.top = floatPos.y;
        tf.right = tf.left + mytable.clientWidth;
        tf.bottom = tf.top + mytable.clientHeight;
        tf.style.left = floatPos.x + 'px';
        tf.style.top = floatPos.y + 'px';
        tf.style.width = mytable.clientWidth + 'px';
    }
    var mytable
            , row = [], floatPos
            , i, nc, nr, th, delta
            , k, tf, tlc = {}, lc = {}, lcw = 0;

    if (typeof head === 'undefined') {
        var head = {ncpth: [], nccol: 0};
    }

    mytable = document.getElementById(tableId);
    floatPos = absPos(mytable);
    tf = createDivHead(mytable, floatPos.x); // entire header

    if (typeof head === 'undefined') {
        var head = {ncpth: [], nccol: 0}; // default 
    } else {
        tlc = createDivCornerHead(mytable, floatPos.x); // top left corener
        lc = createDivLeftColumn(mytable, floatPos.x); //  left column
        tlc.style.top = floatPos.y + 'px';
        tlc.x = 0;
    }
    //////////////////////////////
    /// header rows only 
    /////////////////////////////
    document.body.appendChild(tf);
    tf.style.top = floatPos.y + 'px';
    nr = mytable.rows.length;
    if (head.nccol > 0) {
        document.body.appendChild(tlc);
    }
    for (k = 0; k < nr; k++) {
        if (mytable.rows[k].cells[0].tagName !== 'TH') {
            break;
        }
        row = mytable.rows[k];
        nc = row.cells.length;
        for (i = 0; i < nc; i++) { // copy content of header cells from table   
            th = createHeaderCell(row.cells[i], row.cells[i].offsetTop, i);
            tf.appendChild(th);
            th.style.height = row.cells[i].clientHeight + 'px';
            if (k < head.ncpth.length && i < head.ncpth[k]) {// copy cells into top left corner div  
                th = createHeaderCell(row.cells[i], row.cells[i].offsetTop, i);
                tlc.appendChild(th);
                th.style.height = row.cells[i].clientHeight + 'px';
            }
        }
    }
    tf.style.height = row.offsetTop + row.clientHeight + 'px';
    tf.rightEdge = 0;
    ///////////////////////
    //// left column cells  only
    ///////////////////////
    if (head.nccol > 0) {
        document.body.appendChild(lc);
        lcw = 0;
        delta = mytable.rows[head.ncpth.length].offsetTop;
        for (/*k from loop above*/; k < nr; k++) {
            row = mytable.rows[k];
            nc = row.cells.length;
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                th = createLeftColumn(row.cells[i], row.cells[i].offsetTop - delta, i, row.rowIndex);
                lc.appendChild(th);
            }
        }
        lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
        setLeftColumnGeomtry(head);
        lc.style.display = 'none';
        setTopLeftCornerGeometry();
        tlc.style.display = 'none';
    }
    setTableHeadGeometry();
    tf.style.display = 'none';

    function scroll() { // does the scrolling as event handler
        var y, x, ypx, xpx;
        y = window.pageYOffset;
        x = head.nccol > 0 ? window.pageXOffset : 0;
        /////////////////////////////////// vertical scrolling /////////////////////////
        if (y === 0) {
            if (tf.style.display !== 'none') {
                tf.style.display = 'none';
                tlc.style.display = 'none';
                tf.style.top = tf.top + 'px';
                tlc.style.top = tf.style.top;
            }
        } else {
            if (y > tf.ybottom) {
                return;
            }
            if (tf.tabtop - y < 0) {
                ypx = y + 'px';
                if (tf.y !== ypx) {
                    tf.style.top = ypx;
                    tlc.style.top = ypx;
                    tf.y = ypx;
                    if (tf.style.display === 'none') {
                        tf.style.display = '';
                        tlc.style.display = '';
                    }
                }
            } else {
                if (tf.style.display !== 'none') {
                    tf.style.display = 'none';
                    tlc.style.display = 'none';
                    tf.style.top = tf.top + 'px';
                    tlc.style.top = tf.style.top;
                }
            }
        }
        /////////////////////////////// horizontal scrolling //////////////////
        if (x === 0) {
            if (tlc.style.display !== 'none') {
                tlc.style.display = 'none';
                lc.style.display = 'none';
            }
            return;
        } else {
            if (x >= tf.rightEdge) {
                return;
            }
            if (tlc.left <= x && x < tf.rightEdge) {
                xpx = x + 'px';
                if (tlc.x !== xpx) {
                    tlc.style.left = xpx;
                    lc.style.left = xpx;
                    tlc.x = xpx;
                    if (tlc.style.display === 'none') {
                        tlc.style.display = '';
                        lc.style.display = '';
                    }
                } else if (tlc.style.display === 'none') {
                    tlc.style.display = '';
                }
                return;
            } else {
                if (tlc.style.display !== 'none') {
                    tlc.style.display = 'none';
                    lc.style.display = 'none';
                }
                return;
            }
        }
    }
    tf.sync = function(ri, what) { // method to force a new layout of pseudo header
        var mytable, nc, nr, k, i, j, l, th, row;
        mytable = document.getElementById(this.id.split('_')[1]);
        nr = mytable.rows.length;
        floatPos = absPos(mytable);
        for (k = 0, j = 0, l = 0; k < nr; k++) {
            if (mytable.rows[k].cells[0].tagName !== 'TH') {
                break;
            }
            row = mytable.rows[k];
            nc = row.cells.length;
            for (i = 0; i < nc; i++) { // copy content of header cells from table   
                th = updateHeaderCell(tf.childNodes[j++], row.cells[i], row.cells[i].offsetTop, i);
                th.style.height = row.cells[i].clientHeight + 'px';
                if (k < head.ncpth.length && i < head.ncpth[k]) {// copy cells into top left corner div  
                    th = updateHeaderCell(tlc.childNodes[l++], row.cells[i], row.cells[i].offsetTop, i);
                    th.style.height = row.cells[i].clientHeight + 'px';
                }
            }
        }
        if (head.nccol > 0) {
            this.row(ri, what);
            row = mytable.rows[head.ncpth.length];
            lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
            setLeftColumnGeomtry(head);
            setTopLeftCornerGeometry();
        }
        setTableHeadGeometry();
    };
    tf.row = function(ri, what) { // method to force a new layout of pseudo header
        var mytable, nc, k, row, j, i;
        mytable = document.getElementById(this.id.split('_')[1]);
        nr = mytable.rows.length;
        ri = ri * 1;
        what = what * 1;
        if (what === 1) {// insert        
            row = mytable.rows[ri];
            nc = row.cells.length;
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                th = createLeftColumn(row.cells[i], row.cells[i].offsetTop - delta, i, ri);
                tf.lc.appendChild(th);
            }
        } else if (what === -1) {// delete 
            // delete a pseudo row from left column
            for (k = 0; k < head.nccol; k++) {
                tf.lc.removeChild(tf.lc.childNodes[0]);
            }
        }
        //////////////////////////////
        /// brute force sync/rearange left columns
        /// //////////////////////////
        for (k = head.ncpth.length, j = 0; k < mytable.rows.length; k++) {
            row = mytable.rows[k];
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                updateLeftColumn(tf.lc.childNodes[j++], row.cells[i], row.cells[i].offsetTop - delta, i, row.rowIndex);
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
    addEvent(window, 'scroll', scroll);
    // pointers to corner and left column;
    tf.tlc = tlc;
    tf.lc = lc;
    return tf;
}