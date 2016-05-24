var http = require("http");
var url = require("url");
var fs = require("fs");
var contentType = require("./nodeAPI/contentType");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;

    //->如果请求的资源文件是HTML/CSS/JS文件
    var reg = /\.(TXT|JSON|HTML|CSS|JS|PNG|JPG|GIF|JPEG|SVG|ICON|ICO|MP3|OGG|WAV|MP4|WEBM|BMP)/i;
    if (reg.test(pathname)) {
        try {
            var suffix = reg.exec(pathname)[1].toUpperCase();
            var conType = contentType.getType(suffix);
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
server.listen(80);