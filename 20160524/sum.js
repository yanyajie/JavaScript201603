//->sum模块
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
//->暴露接口给外面的其它模块使用  module.exports->object
module.exports = {
    add: add
};

//->在NODE服务中,我们的全局对象不是window是global,在客户端JS中全局对象是window
//var sum=(function () {
//    function add() {
//        //<js code>
//    }
//    return {
//        add:add
//    }
//})();








