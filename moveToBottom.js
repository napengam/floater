function moveToBottom(id) {
    var d, t, h, wh;
    d = document.getElementById(id);
    d.style.position = 'absolute';
    t = d.offsetTop + d.clientHeight;
    while (d.offsetParent.tagName !== 'BODY') {
        d = d.offsetParent;
        t += d.offsetTop;
    }
    h = document.body.clientHeight;
    wh = window.innerHeight;
    h = h < wh ? wh : wh;
    d = document.getElementById(id);
    d.style.top = h - d.clientHeight - 4 + 'px';
    d.style.left = window.innerWidth / 2 - d.clientWidth / 2 + 'px';
    d.style.position = 'fixed';
}
window.onresize = function() {
    moveToBottom('foot');
};