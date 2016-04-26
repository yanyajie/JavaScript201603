/**
 * Created by lucky on 2016/4/19.
 */
var utils = {
    listToArray : function (similarArray){
        /*
        *   try catch js
        * */
        var a = [];
        try{
            a = Array.prototype.slice.call(similarArray);
        }catch (e){
            alert(); //ie7 和 8 弹出
            var a = [];
            for(var i=0; i<similarArray.length; i++){
                a[a.length] = similarArray[i];
            }
        }
        return a;
    },
    jsonParse: function (jsonStr){
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr+")");
    }

}
