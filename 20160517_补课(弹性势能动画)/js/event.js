Function.prototype.myBind = function myBind(context) {
    var _this = this;
    var outerArg = [].slice.call(arguments, 1);
    if ("bind" in Function.prototype) {
        outerArg.unshift(context);
        return _this.bind.apply(_this, outerArg);
    }
    return function () {
        var innerArg = [].slice.call(arguments, 0);
        _this.apply(context, outerArg.concat(innerArg));
    }
};

function bind(curEle, type, fn) {
    if (document.addEventListener) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
    var ary = curEle["myBind" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].photo === fn) {
            return;
        }
    }
    var tempFn = fn.myBind(curEle);
    tempFn.photo = fn;
    ary.push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

function unbind(curEle, type, fn) {
    if (document.removeEventListener) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    var ary = curEle["myBind" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].photo === fn) {
                curEle.detachEvent("on" + type, ary[i]);
                ary.splice(i, 1);
                return;
            }
        }
    }
}

function run(e) {
    e = e || window.event;
    if (window.event) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }

    var ary = this["myEvent" + e.type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            typeof curFn === "function" ? curFn.call(this, e) : (ary.splice(i, 1), i--);
        }
    }
}

function on(curEle, type, fn) {
    !curEle["myEvent" + type] ? curEle["myEvent" + type] = [] : null;
    var ary = curEle["myEvent" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);
    bind(curEle, type, run);
}

function off(curEle, type, fn) {
    var ary = curEle["myEvent" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === fn) {
                ary[i] = null;
                return;
            }
        }
    }
}