/**
 * Created by lucky on 2016/4/19.
 */
/*
*   �ڹ����Ĺ����У�����������ܻ��߷�����Ҫ����head��,��������Ĺ����ļ�������n���˹�ͬ��д������Ҫ������
* */
/*
*   ����ģʽ
* */
var utils = {
    listToArray : function (similarArray){
        /*
        *   try catch js���ݴ�
        * */
        var a = [];
        try{
            a = Array.prototype.slice.call(similarArray); //�����Ͳ�֧��ie7��ie8
        }catch (e){
            alert(); //ie7 �� ie8 ������
            var a = [];
            for(var i=0; i<similarArray.length; i++){
                a[a.length] = similarArray[i];
            }
        }
        return a;
    },
    jsonParse: function (jsonStr){ //��json��ʽ�ַ���ת��Ϊjson����
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr+")");
    }

}
/*
//�ص�����
function a(callback){
    //��ˮ
    //�տ���
    if(typeof callback === 'function'){
        callback();
    }

}
*/
