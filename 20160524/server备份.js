//->NODE中天生自带的模块有很多,常用的:
// ->http:包含了我们创建服务,监听端口等功能
// ->fs:包含了我们获取文件中的内容和向文件中写内容的方法(文件的IO)
// ->url:包含了我们接受和解析客户端请求的方法
var http = require("http");
var fs = require("fs");
var url = require("url");

//->createServer:创建一个服务 ->当创建服务成功的时候并且客户发送了请求,执行回调函数,而且还给这个回调函数传递了两个参数
var server = http.createServer(function (request, response) {
    //->request:[object]存放客户端的请求信息
    //->response:[object]用来向客户端返回内容或者数据的
    //console.log("哇卡卡,我可以接受请求了~~");

    //->request.url:存放的是当前客户端向服务器端请求的URL地址
    //->url.parse(URL地址,false/true):url这个模块中的parse方法,可以把客户端请求的URL地址解析成一个对象格式的数据;第二个参数默认是false,如果为true的话,可以把地址中问号后面传递进来的参数值进行解析
    var urlObj = url.parse(request.url, true);
    //->pathname:存储的是当前请求文件的目录/地址(不包含问号后面的参数)
    //->query:存储的是当前请求地址问号后面传递的参数值,如果第二个参数为false,存储的格式是一个字符串,如果第二个参数为true的话,存放的是一个对象,并且自动的把传递进来的多组参数进行了解析
    var pathname = urlObj.pathname, query = urlObj.query;

    //->前端路由:通过请求内容的不一样,我们服务器也会返回不同的内容
    if (pathname === "/index.html") {
        response.writeHead(200, {'content-type': 'text/plain;charset=utf-8;'});
        response.end("我是index.html页面");
        return;
    }

    if (pathname === "/index.css") {
        response.writeHead(200, {'content-type': 'text/plain;charset=utf-8;'});
        response.end("我是index.css文件");
        return;
    }


    //->让服务器端向客户端返回一些内容
    //response.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});//->200是HTTP STATUS(网络状态码),200代表的是响应成功 后面传递的对象就是在这是响应的头部信息:content-type响应内容的类型或者格式 text/plain纯文本 charset=utf-8设置响应的内容是一个utf-8编码格式
    //response.write("我的名字叫做珠峰培训~");
    //response.end("my name is zhufeng");
});
server.listen(1111, function () {//->当端口号监听成功后执行的回调函数,此时我们创建的服务监听的是80这个端口号
    console.log("正在监听1111端口~");
});

//->都完成后,以后就可以在浏览器中输入“http://localhost:1111”/“http://本地IP地址:1111”就可以向当前的服务发送请求了,并且每当发送一次请求,都会把createServer中的回调函数执行


//->自己写的模块:
// 在NODE环境中,创建一个JS就相当于创建了一个模块
// 每一个模块之间是互不干扰的(里面的变量和方法都是自己私有的),不能直接的在另外一个模块中调取其它模块中的方法
// 如果想在当前的模块A中调取另外一个模块B中的方法:
// ->在B中把需要让别人调取的方法暴露出来
// ->在A中把B模块导入进来 AMD/CMD->按需加载:当前程序需要用到谁就把谁导入进来