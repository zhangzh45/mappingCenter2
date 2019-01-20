/**
 * Created by yuzaizai on 2017/1/10.
 */
$(document).ready(function() {
    $('#ApplicationListTable').DataTable({
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
        }
    });
});

function registerApp( ) {
    location.href= '/app/showSignup';
}

function delete_app() {
    // 对话框返回true or false
    if (confirm("确认删除？")) {
        var id =$(this);
        alert(id);

    } else {
        location.href = '/app/appList';
    }
}