~function (){
    /*
    *   ��̬������
    * */
    var banner = document.getElementById('banner');
    var inner = document.getElementById('inner');
    var tips = document.getElementById('tips');
    var imgList = inner.getElementsByTagName('img');
    var oLis = tips.getElementsByTagName('li'); //СԲ��
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
        //�Ѿ��ɹ���ȡ������ ������Ҫʵ�ֶ�̬���ݰ�s
        var str = '';
        for(var i=0; i<jsonData.length; i++){
            var cur = jsonData[i];
            str += '<div><img src="" trueSrc="'+ cur.img +'"  /></div>';
        }
        //�����λ���ڼ�һ����һ�ŷ���ĩβ�ͺ�
        str += '<div><img src="" trueSrc="'+ jsonData[0].img +'"  /></div>';
        inner.innerHTML = str;
        /*console.log(jsonData.length);*/
        //utils.setCss(inner,'width',jsonData.length*1000); //inner�Ŀ�Ȳ���д���ˣ��ж��������ݾͻ��ж��
        utils.setCss(inner,'width',(jsonData.length+1)*1000); //inner�Ŀ�Ȳ���д���ˣ��ж��������ݾͻ��ж��
        str = ""; //�һ�����str������һ��str�Ѿ�����ֵΪinner��html�ˡ����������õ�ʱ����Ҫ���
        for(var j = 0; j<jsonData.length; j++){
            if(j === 0){ //���ڵ�һ��li��Ĭ����ʽ������Ҫ��һ���ж�
                str += '<li class="selected"></li>';
            }else{
                str += '<li></li>';
            }
        }
        tips.innerHTML = str;
    }();

    //ʵ��ͼƬ�ӳټ���
    function imgDelay(){
        for(var i=0; i<imgList.length; i++){
            !function (i){ //��������к��������ıհ���������������ÿ��i��ֵ
                var curImg = imgList[i]; //ÿһ����ʵ���ڵ�ͼƬ
                if(curImg.isLoad) return; //������ع��Ͳ�Ҫ������
                var tempImg = new Image();
                tempImg.src = curImg.getAttribute('trueSrc');
                tempImg.onload = function (){
                    //ͼƬ�Ѿ�����ʱ��img��ǩ����سɹ�
                    curImg.src = this.src;
                    curImg.style.display = 'block';
                    //����͸����
                    zhufengAnimate(curImg,{opacity:1},500);
                    tempImg = null;
                }
                curImg.isLoad = true;
            }(i);
        }
    }
    window.setTimeout(imgDelay,1000);



    // �ֲ�ͼ�Զ��ֲ�   һ����ʱ����������һ��antoMove����
     timer = window.setInterval(autoMove,2000);
    var step = 0;
    //var count = jsonData.length + 1; //������¼�����ж�����ͼƬ,��Ϊ��������������һ��
    var count = imgList.length;
    //function autoMove(){  //�͸���ı�λ�õ�ֵ

        //step++; //�����˶����յ㣬����Ҫ�˶���Ŀ��ֵ
       /* if(step > 3){ //step = 4��ʱ���ֲ�ͼ����ӵ�4���˶�����5�ţ���Ϊû�е�5������Ҫ������Խ���ж�
            step = 0;
        }*/
        /*if(step > imgList.length -1){
            step = 0;
        }*/
        //�����¼���һ�ţ���������Ҫ�������ǵ�Խ���ж���������
       /* if(step > count -1){
            step = 0 ;

        }*/

        //zhufengAnimate(inner,{left: -step*1000},1000);
        //��һ���˶���ʱ���0 �˶��� 1   ����������step�Ѿ��޸ĳ� 1
        //�ڶ����˶���ʱ���1 �˶��� 2   ����������step�Ѿ��޸ĳ� 2
        //�������˶���ʱ���2 �˶��� 3   ����������step�Ѿ��޸ĳ� 3  ������ʾ��ͼƬ�Ѿ��ǵ�4����
        //���Ĵ��˶���ʱ����û�е�5�� ����Ҫ������
    //}

    //�޷�����
    function autoMove(){

        if(step == count -1){ //count��ͼƬ��������Ŀǰ��5��  4
            step = 0;
            utils.setCss(inner,'left',-step*1000);
        }
        step++;
        //�޷����� ==>���step��ֵ��ͼƬ����-1��ȣ�����step== imgList.length-1����Ϊ����������Ȼ����ͼƬ��step����ʼλ�õ�left���ص�ԭ�㡣���Ӿ����Ǵӿ�ͷ��ʼ��

         //�ۼ�֮���ֵ����Ҫ�˶����ĵط�����ỹû��ʼ�˶��ذ�
        zhufengAnimate(inner,{left: -step*1000},500); //������ǿ�ʼ�˶�
        focusAlign(); //ִ�н������
    }

   /* count = 0;
    window.setTimeout(function (){
        count ++;
        console.log(count)
    },0)
    console.log(count)
*/


    //�������
    function focusAlign(){
        for(var i=0; i<oLis.length; i++){
            var tempStep = step > oLis.length -1 ? 0 : step; //��Ҫһ����ʱ������������ͼƬ��һ�Ŷ�li�����ڵ������
            var curLi = oLis[i];
            tempStep === i ? curLi.className = "selected" : curLi.className = '';
        }
    };

    // �����ֹͣͣ�ֲ� ����뿪����
    banner.onmouseover = function () {
        //�����ֻͣҪ��ն�ʱ���Ϳ�����
        window.clearInterval(timer);
        //���Ұ�ť������
        leftBtn.style.display = rightBtn.style.display ='block';
    }
    banner.onmouseout = function () {
        //������ʱ���Ϳ�����
        timer = window.setInterval(autoMove,2000);
        //���Ұ�ť����
        leftBtn.style.display = rightBtn.style.display ='none';
    }

    //��ť���ʵ���ֲ�ͼ�л�
    ~function (){
        for(var i=0; i<oLis.length; i++){
            var curLi = oLis[i];
            curLi.selfIndex = i;
            curLi.onclick = function () {
                //ÿһ����ť��Ҫʵ�ֵ���¼���Ȼ���л��ֲ�ͼ
                step= this.selfIndex;
                zhufengAnimate(inner,{left: -step*1000},500);
                focusAlign();
            }
        }
    }();

    //������Ұ�ť��ʱ��ʵ��ͼƬ�л�
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
