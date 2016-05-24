var http = require("http");
var url = require("url");
var fs = require("fs");
var contentType = require("./nodeAPI/contentType");

//->创建服务并且监听端口
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;

    //->如果请求的资源文件是HTML/CSS/JS文件
    var reg = /\.(TXT|JSON|HTML|CSS|JS|PNG|JPG|GIF|JPEG|SVG|ICON|ICO|MP3|OGG|WAV|MP4|WEBM|BMP)/i;
    if (reg.test(pathname)) {
        try {
            //->通过获取文件的后缀名计算出返回数据的类型
            var suffix = reg.exec(pathname)[1].toUpperCase();
            var conType = contentType.getType(suffix);

            //->读取文件内容并且返回即可:但是对于图片和音视频还需要特殊处理
            reg = /^(TXT|JSON|HTML|CSS|JS)$/i;
            var conFile = null;
            if (reg.test(suffix)) {
                conFile = fs.readFileSync("." + pathname, "utf8");
                response.writeHead(200, {'content-type': conType + ';charset=utf-8;'});
            } else {
                conFile = fs.readFileSync("." + pathname);
                response.writeHead(200, {'content-type': conType});
            }
            response.end(conFile);
        } catch (e) {

        }
        return;
    }

});
server.listen(80, function () {
    console.log("当前的服务已经启动,我们正在监听80端口!");
});