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
    function createDivHead(mytable, id, x) {
        var div = document.createElement('div');
        setAtt(div, {id: id + mytable.id,
            className: 'outerFloatHead',
            see: false}
        );
        setAtt(div.style, {zIndex: 15,
            width: mytable.clientWidth + 'px',
            left: x + 'px',
            position: 'absolute'
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
            left: x + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px',
            position: 'absolute'}
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
            width: theCell.clientWidth + 'px',
            position: 'absolute'
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
            height: theCell.clientHeight + 'px',
            position: 'absolute'}
        );
        return div;
    }
    function setLeftColumnflometry(head) {
        setAtt(lc.style, {
            top: absPos(mytable.rows[head.ncpth.length].cells[0]).y + 'px',
            left: flo.x + 'px',
            height: mytable.clientHeight - mytable.rows[head.ncpth.length].offsetTop + 'px',
            width: lcw + 'px',
            position: 'absolute'});
    }
    function setTopLeftCornerflometry() {
        setAtt(tlc.style, {
            borderRight: '1px solid black',
            height: tf.style.height,
            left: flo.x + 'px',
            top: flo.y + 'px',
            width: lcw + 2 + 'px',
            position: 'absolute'}
        );
        tf.rightEdge = tlc.rightEdge;
    }
    function setTableHeadflometry() {
        setAtt(tf.style, {
            left: flo.x + 'px',
            top: flo.y + 'px',
            width: mytable.clientWidth + 'px',
            position: 'absolute'});
    }
    var mytable
            , row = [], flo
            , i, nc, nr, th, delta
            , k, tf, tlc = {}, lc = {}, lcw = 0;
    mytable = document.getElementById(tableId);

    head = head || {};

    flo = absPos(mytable);
    tf = createDivHead(mytable, 'float_', flo.x); // entire header

    if (typeof head.ncpth === 'undefined') {
        head.ncpth = [];
        head.nccol = 0;// default      
    } else {
        tlc = createDivHead(mytable, 'float_corner', flo.x); // top left corener
        lc = createDivLeftColumn(mytable, flo.x); //  left column
        tlc.style.top = flo.y + 'px';
        tlc.x = 0;
    }
//////////////////////////////
/// header rows only 
/////////////////////////////
    document.body.appendChild(tf);
    tf.style.top = flo.y + 'px';
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
        setLeftColumnflometry(head);
        lc.style.display = 'none';
        setTopLeftCornerflometry();
        tlc.style.display = 'none';
    }
    setTableHeadflometry();
    tf.style.display = 'none';

    // flo keeps all neccessary geometry
    flo.lcw = mytable.rows[nr - 1].cells[nc - 1].clientWidth;
    flo.yEdge = flo.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
    flo.xEdge = flo.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
    flo.right = flo.x + mytable.clientWidth - 1;
    flo.bottom = flo.y + mytable.clientHeight - 1;
    flo.ylc = absPos(mytable.rows[head.ncpth.length]).y;
    flo.sx = -1;
    flo.sy = -1;
    flo.xout = false;
    flo.yout = false;

    function scroll() {

        var y, yy, delta, x;
        y = window.pageYOffset;
        x = window.pageXOffset;


        function fixed(obj, x, y) {
            if (typeof obj.style === 'undefined') {
                return obj;
            }
            if ((obj.style.position === 'fixed' && obj.style.display !== 'none')) {
                return obj;
            }
            obj.style.left = x + 'px';
            obj.style.top = y + 'px';
            obj.style.position = 'fixed';
            if (obj.style.display === 'none') {
                obj.style.display = '';
                obj.see = true;
            }
            return obj;
        }
        function absolute(obj, x, y) {
            if (typeof obj.style === 'undefined') {
                return obj;
            }
            if ((obj.style.position === 'absolute' && obj.style.display !== 'none')) {
                return obj;
            }
            obj.style.position = 'absolute';
            if (x !== '') {
                obj.style.left = x + 'px';
            }
            obj.style.top = y + 'px';
            if (obj.style.display === 'none') {
                obj.style.display = '';
                obj.see = true;
            }
            return obj;
        }
        function getLastY(obj) {
            var ly = 0;
            if (typeof obj.style !== 'undefined') {
                ly = parseInt(obj.style.top) + ((obj.style.position === 'fixed')? y:0);
            }
            return ly;
        }
        function hide(obj) {
            if (typeof obj.style === 'undefined') {
                return obj;
            }
            if (obj.style.display !== 'none') {
                obj.style.display = 'none';
                obj.see = false;
            }
            return obj;
        }
        if (flo.sy !== y) {// vertical scrolling
            flo.sy = y;
            if (lc.see) {
                lc = absolute(lc, x, flo.ylc);
            }
            if (y < flo.y) {
                hide(tf);
                if (tlc.see) {
                    tlc = absolute(tlc, parseInt(lc.style.left), flo.y);
                }
            } else if (y < flo.yEdge) {
                tf = fixed(tf, flo.x - x, 0);
                if (tlc.see) {
                    tlc = fixed(tlc, parseInt(lc.style.left) - x, 0);
                }
            } else if (y < flo.bottom) {
                if (tf.style.position !== 'absolute') {
                    tf = absolute(tf, flo.x, y);
                    if (tlc.see) {
                        tlc = absolute(tlc, x, y);
                    }
                }
                flo.yout = false;
            } else {
                tf = absolute(tf, flo.x, 0 - flo.bottom);
                tlc = absolute(tlc, flo.x, 0 - flo.bottom);
                lc = absolute(lc, flo.x, 0 - flo.bottom);
                hide(tf);
                hide(tlc);
                hide(lc);
                flo.sx = -1;
                flo.yout = true;
            }
        }
        if (flo.sx !== x) { // horizontal scrolling

            flo.sx = x;
            yy = flo.y - y;
            if (tf.see) {
                tf = absolute(tf, flo.x, y);
                yy = parseInt(tf.style.top) - y;
            }
            if (x <= flo.x) {
                hide(lc);
                hide(tlc);
                flo.xout = false;
            } else if (x <= flo.xEdge) {
                tlc = fixed(tlc, 0, yy);
                lc = fixed(lc, 0, flo.ylc - y);
                flo.xout = false;
            } else if (x <= flo.right) {
                if (typeof tlc.style !== 'undefined' && tlc.style.position !== 'absolute' && !flo.xout) {
                    tlc = absolute(tlc, parseInt(tlc.style.left) + x, parseInt(tlc.style.top) + y);
                    lc = absolute(lc, x, flo.ylc);
                }
                if (flo.xout) {
                    if (y > 0) {
                        tlc = absolute(tlc, flo.xEdge, tlc.lastY + (y - tlc.lasty));
                    } else {
                        tlc = absolute(tlc, flo.xEdge, flo.y);
                    }
                    lc = absolute(lc, flo.xEdge, flo.ylc);
                }
                flo.xout = false;
            } else {
                if (!flo.xout) {
                    flo.xout = true;
                    tf = absolute(tf, flo.x, 0 - flo.bottom);
                    tlc.lastY = getLastY(tlc);
                    tlc = absolute(tlc, flo.x, 0 - flo.bottom);
                    lc = absolute(lc, flo.x, 0 - flo.bottom);
                    hide(tf);
                    hide(tlc);
                    hide(lc);
                }
                flo.sy = -1;
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
        flo = absPos(mytable);
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
            setLeftColumnflometry(head);
            setTopLeftCornerflometry();
        }
        setTableHeadflometry();
        flo.yEdge = flo.y + mytable.clientHeight - tf.clientHeight - /*last row*/ mytable.rows[nr - 1].clientHeight;
        flo.xEdge = flo.x + mytable.clientWidth - lcw - /*lastcell*/ mytable.rows[nr - 1].cells[nc - 1].clientWidth;
        flo.right = flo.x + mytable.clientWidth;
        flo.bottom = flo.x + mytable.clientHeight;
        flo.ylc = absPos(mytable.rows[head.ncpth.length]).y;
        flo.sx = 0;
        flo.sy = 0;
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