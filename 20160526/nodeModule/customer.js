var fs = require("fs");

//->添加客户信息
function addInfo(temp) {
    //->先获取之前的,然后和我们的新增加的进行组合,最后把最新的重新的放入到文件中
    var con = fs.readFileSync("./nodeModule/customerInfo.json", "utf8");
    con = (con != "") ? JSON.parse(con) : [];
    //->动态获取新增加数据的ID
    if (con.length === 0) {
        temp["id"] = 1;
    } else {
        temp["id"] = Number(con[con.length - 1]["id"]) + 1;
    }
    con.push(temp);
    fs.writeFileSync("./nodeModule/customerInfo.json", JSON.stringify(con));

    var res = {
        code: 0,
        message: "创建成功~"
    };
    return JSON.stringify(res);
}

//->修改客户信息
function updateInfo(temp) {
    var con = fs.readFileSync("./nodeModule/customerInfo.json", "utf8");
    con = (con != "") ? JSON.parse(con) : [];
    var flag = false;
    for (var i = 0, len = con.length; i < len; i++) {
        var cur = con[i];
        if (cur["id"] == temp["id"]) {
            //->当前这一项就是我要修改的:循环cur中的每一项,用temp中对应的值给其进行替换
            for (var key in cur) {
                if (cur.hasOwnProperty(key)) {
                    cur[key] = temp[key];
                }
            }
            flag = true;
            break;
        }
    }
    var res = null;
    if (flag) {
        fs.writeFileSync("./nodeModule/customerInfo.json", JSON.stringify(con));
        res = {
            code: 0,
            message: "修改成功~"
        };
    } else {
        res = {
            code: 1,
            message: "修改失败,当前的客户不存在~"
        };
    }
    return JSON.stringify(res);
}

//->删除客户信息
function deleteInfo(cusId) {
    var con = fs.readFileSync("./nodeModule/customerInfo.json", "utf8");
    con = (con != "") ? JSON.parse(con) : [];
    var flag = false;
    for (var i = 0, len = con.length; i < len; i++) {
        if (con[i]["id"] == cusId) {
            con.splice(i, 1);
            flag = true;
            break;
        }
    }
    //->删除成功后,我们还需要把con中的最新数据重新的写入到文件中
    if (flag) {
        fs.writeFileSync("./nodeModule/customerInfo.json", JSON.stringify(con));
    }

    //->创建需要返回的内容
    var res = {
        code: 0,
        message: "删除成功~"
    };
    if (!flag) {
        res = {
            code: 1,
            message: "删除失败,当前客户不存在~"
        };
    }
    return JSON.stringify(res);
}

//->通过客户的编号获取对应的客户信息
function getData(cusId) {
    var con = fs.readFileSync("./nodeModule/customerInfo.json", "utf8");
    con = (con != "") ? JSON.parse(con) : [];//->如果获取的内容为空,说明JSON文件中没有任何的客户信息,为了方便解析和循环,对应这种情况我们con等于一个空数组即可
    var res = null;
    for (var i = 0, len = con.length; i < len; i++) {
        //->通过传递进来的客户ID,把对应的数据获取到
        var cur = con[i];
        if (cur["id"] == cusId) {
            res = cur;
            break;
        }
    }
    if (!res) {//->没有获取到指定的客户信息
        res = {
            code: 1,
            message: "当前客户不存在~",
            data: null
        };
    } else {
        res = {
            code: 0,
            message: "获取成功~",
            data: res
        };
    }
    return JSON.stringify(res);
}

//->获取所有的客户信息
function getAllData() {
    var con = fs.readFileSync("./nodeModule/customerInfo.json", "utf8");
    return con;
}

module.exports = {
    addInfo: addInfo,
    updateInfo: updateInfo,
    deleteInfo: deleteInfo,
    getData: getData,
    getAllData: getAllData
};