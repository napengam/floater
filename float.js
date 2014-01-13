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
    function createDivHead(mytable, floatoffsetleft) {
        var div = document.createElement('div');
        setAtt(div, {id: 'float' + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {zIndex: 15,
            width: mytable.clientWidth + 'px',
            position: 'absolute',
            left: floatoffsetleft + 'px'
        }
        );
        return div;
    }
    function createDivCornerHead(mytable, floatoffsetleft) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatcorner_' + mytable.id,
            className: 'floatCorner'}
        );
        setAtt(div.style, {zIndex: 15,
            position: 'absolute',
            left: floatoffsetleft + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px'}
        );
        return div;
    }
    function createDivLeftColumn(mytable, floatoffsetleft) {
        var div = document.createElement('div');
        setAtt(div, {id: 'floatleftcolumn_' + mytable.id,
            className: 'outerFloatHead'}
        );
        setAtt(div.style, {zIndex: 12,
            position: 'absolute',
            left: floatoffsetleft + 'px',
            height: mytable.rows[0].cells[0].clientHeight + 'px'}
        );
        return div;
    }
    function copyCell(theCell, top, i) {
        var div = document.createElement('div');
        setAtt(div, {className: 'floatHead',
            innerHTML: theCell.innerHTML,
            cellIndex: i}
        );
        setAtt(div.style, {
            position: 'absolute',
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px'
        }
        );
        return div;
    }
    function copyLeftColumn(theCell, top, i) {
        var div = document.createElement('div');
        setAtt(div, {className: 'floatCol',
            innerHTML: theCell.innerHTML,
            cellIndex: i}
        );
        setAtt(div.style, {
            position: 'absolute',
            left: theCell.offsetLeft + 'px',
            top: top + 'px',
            width: theCell.clientWidth + 'px'}
        );
        return div;
    }
    var mytable, floatoffsetleft = 0
            , row = [], floatPos, cornerPos, columnPos
            , py, i, nc, nr, th, offsettop, top, height, delta
            , k, tf, tlc = {}, lc = {}, lcTop, lcw = 0, theCell, allHeight = 0
            , allHeight2 = 0, tlcw = 0;

    if (typeof head === 'undefined') {
        var head = {ncpth: [], nccol: 0};
    }

    mytable = document.getElementById(tableId);
    theCell = mytable.rows[0].cells[0];
    floatPos = cornerPos = absPos(mytable);
    floatoffsetleft = floatPos.x;

    tf = createDivHead(mytable, floatoffsetleft); // entire header

    if (typeof head === 'undefined') {
        var head = {ncpth: [], nccol: 0}; // default 
    } else {
        tlc = createDivCornerHead(mytable, floatoffsetleft); // top left corener
        lc = createDivLeftColumn(mytable, floatoffsetleft); //  left column
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
        tlc.rightEdge = floatoffsetleft;
        for (i = 0; i < nc; i++) { // copy content of header cells from table   
            th = copyCell(row.cells[i], row.cells[i].offsetTop, i);
            tf.appendChild(th);
            th.style.height = row.cells[i].clientHeight + 'px';
            if (k < head.ncpth.length) {// copy cells into top left corner div  
                if (i < head.ncpth[k]) {
                    th = copyCell(row.cells[i], row.cells[i].offsetTop, i);
                    tlc.appendChild(th);
                    th.style.height = row.cells[i].clientHeight + 'px';
                    allHeight2 = row.offsetTop + row.clientHeight;
                    tlcw = row.cells[i].offsetLeft + row.cells[i].clientWidth;
                }
            }
        }
    }
    allHeight = row.offsetTop + row.clientHeight;
    ///////////////////////
    //// left column cells  only
    ///////////////////////
    if (head.nccol > 0) {
        document.body.appendChild(lc);
        columnPos = absPos(mytable.rows[k].cells[0]);
        lcTop = columnPos.y;
        delta = lcTop - floatPos.y;
      
        lcw = 0;
        delta = mytable.rows[k].offsetTop;
        for (height = 0, top = 0; k < nr; k++) {
            row = mytable.rows[k];
            nc = row.cells.length;
            for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
                th = copyLeftColumn(row.cells[i], row.cells[i].offsetTop - delta, i);
                lc.appendChild(th);
                lcw = row.cells[i].offsetLeft + row.cells[i].clientWidth;
            }
        }
        height = row.offsetTop + row.clientHeight;
    }
    tf.style.height = allHeight + 'px';
    tf.rightEdge = 0;

    if (head.nccol > 0) {
        lc.style.top = lcTop + 'px';
        lc.style.height = height - delta + 'px';
        lc.style.width = lcw + 'px';
        lc.style.display = 'none';

        tlc.style.height = tf.style.height;
        tlc.rightEdge = floatPos.x + tf.clientWidth - lcw;
        tlc.left = floatoffsetleft;
        tlc.x = floatoffsetleft;
        tlc.style.height = allHeight2 + 'px';
        tlc.style.width = tlcw+2 + 'px';
        tlc.style.display = 'none';

        tf.rightEdge = tlc.rightEdge;
    }
    py = 0;
    height = mytable.clientHeight;
    tf.ybottom = floatPos.y + height - tf.clientHeight;
    tf.tabtop = floatPos.y;
    tf.x = floatPos.x;
    tf.y = py + offsettop;
    tf.py = py;
    tf.style.display = 'none';

    function scroll() { // does the scrolling 
        var y, x, ypx, xpx;
        y = window.pageYOffset;
        x = head.nccol > 0 ? window.pageXOffset : 0;
        /////////////////////////////////// vertical scrolling /////////////////////////
        if (y === 0) {
            if (tf.style.display !== 'none') {
                tf.style.display = 'none';
                tlc.style.display = 'none';
                tf.style.top = floatPos.y + 'px';
                tlc.style.top = floatPos.y + 'px';
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
                        tf.style.display = 'block';
                        tlc.style.display = 'block';
                    }
                }
            } else {
                if (tf.style.display !== 'none') {
                    tf.style.display = 'none';
                    tlc.style.display = 'none';
                    tf.style.top = floatPos.y + 'px';
                    tlc.style.top = floatPos.y + 'px';
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
                        tlc.style.display = 'block';
                        lc.style.display = 'block';
                    }
                } else if (tlc.style.display === 'none') {
                    tlc.style.display = 'block';
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

    function addEvent(obj, ev, fu) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fu, false);
        } else {
            var eev = 'on' + ev;
            obj.attachEvent(eev, fu);
        }
    }

    tf.sync = function() { // method to force a new layout of pseudo header
        var mytable, nc, k, i, l;
        mytable = document.getElementById(this.id.split('|')[1]);
        nr = mytable.rows.length;

        for (k = 0, l = 0; k < nr; k++) {
            if (mytable.rows[k].cells[0].tagName !== 'TH') {
                break;
            }
            nc = mytable.rows[k].cells.length;
            for (i = 0; i < nc; i++) {
                th = tf.childNodes[l];
                l++;
                theCell = mytable.rows[k].cells[i];
                th.innerHTML = theCell.innerHTML;
                th.style.left = theCell.offsetLeft + 'px';
                th.style.width = theCell.clientWidth + 'px';
            }
        }
    };
    addEvent(window, 'scroll', scroll);
    return tf;
}
