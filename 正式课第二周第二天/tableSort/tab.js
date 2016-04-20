//获取表格内元素 这是获取方式只有在table表格里才生效
var tab = document.getElementById('tab');
var thead = tab.tHead; //
var headTr = thead.rows[0]; //获取表头的第一行
var ths = headTr.cells; //单元格其实也就是列  获取表头第一行里所有的列
var tbody = tab.tBodies[0]; //表格主体，一个表格可以有多个主体所以要用索引
var bodyTrs = tbody.rows; //表格主体里所有的所有的行

//给表格动态绑定数据  1 通过ajax获取数据 async Javascript and XML
/*
*   ajax: 1 创建一个xhr对象也是请求对象
*           var xhr = new XMLHttpRequest()
* */
    var xhr = new XMLHttpRequest(); //创建一个请求对象 g
    xhr.open('get','data.txt',false); //打开这个请求对象 param1: 请求方式get & post param2：请求接口就是你到哪去拿数据(后端同学提供)  param3: 同步还是异步 true = async  false 同步
    xhr.onreadystatechange = function (){ //实时监听请求状态，当请求成功或者失败的时候，都会发生状态的改变。并且返回相应状态码，我们通过判断状态码的值就知道是否请求成功。如果请求成功要做相应得对数据的处理。
        if(xhr.readyState == 4 && xhr.status == 200){ //请求成功
            res =utils.jsonParse(xhr.responseText); //相当于添加了一个全局的。用来动态数据的
        }
    }
    xhr.send(null); //发送请求
    console.log(res); //已经在全局的window下存在了一个叫做res的变量


/*
*   数据的动态绑定 把通过利用ajax获取过来的数据和我们的table表格绑定起来
*
* */

function bindDate(){ //动态绑定数据
    var frg = document.createDocumentFragment(); //创建一个文档碎片
    //循环的向文档碎片添加
    for(var i=0; i<res.length; i++){
        var tr = document.createElement('tr'); //给一条数据都创建一个行
        //需要for in循环去 遍历数据中的属性个数，有多少个属性(name,age,hurt,sex);
        var cur = res[i]; //cur每次循环时候的那个当前对象，也就是当前的那一组数据
        for (var key in cur){ //通过属性的个数循环创建列。每一个单元的html就是当前这个对象的属性值
            var td = document.createElement('td');
            td.innerHTML = cur[key]; //把cur[key]这个从数据中读到的属性值赋值给这个列的innerHTML
            tr.appendChild(td);
        }
        frg.appendChild(tr);
    }
    tbody.appendChild(frg);
    frg = null;
}
bindDate();

/*
* 我要实现隔行变色
*
**/
function changeColor(){
    for(var i=0; i<bodyTrs.length; i++){
        bodyTrs[i].className = i%2 ? 'bg' : null;
    }
}
changeColor();

/*
*   点击年龄实现排序
* */
function sort(){ //做到我们的排序了，按照你当前点击的表头为依据排序
    //假如我当前点击的是年龄，那么是不是需要按照年龄来排序

    var ary = utils.listToArray(bodyTrs); //
    ary.sort(function (a,b){
        //return
    });
}

/*
*   绑定点击事件
* */
var cursorThs = tab.getElementsByClassName('cursor'); //我以后要把带cursor这个class的表头都可以做到点击排序。以后拓展多列点击的时候，直接加一个cursor这个类就ok了
for(var i=0; i<cursorThs.length; i++){ //给每一个带cursor这个class的头都绑定点击排序事件
    var cur = cursorThs[i];
    cur.onclick = function (){ //点击事件发生
        //this ??? 是你当前点击表头单元格
        sort.call(this); //这个this是你当前点击的元素
    }

}





