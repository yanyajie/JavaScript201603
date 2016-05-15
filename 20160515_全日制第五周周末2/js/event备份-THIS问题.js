//->myBind:基于内置类Function的原型，使用柯理化函数思想，扩展一个方法，实现内置bind方法的兼容处理，达到提前预先处理函数THIS指向的问题；
Function.prototype.myBind = function myBind(context) {
    var _this = this;
    var outerArg = [].slice.call(arguments, 1);
    //if ("bind" in Function.prototype) {
    //    return this.bind.apply(this, outerArg.unshift(context));
    //}
    return function () {
        var innerArg = [].slice.call(arguments, 0);
        _this.apply(context, outerArg.concat(innerArg));
    }
};

function bind(curEle, type, fn) {
    if ("addEventListener" in document) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->经过预处理其实相当于给其化了妆,为了后面可以查找到,我们需要把之前的照片贴上
    var tempFn = fn.myBind(curEle);
    tempFn.photo = fn;

    //->创建一个临时的容器,用来存放我们化妆后的结果
    !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
    curEle["myBind" + type].push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

function unbind(curEle, type, fn) {
    if ("removeEventListener" in document) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    var ary = curEle["myBind" + type];
    if (ary) {
        for (var i = 0, len = ary.length; i < len; i++) {
            var curFn = ary[i];
            if (curFn.photo === fn) {
                curEle.detachEvent("on" + type, curFn);
                ary.splice(i, 1);
                return;
            }
        }
    }
}