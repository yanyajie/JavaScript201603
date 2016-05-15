//->bind:实现DOM2事件绑定,兼容所有的浏览器
function bind(curEle, type, fn) {
    //->标准浏览器
    if ("addEventListener" in document) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    curEle.attachEvent("on" + type, fn);
}

//->unbind:实现DOM2事件移除绑定,兼容所有的浏览器
function unbind(curEle, type, fn) {
    //->标准浏览器
    if ("removeEventListener" in document) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    curEle.detachEvent("on" + type, fn);
}