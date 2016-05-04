~function (){
    /*
    *   动态绑定数据
    * */
    var inner = document.getElementById('inner');
    var tips = document.getElementById('tips');
    var imgList = inner.getElementsByTagName('img');
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
        inner.innerHTML = str;
        /*console.log(jsonData.length);*/
        utils.setCss(inner,'width',jsonData.length*1000); //inner的宽度不会写死了，有多少条数据就会有多宽
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






}();
