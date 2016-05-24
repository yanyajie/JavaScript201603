function getType(suffix) {
    var suffixType = null;
    switch (suffix) {
        case "TXT":
            suffixType = "text/plain";
            break;
        case "JSON":
            suffixType = "application/json";
            break;
        case "HTML":
            suffixType = "text/html";
            break;
        case "CSS":
            suffixType = "text/css";
            break;
        case "JS":
            suffixType = "text/javascript";
            break;
        case "PNG":
            suffixType = "image/png";
            break;
        case "JPG":
        case "JPEG":
            suffixType = "image/jpeg";
            break;
        case "GIF":
            suffixType = "image/gif";
            break;
        case "BMP":
            suffixType = " application/x-MS-bmp";
            break;
        case "SVG":
            suffixType = "image/svg+xml";
            break;
        case "ICO":
        case "ICON":
            suffixType = "image/x-icon";
            break;
        case "MP3":
            suffixType = "audio/mpeg";
            break;
        case "OGG":
            suffixType = "audio/ogg";
            break;
        case "WAV":
            suffixType = "audio/wav";
            break;
        case "MP4":
            suffixType = "video/mp4";
            break;
        case "WEBM":
            suffixType = "video/webm";
            break;
    }
    return suffixType;
}
module.exports = {
    getType: getType
};

