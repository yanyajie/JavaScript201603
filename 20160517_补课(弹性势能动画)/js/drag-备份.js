~function () {
    var oMark = document.getElementById("mark"), markW = oMark.offsetWidth, markH = oMark.offsetHeight;
    var winW = document.documentElement.clientWidth || document.body.clientWidth, winH = document.documentElement.clientHeight || document.body.clientHeight;

    function down(e) {
        this["strX"] = e.clientX;
        this["strY"] = e.clientY;
        this["strL"] = this.offsetLeft;//->通过JS盒子模型属性获取到元素的样式值都是一个整数(对于小数会自己进行四舍五入)
        this["strT"] = this.offsetTop;
        if (this.setCapture) {
            this.setCapture();
            on(this, "mousemove", move);
            on(this, "mouseup", up);
        }else{
            this["MOVE"] = move.myBind(this);
            this["UP"] = up.myBind(this);
            on(document, "mousemove", this["MOVE"]);
            on(document, "mouseup", this["UP"]);
        }

        //->当拖拽开始结束所有正在运行的动画
        window.clearInterval(this.flyTimer);
    }

    function move(e) {
        var curL = e.clientX - this["strX"] + parseFloat(this["strL"]);
        var curT = e.clientY - this["strY"] + parseFloat(this["strT"]);
        var minL = 0, minT = 0, maxL = winW - markW, maxT = winH - markH;
        curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
        curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
        this.style.left = curL + "px";
        this.style.top = curT + "px";

        //->计算水平方向运动的速度
        if (!this["prevFly"]) {
            this["prevFly"] = this.offsetLeft;
        } else {
            this["speedFly"] = this.offsetLeft - this["prevFly"];
            this["prevFly"] = this.offsetLeft;
        }
    }

    function up(e) {
        if (this.releaseCapture) {
            this.releaseCapture();
            off(this, "mousemove", move);
            off(this, "mouseup", up);
        } else {
            off(document, "mousemove", this["MOVE"]);
            off(document, "mouseup", this["UP"]);
        }

        //->水平方向的运动
        fly.call(this);
    }

    on(oMark, "mousedown", down);


    //->水平
    function fly() {
        var _this = this, speedFly = _this["speedFly"];
        _this.flyTimer = window.setInterval(function () {
            //->当盒子运动结束后,我们还需要把定定时器清除掉:因为我们每一次都是拿offsetLeft来操作的,我们知道,这个属性是无法获取小数值的,对于小于0.5的小数自己就舍了,这样的话如果我们的速度小于0.5,我们上一次加了这个速度值,下一次在获取当前位置还是把上一次加的那个速度给省略掉了
            if (Math.abs(speedFly) < 0.5) {
                window.clearInterval(_this.flyTimer);
                return;
            }

            //->为了让动画停止下来,我们还需要每一次给速度进行衰减
            speedFly *= 0.98;

            //->每一次都在当前的位置基础上加上速度即可,但是需要处理两边的边界判断,到达边界后反弹
            var curL = _this.offsetLeft + speedFly;
            if (curL >= (winW - markW)) {
                speedFly *= -1;
                _this.style.left = winW - markW + "px";
            } else if (curL <= 0) {
                speedFly *= -1;
                _this.style.left = "0px";
            } else {
                _this.style.left = curL + "px";
            }
        }, 10);
    }


    /*--实现抛物线运动:水平+垂直--*/
    //[水平]
    //->速度:和拖拽的距离是没有关系的,和开始的拖拽速度也没有关系,只和鼠标在最后快松开的那一瞬间我们的拖拽速度有干系
    //->浏览器都会有一个自己的最小处理反应时间,例如:不是移动一丢丢就会触发一次mousemove,而是浏览器只有过了最小反应时间才会感知到下一次的移动
    //->我们最后一次即将松开的那个速度===我们浏览器最后一次最小感应时间内运动的距离
}();