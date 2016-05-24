//->test模块
//需要把sum模块导入到当前的模块 ./->当前目录  ../->上一级目录
var sumM = require("./sum");//->把当前目录下的sum模块导入到我们的test模块中

var res = sumM.add(10, 20);
console.log(res);



//(function () {
//    function add() {
//        //<js code>
//    }
//})();
