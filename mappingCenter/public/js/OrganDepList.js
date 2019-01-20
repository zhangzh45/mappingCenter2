/**
 * Created by yuzaizai on 2016/12/27.
 */


$(document).ready(function() {
    var rolesConnect = io.connect('http://localhost', {'reconnect': false, 'auto connect': false});   // 关闭自动连接，以及重新连接
    var userId = document.getElementById("userId").value;
    var userType = document.getElementById("userType").value;
    if ( userId != "undefined" && userType!="undefined" && userType == "admin" ) {
        rolesConnect.on('roles'+userId, function (data,fn) {
            if (data != null && data.updateRole != null && data.updateRole.length > 0) {
                document.getElementById("updateData").setAttribute('value',JSON.stringify(data.updateRole));
            }
            fn(200); // 回调给服务器的函数：200客户端成功接收信息
        });
    }
    $("#organDepListTable").DataTable({
        "oLanguage": {
            "sProcessing": "正在加载中......",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "对不起，查询不到相关数据！",
            "sEmptyTable": "表中无数据存在！",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            }
        },
        "fnDrawCallback": function (oSettings) {
            var updateString = document.getElementById("updateData").value;
            if ( updateString != "" && updateString != null ) {
                var updateObj = JSON.parse(updateString);
                for ( var i= 0 ;i < updateObj.length;i++ ) {
                    var tr = document.getElementById(updateObj[i]._id);
                    if (tr != null) {
                        tr.style.backgroundColor = 'rgba(92, 184, 92, 1)';
                    }
                }
            }
        }
    });
} );