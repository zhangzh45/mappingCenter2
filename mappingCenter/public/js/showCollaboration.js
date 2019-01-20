/**
 * Created by yuzaizai on 2016/12/19.
 */

// 刷新协作用户信息，前提条件已注册协作用户信息
function updateCollabUserList() {
    document.getElementById("getCollabUserForm").action="/user/updateCollabUserList";
    $('#registerCollabUserForm').submit();
}
// 注册协作用户
function registerCollabUser() {
    var collaUserUri = document.getElementById("collabUserUri").value;
    if (collaUserUri=="") {
        alert("请填写获取协作用户URI！");
    } else {
        document.getElementById("getCollabUserForm").action="/admin/getCollabUser";
        $('#getCollabUserForm').submit();
    }
}


$(document).ready(function() {
    $('#showCollabUserTable').DataTable({
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)"
        }
    });
    $('#registerCollabUserTable').DataTable({
        "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ]}
        ],
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)"
        }
    });

});

function selectAll(){
    if ( $("#checkAll form-control").context.activeElement.checked ) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}

function submitForm() {
    var empList = new Array();
    var checknum = $("input[type='checkbox'][name='subCheck']:checked").length;
    if (checknum > 0) {
        for (var i = 0; i < checknum; i++) {
            var empString = $("input[type='checkbox'][name='subCheck']:checked")[i].value;
            var emp = JSON.parse(empString);
            empList.push(emp);
        }
        try {
            var empListString = JSON.stringify(empList);  // 将映射对象转换成json字符串的格式
        } catch (e) {
            alert(e);
        }
        $("#registerCollabUserForm").attr("action", '/admin/registerCollabUser/' + empListString);
        $("#registerCollabUserForm").submit();

    } else {
        alert("请先选择！");
    }
}
