~function () {
    var oMark = document.getElementById("mark"), markW = oMark.offsetWidth, markH = oMark.offsetHeight;
    var winW = document.documentElement.clientWidth || document.body.clientWidth, winH = document.documentElement.clientHeight || document.body.clientHeight;

    function down(e) {
        this["strX"] = e.clientX;
        this["strY"] = e.clientY;
        this["strL"] = this.offsetLeft;
        this["strT"] = this.offsetTop;
        if (this.setCapture) {
            this.setCapture();
            on(this, "mousemove", move);
            on(this, "mouseup", up);
        } else {
            this["MOVE"] = move.myBind(this);
            this["UP"] = up.myBind(this);
            on(document, "mousemove", this["MOVE"]);
            on(document, "mouseup", this["UP"]);
        }

        //->当拖拽开始结束所有正在运行的动画
        window.clearInterval(this.flyTimer);
        window.clearInterval(this.dropTimer);
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

        //->垂直方向的运动
        drop.call(this);
    }

    on(oMark, "mousedown", down);

    //->水平
    function fly() {
        var _this = this, speedFly = _this["speedFly"];
        _this.flyTimer = window.setInterval(function () {
            if (Math.abs(speedFly) < 0.5) {
                window.clearInterval(_this.flyTimer);
                return;
            }
            speedFly *= 0.98;
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

    //->垂直
    function drop() {
        var _this = this, speedDrop = 9.8;
        _this["dropFlag"] = 0;
        _this.dropTimer = window.setInterval(function () {
            //->到达底边都让其在原来的基础上+1,但是一但下落或者弹起我们都回归到零,这样当到底边不在弹起,这个值会一直是累加下去
            if (_this["dropFlag"] > 1) {
                window.clearInterval(_this.dropTimer);
                return;
            }

            speedDrop *= 0.98;//->每一次都让速度衰减一下
            speedDrop += 10;//->为了让下落的速度在加快

            var curT = _this.offsetTop + speedDrop;
            if (curT >= (winH - markH)) {
                speedDrop *= -1;
                _this.style.top = winH - markH + "px";
                _this["dropFlag"]++;
            } else {
                _this.style.top = curT + "px";
                _this["dropFlag"] = 0;
            }
        }, 10);
    }
}();