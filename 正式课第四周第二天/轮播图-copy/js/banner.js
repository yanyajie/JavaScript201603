~function (){
    /*
    *   动态绑定数据
    * */
    var banner = document.getElementById('banner');
    var inner = document.getElementById('inner');
    var tips = document.getElementById('tips');
    var imgList = inner.getElementsByTagName('img');
    var oLis = tips.getElementsByTagName('li'); //小圆点
    var leftBtn = document.getElementById('leftBtn');
    var rightBtn = document.getElementById('rightBtn');

    var jsonData = null;


    !function dataBind(){
        var xhr = new XMLHttpRequest();
        xhr.open('get','banner.txt?_='+Math.random()+"&haha=123",false);
        xhr.onreadystatechange = function (){
            if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
                jsonData = utils.jsonParse(xhr.responseText);
            }
        }
        xhr.send(null);
        //已经成功获取到数据 接下来要实现动态数据绑定s
        var str = '';
        for(var i=0; i<jsonData.length; i++){
            var cur = jsonData[i];
            str += '<div><img src="" trueSrc="'+ cur.img +'"  /></div>';
        }
        //在这个位置在加一个第一张放在末尾就好
        str += '<div><img src="" trueSrc="'+ jsonData[0].img +'"  /></div>';
        inner.innerHTML = str;
        /*console.log(jsonData.length);*/
        //utils.setCss(inner,'width',jsonData.length*1000); //inner的宽度不会写死了，有多少条数据就会有多宽
        utils.setCss(inner,'width',(jsonData.length+1)*1000); //inner的宽度不会写死了，有多少条数据就会有多宽
        str = ""; //我还想用str，而上一次str已经被赋值为inner的html了。所以我再用的时候需要清空
        for(var j = 0; j<jsonData.length; j++){
            if(j === 0){ //由于第一个li有默认样式，所以要做一个判断
                str += '<li class="selected"></li>';
            }else{
                str += '<li></li>';
            }
        }
        tips.innerHTML = str;
    }();

    //实现图片延迟加载
    function imgDelay(){
        for(var i=0; i<imgList.length; i++){
            !function (i){ //这个自运行函数产生的闭包是用来保存我们每次i的值
                var curImg = imgList[i]; //每一个真实存在的图片
                if(curImg.isLoad) return; //如果加载过就不要加载了
                var tempImg = new Image();
                tempImg.src = curImg.getAttribute('trueSrc');
                tempImg.onload = function (){
                    //图片已经在临时的img标签里加载成功
                    curImg.src = this.src;
                    curImg.style.display = 'block';
                    //处理透明度
                    zhufengAnimate(curImg,{opacity:1},500);
                    tempImg = null;
                }
                curImg.isLoad = true;
            }(i);
        }
    }
    window.setTimeout(imgDelay,1000);



    // 轮播图自动轮播   一个定时器不断驱动一个antoMove函数
     timer = window.setInterval(autoMove,2000);
    var step = 0;
    //var count = jsonData.length + 1; //用来记录我们有多少张图片,因为我们最后又添加了一张
    var count = imgList.length;
    //function autoMove(){  //就负责改变位置的值

        //step++; //当次运动的终点，我们要运动的目标值
       /* if(step > 3){ //step = 4的时候，轮播图是想从第4张运动到第5张，因为没有第5张所以要做拦截越界判断
            step = 0;
        }*/
        /*if(step > imgList.length -1){
            step = 0;
        }*/
        //由于新加了一张，所以我们要更新我们的越界判断拦截条件
       /* if(step > count -1){
            step = 0 ;

        }*/

        //zhufengAnimate(inner,{left: -step*1000},1000);
        //第一次运动的时候从0 运动到 1   动画结束后step已经修改成 1
        //第二次运动的时候从1 运动到 2   动画结束后step已经修改成 2
        //第三次运动的时候从2 运动到 3   动画结束后step已经修改成 3  但是显示的图片已经是第4张了
        //第四次运动的时候我没有第5张 所以要做拦截
    //}

    //无缝连接
    function autoMove(){

        if(step == count -1){ //count是图片的数量。目前是5个  4
            step = 0;
            utils.setCss(inner,'left',-step*1000);
        }
        step++;
        //无缝连接 ==>如果step的值和图片数量-1相等，就是step== imgList.length-1。做为拦截条件，然后让图片的step和起始位置的left都回到原点。在视觉上是从开头开始的

         //累加之后的值是我要运动到的地方，这会还没开始运动呢吧
        zhufengAnimate(inner,{left: -step*1000},500); //这里才是开始运动
        focusAlign(); //执行焦点对齐
    }

   /* count = 0;
    window.setTimeout(function (){
        count ++;
        console.log(count)
    },0)
    console.log(count)
*/


    //焦点对齐
    function focusAlign(){
        for(var i=0; i<oLis.length; i++){
            var tempStep = step > oLis.length -1 ? 0 : step; //需要一个临时的来处理由于图片多一张而li不存在的情况。
            var curLi = oLis[i];
            tempStep === i ? curLi.className = "selected" : curLi.className = '';
        }
    };

    // 鼠标悬停停止轮播 鼠标离开继续
    banner.onmouseover = function () {
        //鼠标悬停只要清空定时器就可以了
        window.clearInterval(timer);
        //左右按钮都出来
        leftBtn.style.display = rightBtn.style.display ='block';
    }
    banner.onmouseout = function () {
        //启动定时器就可以了
        timer = window.setInterval(autoMove,2000);
        //左右按钮隐藏
        leftBtn.style.display = rightBtn.style.display ='none';
    }

    //按钮点击实现轮播图切换
    ~function (){
        for(var i=0; i<oLis.length; i++){
            var curLi = oLis[i];
            curLi.selfIndex = i;
            curLi.onclick = function () {
                //每一个按钮都要实现点击事件，然后切换轮播图
                step= this.selfIndex;
                zhufengAnimate(inner,{left: -step*1000},500);
                focusAlign();
            }
        }
    }();

    //点击左右按钮的时候实现图片切换
    leftBtn.onclick = function (){
        if(step ==0){
            step = count -1;
            utils.setCss(inner,'left',-step*1000);
        }
        step--;
        zhufengAnimate(inner,{left: -step*1000},500,2);
        focusAlign();
    }

    rightBtn.onclick = autoMove;









}();
