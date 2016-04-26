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
            //处理性别这个列的innerHTML显示不正确问题，男女问题，如果分不清自己if else去
            key === 'sex' ?  td.innerHTML =  cur[key] == 0 ? '女' :  '男'   :td.innerHTML = cur[key];
             //把cur[key]这个从数据中读到的属性值赋值给这个列的innerHTML
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
    //如果想用sort方法，首先要保证是一个数组。点击的时候给tbody里的行排列。所以先把tbody下的rows这个类数组转化为数组
    console.log(this);
    //需要处理每次点击过后不能把排序标识恢复问题
    for(var j=0; j<ths.length; j++){
        if(ths[j] != this){
            ths[j].sortFlag = -1;
        }
    }
    var that = this;
    var ary = utils.listToArray(bodyTrs);
    this.sortFlag *= -1;
    ary = ary.sort(function (a,b){ //给数组排序，dom映射关系
        //a 和 b 此时分别代表的什么？ 分别代表上下两行
        //而我们排列是按照每行里面所有列这个集合的中点击的那一列的innerHTML的内容去排列。被忘了把innerHTML获取来的字符串转化成数字
        return (parseFloat(a.cells[that.index].innerHTML) - parseFloat(b.cells[that.index].innerHTML))*that.sortFlag; //排列倒叙如果每次在sort执行的时候，把return这个值乘以-1就ok
        //还要判断是不是名字，如果当前列是名字，通过localeCompare
    });
    //把排好序的数组利用数据绑定重新放回到tbody里
    var frg = document.createDocumentFragment(); //先创建一个文档碎片
    for(var i=0; i<ary.length; i++){ //循环把已经拍好序的数组的每一项(行)appedn到这个文档碎片中
        frg.appendChild(ary[i]);
    }
    tbody.appendChild(frg);
    frg = null;
}

/*
*   给表头的每一列绑定点击事件,点击的时候按照当前列排序
* */
for(var i=0; i<ths.length; i++){
    var cur = ths[i];

    cur.index = i; //给每一个表头的列添加一个自定义属性，用来保存索引。因为点击的时候需要tbody里的行里的列按照这个索引的innerHTML去排序
    cur.sortFlag = -1;
    if(cur.className == 'cursor'){ //只给带小手的绑定事件
        cur.onclick = function (){
            //这里的this是你点击事件发生时候那个元素
            /*
            *   当每次点击事件发生时执行sort这个方法，sort方法中的this是window。但是我们排序要当前点击的表头排序。所以需要在sort方法中能取到点击元素的这个this ==> call
            * */
            sort.call(this); //点击的时候排序就ok
            changeColor();
        }
    }
}





