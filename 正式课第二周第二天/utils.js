/**
 * Created by lucky on 2016/4/19.
 */
/*
*   在工作的过程中，导入其他框架或者方法需要放在head里,这个公共的工具文件，可能n个人共同编写，所以要区别开来
* */
/*
*   单例模式
* */
var utils = {
    listToArray : function (similarArray){
        /*
        *   try catch js中容错
        * */
        var a = [];
        try{
            a = Array.prototype.slice.call(similarArray); //根本就不支持ie7和ie8
        }catch (e){
            alert(); //ie7 和 ie8 弹出，
            var a = [];
            for(var i=0; i<similarArray.length; i++){
                a[a.length] = similarArray[i];
            }
        }
        return a;
    },
    jsonParse: function (jsonStr){ //把json格式字符串转化为json对象
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr+")");
    }

}
/*
//回调函数
function a(callback){
    //烧水
    //烧开了
    if(typeof callback === 'function'){
        callback();
    }

}
*/
