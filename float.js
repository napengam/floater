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
            className: 'outerFloatHead',
            frozen: false,
            see: false}
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
            className: 'floatCorner',
            frozen: false,
            see: false}
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
            className: 'outerFloatHead',
            frozen: false,
            see: false}
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
        setAtt(div, {className: 'floatHead ' + theCell.className,
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
        setAtt(div, {className: 'floatCol ' + theCell.className,
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
    function setLeftColumnGeometry(head) {
        setAtt(lc.style, {
            top: absPos(mytable.rows[head.ncpth.length].cells[0]).y + 'px',
            left: floatPos.x + 'px',
            height: mytable.clientHeight - mytable.rows[head.ncpth.length].offsetTop + 'px',
            width: lcw + 'px'});
        lc.top = parseInt(lc.style.top);
    }
    function setTopLeftCornerGeometry() {
        var nr, nc;
        nr = mytable.rows.length;
        nc = mytable.rows[nr - 1].cells.length;
        setAtt(tlc, {
            rightEdge: floatPos.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth,
            left: floatPos.x,
            x: floatPos.x});
        setAtt(tlc.style, {
            borderRight: '1px solid black',
            height: tf.style.height,
            left: floatPos.x + 'px',
            top: floatPos.y + 'px',
            width: lcw + 2 + 'px'}
        );
        tf.rightEdge = tlc.rightEdge;

    }
    function setTableHeadGeometry() {
        setAtt(tf, {
            ybottom: floatPos.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight,
            tabtop: floatPos.y,
            x: floatPos.x,
            y: floatPos.y,
            sx: 0,
            sy: 0,
            left: floatPos.x,
            top: floatPos.y,
            right: floatPos.x + mytable.clientWidth,
            bottom: floatPos.y + mytable.clientHeight});
        setAtt(tf.style, {
            left: floatPos.x + 'px',
            top: floatPos.y + 'px',
            width: mytable.clientWidth + 'px'});
    }
    var mytable
            , row = [], floatPos
            , i, nc, nr, th, delta
            , k, tf, tlc = {}, lc = {}, lcw = 0;
    mytable = document.getElementById(tableId);
    if (typeof head === 'undefined') {
        var head = {ncpth: [], nccol: 0};
        for (i = 0; i < mytable.rows.length; i++) {
            if (mytable.rows[i].cells[0].tagName !== 'TH') {
                break;
            }
            head.ncpth[i] = mytable.rows[i].cells.length;
        }
    }

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
        setLeftColumnGeometry(head);
        lc.style.display = 'none';
        setTopLeftCornerGeometry();
        tlc.style.display = 'none';
    }
    setTableHeadGeometry();
    tf.style.display = 'none';


    floatPos.yEdge = floatPos.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
    floatPos.xEdge = floatPos.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
    floatPos.right = floatPos.x + mytable.clientWidth;
    floatPos.bottom = floatPos.x + mytable.clientHeight;
    floatPos.ylc = absPos(mytable.rows[head.ncpth.length]).y;
    floatPos.sx = 0;
    floatPos.sy = 0;


    function scroll() {
        var y, x;
        y = window.pageYOffset;
        x = window.pageXOffset;

        function fixed(obj, x, y) {
            obj.style.left = x + 'px';
            obj.style.top = y + 'px';
            obj.style.position = 'fixed';
            if (obj.style.display === 'none') {
                obj.style.display = '';
                obj.see = true;
            }
            obj.frozen = true;
            return obj;
        }

        function absolute(obj, x, y) {
            obj.style.left = x + 'px';
            obj.style.top = y + 'px';
            obj.style.position = 'absolute';
            if (obj.style.display === 'none') {
                obj.style.display = '';
                obj.see = true;
            }
            obj.frozen = false;
            return obj;
        }
        function hide(obj) {
            if (obj.style.display !== 'none') {
                obj.style.display = 'none'
                obj.see = false;
                obj.frozen = false;
            }
            return obj;
        }
        if (floatPos.sy !== y) {
            floatPos.sy = y;
            if (lc.see && lc.frozen) {
                lc = absolute(lc, x, floatPos.y);
            }
            if (y < floatPos.y) {
                //hide all
                hide(tf);
                if (tlc.frozen && tlc.see) {
                    tlc = absolute(tlc, x, floatPos.y);
                }
            } else if (y < floatPos.yEdge) {
                // freeze tf
                if (!tf.frozen) {
                    tf = fixed(tf, floatPos.x - x, 0);
                }
                if (tlc.see) {
                    tlc = fixed(tlc, 0, 0);
                }
            } else if (y < floatPos.bottom) {
                if (tf.see) {
                    tf = absolute(tf, floatPos.x, y);
                }
                if (tlc.see) {
                    tlc = absolute(tlc, floatPos.x, y);
                }
            } else {
                hide(tf);
                hide(tlc);
                hide(lc);
            }
        }
        if (floatPos.sx !== x) {
            floatPos.sx = x;
            if (tf.see && tf.frozen) {
                tf = absolute(tf, floatPos.x, y);
            }
            if (x <= floatPos.x) {
                hide(lc);
                hide(tlc);
            } else if (x < floatPos.xEdge) {
                if (!tlc.see || !tlc.frozen) {
                    if (!tf.see) {
                        tlc = fixed(tlc, 0, floatPos.y - y);
                    } else {
                        tlc = fixed(tlc, 0, 0);
                    }
                    lc = fixed(lc, 0, floatPos.ylc - y);
                }
            } else if (x < floatPos.right) {

                if (tlc.frozen || tlc.view) {
                    tlc = absolute(tlc, x, parseInt(tlc.style.top) + y);
                    lc = absolute(lc, x, floatPos.ylc);
                }
            } else {/**
             hide(tf);
             hide(tlc);
             hide(lc);
             **/
            }
        }
    }
    tf.sync = function() {
        tf.syncRow(0, 0);
        scroll();
    };
    tf.syncRow = function(ri, what) { // method to force a new layout of pseudo header
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
            if (what !== 99)
                this.row(ri, what);
            row = mytable.rows[head.ncpth.length];
            lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
            setLeftColumnGeometry(head);
            setTopLeftCornerGeometry();
        }
        setTableHeadGeometry();

        floatPos.yEdge = floatPos.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
        floatPos.xEdge = floatPos.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        floatPos.right = floatPos.x + mytable.clientWidth;
        floatPos.bottom = floatPos.x + mytable.clientHeight;
        floatPos.ylc = absPos(mytable.rows[head.ncpth.length]).y;
        floatPos.sx = 0;
        floatPos.sy = 0;

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
        for (k = head.ncpth.length, j = 0; k < mytable.rows.length - 1; k++) {
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