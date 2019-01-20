/**
 * Created by yuzaizai on 2017/1/6.
 */



    $("#organRoleListTable").DataTable({
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
                if ( updateObj != null )
                for ( var i= 0 ;i < updateObj.length;i++ ) {
                    var tr = document.getElementById(updateObj[i]._id);
                    if (tr != null) {
                        tr.style.backgroundColor = 'rgba(92, 184, 92, 1)';
                    }
                }
            }
        }
    });



