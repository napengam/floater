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

function floatHeader(tableId) {
'use strict';
    var obj, mytable , floatoffsetleft = 0
            , startX 
            , py, i, nc, nr, th, offsettop, top, height
            , k, tf, theCell, allHeight = 0;


    mytable= obj = document.getElementById(tableId);
    startX = mytable.offsetLeft + floatoffsetleft;
    
    floatoffsetleft = obj.offsetLeft;
    obj = obj.offsetParent;
    while (obj.tagName !== 'BODY') {
        floatoffsetleft += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    obj = mytable;
    tf = document.createElement('div');
    tf.style.zIndex = 15;
    tf.id = 'float' + mytable.id;
    tf.className = 'outerFloatHead';
    tf.style.width = mytable.clientWidth + 'px';
    tf.style.position = 'absolute';
    tf.style.left = floatoffsetleft + 'px';
    tf.style.height = mytable.rows[0].cells[0].clientHeight + 'px';
    nr = mytable.rows.length;
    top = 0;
    for (k = 0; k < nr; k++) {
        if (mytable.rows[k].cells[0].tagName !== 'TH') {
            break;
        }
        allHeight += mytable.rows[k].cells[0].clientHeight;
        nc = mytable.rows[k].cells.length;
        for (i = 0; i < nc; i++) { // copy content of header cells from table
            th = document.createElement('div');
            th.className = 'floatHead';
            tf.appendChild(th);
            theCell = mytable.rows[k].cells[i];
            th.innerHTML = theCell.innerHTML;
            th.cellIndex = i; // fake it
            th.style.position = 'absolute';
            th.style.left = theCell.offsetLeft + 'px';           
            th.style.top = top +  'px';
            th.style.width = theCell.clientWidth + 'px';
        }
        top += mytable.rows[k].cells[0].clientHeight;
    }
    tf.style.height = allHeight + 'px';
    document.body.appendChild(tf);
    obj = mytable;
    offsettop = obj.offsetTop;
    while (obj.offsetParent.tagName !== 'BODY') {
        obj = obj.offsetParent;
        offsettop += obj.offsetTop;
    }
    height = mytable.clientHeight;
    tf.ybottom = offsettop + height - tf.clientHeight;
    tf.tabtop = offsettop;
    tf.x = startX;
    py = 0;
    tf.y = py + offsettop;
    tf.py = py;
    addEvent(window, 'scroll', function() { // does the scrolling 
        var y;
        y = window.pageYOffset;
        if (y === 0) {
            if (tf.style.display !== 'none') {
                tf.style.display = 'none';
            }
            return;
        } else {
            if (y > tf.ybottom) {
                return;
            }
            if (tf.tabtop - y < 0) {
                if (tf.y !== y + 'px') {
                    tf.style.top = y + 'px';
                    tf.y = y + 'px'
                    if (tf.style.display === 'none') {
                        tf.style.display = '';
                    }
                }
                return;
            } else {
                if (tf.style.display !== 'none') {
                    tf.style.display = 'none';
                }
                return;
            }
        }
    }
    );
    function addEvent(obj, ev, fu) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fu, false);
        } else {
            var eev = 'on' + ev;
            obj.attachEvent(eev, fu);
        }
    }
    tf.sync = function() { // method to force a new layout of pseudo header
        var mytable, nc, k, i, l, add;
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
                add = getStyle(theCell, 'padding-left').split('px')[0] - 0;
                add += getStyle(theCell, 'margin-left').split('px')[0] - 0;
                add += getStyle(theCell, 'border-left').split('px')[0] - 0;
                th.style.left = theCell.offsetLeft + add + 'px';
                th.style.width = theCell.clientWidth + 'px';
            }
        }
    };
    return tf;
}
