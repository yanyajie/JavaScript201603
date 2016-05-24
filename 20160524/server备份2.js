var http = require("http");
var url = require("url");
var fs = require("fs");

//->创建服务并且监听端口
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;
    //->前端路由判断
    if (pathname === "/index.html") {
        //->获取项目文件index.html页面中的内容,并且把内容响应给客户端进行加载
        //->fs.readFileSync:读取指定文件中的内容(同步读取,只有把内容读取完成后才会执行下面的代码),获取的内容都是一个utf8编码格式的字符串
        var htmlCon = fs.readFileSync("./index.html", "utf8");
        response.writeHead(200, {'content-type': 'text/html;charset=utf-8;'});
        response.end(htmlCon);
        return;
    }

    if (pathname === "/css/index.css") {
        var cssCon = fs.readFileSync("./css/index.css", "utf8");
        response.writeHead(200, {'content-type': 'text/css;charset=utf-8;'});
        response.end(cssCon);
        return;
    }

    if (pathname === "/js/index.js") {
        var jsCon = fs.readFileSync("./js/index.js", "utf8");
        response.writeHead(200, {'content-type': 'text/javascript;charset=utf-8;'});
        response.end(jsCon);
        return;
    }
});
server.listen(80, function () {
    console.log("当前的服务已经启动,我们正在监听80端口!");
});