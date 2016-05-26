var oSubmit = document.getElementById("submit");
var userName = document.getElementById("userName"),
    userAge = document.getElementById("userAge"),
    userPhone = document.getElementById("userPhone"),
    userAddress = document.getElementById("userAddress");

//->当前的这个页面不一定仅仅是实现增加的,还有可能是实现修改的,具体是修改还是增加取决于地址栏中是否存在问号传参,存在的话是修改,反之是增加
//window.location.href ->如果没有赋值的话,就是获取当前本页面地址栏中的URL地址
function queryURLParameter() {
    var curURL = window.location.href;
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]+)/g;
    var res = reg.exec(curURL);
    while (res) {
        obj[res[1]] = res[2];
        res = reg.exec(curURL);
    }
    return obj;
}
//->如果cusId值是undefined,说明当前页面并没有传递ID进来,实现的功能应该是增加(flag=false),反之是修改(flag=true)
var cusId = queryURLParameter()["id"];
var flag = (typeof cusId === "undefined") ? false : true;

//->当前是修改:首先获取客户信息,并且把信息设置到文本框中
if (flag) {
    sendAJAX({
        url: "/getData?id=" + cusId,
        type: "get",
        success: function (jsonData) {
            if (jsonData["code"] == 0) {
                var data = jsonData["data"];
                userName.value = data["name"];
                userAge.value = data["age"];
                userPhone.value = data["phone"];
                userAddress.value = data["address"];
            }
        }
    });
}

oSubmit.onclick = function () {
    //->首先获取四个文本框中的内容
    var name = userName.value.replace(/^ +| +$/g, "");
    var age = userAge.value.replace(/^ +| +$/g, "");
    var phone = userPhone.value.replace(/^ +| +$/g, "");
    var address = userAddress.value.replace(/^ +| +$/g, "");

    //->通过POST方式向服务器发送请求,把文本框中的内容拼接成一个JSON字符串的方式传递给服务器
    var obj = {
        name: name,
        age: age,
        phone: phone,
        address: address
    };

    if (flag) {//->当前的操作是修改操作
        obj["id"] = cusId;
        sendAJAX({
            url: "/update",
            type: "post",
            data: JSON.stringify(obj),
            success: function (data) {
                if (data["code"] == 0) {
                    alert("修改成功!");
                    window.location.href = "index.html";
                }
            }
        });
        return;
    }

    //->当前的操作是增加操作
    //sendAJAX({
    //    url: "/add",
    //    type: "post",
    //    data: JSON.stringify(obj),
    //    success: function (data) {
    //        if (data["code"] == 0) {
    //            alert("创建成功!");
    //            //->JS中实现页面跳转
    //            window.location.href = "index.html";
    //        }
    //    }
    //});

    $.ajax({
        url: "/add",
        type: "post",
        data: JSON.stringify(obj),
        success: function (data) {
            if (data["code"] == 0) {
                alert("创建成功!");
                //->JS中实现页面跳转
                window.location.href = "index.html";
            }
        }
    });
};