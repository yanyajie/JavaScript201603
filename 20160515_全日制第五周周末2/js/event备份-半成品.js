Function.prototype.myBind = function myBind(context) {
    var _this = this;
    var outerArg = [].slice.call(arguments, 1);
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
    !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
    //->重复判断:如果已经存储过了就不在存储了
    var ary = curEle["myBind" + type];
    for (var i = 0, len = ary.length; i < len; i++) {
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

/*以下都是在解决顺序问题*/
//->on:把需要绑定的所有方法依次放到自定义的事件池中
function on(curEle, type, fn) {
    !curEle["myEvent" + type] ? curEle["myEvent" + type] = [] : null;
    var ary = curEle["myEvent" + type];
    for (var i = 0, len = ary.length; i < len; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);

    //->把我们的RUN方法存放在内置的事件池中(我们上面的BIND方法已经把THIS和重复的问题都解决掉了)
    bind(curEle, type, run);
}

//->off:在自定义的事件池中移除我们需要移除的方法
function off(curEle, type, fn) {
    var ary = curEle["myEvent" + type];
    if (ary) {
        for (var i = 0, len = ary.length; i < len; i++) {
            if (ary[i] === fn) {
                ary.splice(i, 1);
                return;
            }
        }
    }
}

//->run:首先把run放在内置的事件池中,当行为触发,run执行的时候,我们在把自定义事件池中的所有方法依次的执行
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
            if (typeof curFn === "function") {
                curFn.call(this, e);//->每一次分别的执行fn1-fn12方法的时候,我们都让每一个方法中的this变为当前的元素,而且给每一个方法都传递了一个事件对象->还可以在传递之间先把所有的事件对象的兼容问题都解决掉
            }
        }
    }
}