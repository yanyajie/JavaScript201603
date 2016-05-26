var tabList = document.getElementById("tabList");

//->通过服务器端提供的API接口,我们获取数据,并且进行数据绑定
bindData();
function bindData() {
    function callback(data) {
        var str = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str += '<li>';
            str += '<span class="w50">' + curData["id"] + '</span>';
            str += '<span>' + curData["name"] + '</span>';
            str += '<span class="w50">' + curData["age"] + '</span>';
            str += '<span>' + curData["phone"] + '</span>';
            str += '<span class="w250">' + curData["address"] + '</span>';
            str += '<span class="w150 last">';
            str += '<a href="add.html?id=' + curData["id"] + '">修改</a>';//->点击修改的时候还是跳转到add页面,但是我们需要把当前客户的ID传递过去,这样的话才可以知道具体是要修改哪一个客户
            str += '<a href="javascript:;" cusId="' + curData["id"] + '">删除</a>';
            str += '</span>';
            str += '</li>';
        }
        tabList.innerHTML = str;
    }

    //->我们AJAX请求数据,成功后执行callback这个方法,而且此方法中的data存储值就是我们请求回来的数据
    //sendAJAX({
    //    url: "/getAllData",
    //    type: "get",
    //    async: true,
    //    data: null,
    //    success: callback
    //});
    $.ajax({
        url: "/getAllData",
        type: "get",
        async: true,
        data: null,
        success: callback
    });
}

//->使用事件委托实现删除操作
tabList.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;
    if (tar.tagName.toUpperCase() === "A" && tar.innerHTML === "删除") {
        var cusId = tar.getAttribute("cusId");

        //->在删除前做一个提示:res->true说明用户点击的是确定按钮 res->false用户点击的是取消按钮
        var res = window.confirm("确定要删除编号为 [" + cusId + "] 这个客户吗?");
        if (!res) {
            return;
        }

        //->把后台的数据删除
        sendAJAX({
            url: "/delete?id=" + cusId,
            type: "get",
            success: function (data) {
                if (data["code"] == 0) {
                    //->把页面中的HTML结构删除
                    tabList.removeChild(tar.parentNode.parentNode);
                }
            }
        });
    }
};