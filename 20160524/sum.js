//->sumģ��
function add() {
    var total = null;
    for (var i = 0; i < arguments.length; i++) {
        var cur = Number(arguments[i]);
        if (isNaN(cur)) {
            continue;
        }
        total += cur;
    }
    return total;
}
//->��¶�ӿڸ����������ģ��ʹ��  module.exports->object
module.exports = {
    add: add
};

//->��NODE������,���ǵ�ȫ�ֶ�����window��global,�ڿͻ���JS��ȫ�ֶ�����window
//var sum=(function () {
//    function add() {
//        //<js code>
//    }
//    return {
//        add:add
//    }
//})();








