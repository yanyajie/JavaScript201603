var http = require("http");
var fs = require("fs");
var url = require("url");
var suffixFn = require("./nodeModule/suffixFn");
var customer = require("./nodeModule/customer");

//->创建服务监听端口
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;

    //->客户端请求的是一些资源文件
    var reg = /\.(HTML|JS|CSS|TXT|JSON|JPG|JPEG|PNG|GIF|BMP|ICO|SVG)/i;
    if (reg.test(pathname)) {
        try {
            var suffix = reg.exec(pathname)[1].toUpperCase();
            var suffixType = suffixFn.querySuffixType(suffix);
            var conFile = /^(HTML|JS|CSS|TXT|JSON)$/i.test(suffix) ? fs.readFileSync("." + pathname, "utf8") : fs.readFileSync("." + pathname);
            response.writeHead(200, {'content-type': suffixType + ";charset=utf-8;"});
            response.end(conFile);
        } catch (e) {
            response.writeHead(404);
            response.end();
        }
        return;
    }

    //->以下都是在实现我们的数据请求接口
    var con = null;
    if (pathname === "/getAllData") {
        con = customer.getAllData();
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(con);
        return;
    }

    //->GET请求传递给服务器端的信息都是存放在URL后面的问号传参中的,我们通过url.parse解析数来的query这个值中就存储了,想获取的话,直接的通过query获取即可
    if (pathname === "/getData") {
        var cusId = query["id"];//->获取客户端传递给服务器端的客户ID值
        con = customer.getData(cusId);
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(con);
        return;
    }

    if (pathname === "/delete") {
        cusId = query["id"];
        con = customer.deleteInfo(cusId);
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(con);
        return;
    }

    //->POST是把内容放在HTTP的主体中传递给服务器的,不能通过URL地址解析出来了,需要我们获取主体中的内容才可以得到
    var temp = "";
    if (pathname === "/add") {
        request.addListener('data', function (chunk) {
            temp += chunk;
        });
        request.addListener('end', function () {
            //->主体的内容已经接收完成
            //temp->'{"name":"xx","age":xx,"phone":"xx","address":"xx"}'
            temp = JSON.parse(temp);
            temp["name"] = temp["name"] || "珠峰培训";
            temp["age"] = temp["age"] || 25;
            temp["phone"] = temp["phone"] || "13041086186";
            temp["address"] = temp["address"] || "北京市昌平区回龙观";
            con = customer.addInfo(temp);

            response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            response.end(con);
        });
        return;
    }

    if (pathname === "/update") {
        request.addListener('data', function (chunk) {
            temp += chunk;
        });
        request.addListener('end', function () {
            //temp->'{"id":1,"name":"xx","age":xx,"phone":"xx","address":"xx"}'
            temp = JSON.parse(temp);
            con = customer.updateInfo(temp);
            response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            response.end(con);
        });
        return;
    }
});
server.listen(80, function () {
    console.log("当前服务已经启动,我们正在监听80端口~");
});



