function rotateHeadCell(tableId) {
    'use strict';
    var aRows = document.getElementById(tableId).rows, padding = 4;
    [].every.call(aRows, function(row) {
        if (row.cells[0].tagName !== 'TH') {
            return false;
        }
        rotateCell(row);
        return true;
    });
    function rotateCell(row) {
        var maxw = -1;
        [].forEach.call(row.cells, function(cell) {
            var w;
            if (!cell.hasAttribute("data-rotate")) {
                cell.vAlign = 'bottom';
                return;
            }
            cell.vAlign = 'middle';
            cell.innerHTML = '<div class=hgs_rotate>' + cell.innerHTML + '</div>';
            w = cell.clientWidth;
            if (w > maxw) {
                maxw = w;
                cell.style.height = maxw + padding + 'px';
            }
            cell.firstChild.style.width = cell.firstChild.clientHeight + 'px';
        });
        if (maxw === -1) {
            return;
        }
        [].forEach.call(row.cells, function(cell) {
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