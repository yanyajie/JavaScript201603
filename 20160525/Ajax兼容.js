//->使用JS高阶编程思想“惰性思想”封装我们的获取AJAX对象的方法
//1)提前处理好兼容,以后不需要在检测是否兼容了
//var getCss = (function () {
//    var flag = "getComputedStyle" in window;
//    return function (curEle, attr) {
//        var val = null;
//        if (flag) {
//            val = window.getComputedStyle(curEle, null)[attr];
//        } else {
//            val = curEle.currentStyle[attr];
//        }
//        return val;
//    }
//})();
//getCss(oDiv, "left");
//getCss(oDiv, "height");

//->这种方式叫做高级单例模式:使用惰性思想实现的单例模式,项目中我们的单例模式一般都是要这样的来使用->把一些公用的放在私有作用域中事先获取到,然后以后每一个方法需要使用都可以直接的获取使用了,不需要自己在单独的处理一遍
//var DOM = (function () {
//    var flag = "getComputedStyle" in window;
//
//    function getCss(curEle, attr) {
//        if (flag) {
//
//        } else {
//
//        }
//    }
//
//    function getElementsByClass(strClass, context) {
//        context = context || document;
//        if (flag) {
//
//        } else {
//
//        }
//    }
//
//    return {
//        getCss: getCss,
//        getElementsByClass: getElementsByClass
//    };
//})();

//2)函数的重写:在第一次执行的时候,判断是否兼容,如果兼容的话,我们把getXHR这个方法进行重写
var getXHR = function () {
    //->把每一种情况下,如何的创建AJAX对象都单独的编写成一个方法
    var ary = [function () {
        return new ActiveXObject("Msxml3.XMLHTTP");
    }, function () {
        return new XMLHttpRequest;
    }, function () {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }, function () {
        return new ActiveXObject("Msxml2.XMLHTTP");
    }];
    //->循环数组中的每一项,并且让每一项的方法都分别执行,在执行过程中,如果没有发生错误信息,说明当前浏览器支持这个方法,那么我们就把这个方法重新赋值给我们的getXHR，达到把getXHR这个原始方法重写的地步
    var flag = false, xhr = null;
    for (var i = 0; i < ary.length; i++) {
        var temp = ary[i];
        try {
            //->如果不报错说明当前的浏览器支持这个方法,我们把getXHR这个方法进行重写
            xhr = temp();
            getXHR = temp;
            flag = true;
            break;
        } catch (e) {
            //->执行其中的某一个方法报错了,说明当前的浏览器不兼容这个方法,我们则继续循环下一次,把下一个数组中的方法执行
            continue;
        }
    }
    //->说明当前的浏览器四个方法都不兼容
    if (!flag) {
        throw new Error("your browser is not support Ajax~");
    }
    return xhr;
};
var xhr = getXHR();
console.log(xhr);
console.log(getXHR);
xhr = getXHR();
console.log(xhr);

