

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

[].every.call(mytable.rows, withRows);

function withRows(row, ri, rows) {
    if (row.cells[0].tagName === 'TH') {
        row = mytable.rows[k];
        nc = row.cells.length;
        for (i = 0; i < nc; i++) { // copy content of header cells from table   
            
            th = updateHeaderCell(tf.childNodes[j++], aCell, aCell.offsetTop, i);
            tf.appendChild(th);
            th.style.height = row.cells[i].clientHeight + 'px';
            if (k < head.ncpth.length && i < head.ncpth[k]) {// copy cells into top left corner div  
                th = updateHeaderCell(tlc.childNodes[l++], aCell, aCell.offsetTop, i);
                tlc.appendChild(th);
                th.style.height = row.cells[i].clientHeight + 'px';
            }
        }
        return true; // next row
    }
    tf.style.height = row.offsetTop + row.clientHeight + 'px';
    tf.rightEdge = 0;
    ///////////////////////
    //// left column cells  only
    ///////////////////////
    if (head.nccol > 0) {
        tableParent.appendChild(lc);
        div = createDivHead(mytable, 'inner_leftColumn_', 0); // entire header
        lc.appendChild(div);
        lcw = 0;
        delta = mytable.rows[head.ncpth.length].offsetTop;
        for (i = 0; i < head.nccol; i++) { // copy content of column cells from table   
            th = createLeftColumn(row.cells[i], row.cells[i].offsetTop - delta, i, row.rowIndex);
            lc.appendChild(th);
        }
        return true; // next row
    }
    lcw = row.cells[head.nccol - 1].offsetLeft + row.cells[head.nccol - 1].clientWidth;
    setLeftColumngeometry(head);
    lc.style.display = 'none';
    setTopLeftCornergeometry();
    tlc.style.display = 'none';
}


