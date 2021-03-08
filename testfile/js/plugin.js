(function (global) {
    global.MyTable = function (parameter) {
        //获取dom元素
        var table_dom = document.getElementById(parameter.elid);
        //设置div的样式
        // table_dom.style.width = "500px";
        table_dom.style.minHeight="300px";
        // table_dom.style.border="solid 1px black";
        table_dom.style.margin="0 auto";
        //创建表格
        var table = document.createElement("table");
        table.style.width = "100%";
        table.style.border="1px solid";
        //创建表头
        var thead = document.createElement("tr");
        thead.id = "thead";
        Object.keys(parameter.thead).forEach(function (key) {
            var th = document.createElement("th");
            th.style.border="1px solid";
            th.innerText = parameter.thead[key];
            thead.appendChild(th);
        });
        table.appendChild(thead);
        table_dom.appendChild(table);
        //创建表体
        parameter.columns.map(function (value,index) {
            var ttemp = document.createElement("tr");
            Object.keys(value).forEach(function (key) {
                var td = document.createElement("td");
                td.style.border="1px solid";
                td.innerText = value[key];
                ttemp.appendChild(td);
            });
            table.appendChild(ttemp);
        });

    }
})(window)//立即执行函数，避免污染全局变量