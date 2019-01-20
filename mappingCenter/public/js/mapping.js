/**
 * Created by yuzaizai on 2016/11/9.
 */

$(function(){
    $('.del').click(function(del) {
        var target = $(del.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        $.ajax({
            type: 'DELETE',
            url: '/admin/movie/list?id=' + id
        })
            .done(function(results) {
                if (results.success === 1) {
                    if (tr.length >0 ) {
                        tr.remove()
                    }
                }
            })
    });
    $('.success').click(function(suc) {
        var target = $(suc.target);
        var id = target.data('id');
        var value = target.data('value');
        location.href='/rolemap/showRoleMapping/' + id+'&'+value.organName+'&'+value.appName;
    });
    $('.warning').click(function(war) {
        var target = $(war.target);
        var id = target.data('id');
        location.href='/rolemap/editRoleMapping/' + id;
    });

});

$(document).ready(function() {
    $('#mappingTable1').DataTable({
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)"
        }
    });
} );

// 显示注册映射页面
function registerForm() {
    document.getElementById("registerForm").action = '/map/showRegisterMapping';
    $('#registerForm').submit();
}

//admin 显示协作页面
function collaborationForm() {
    document.getElementById("registerForm").action = '/admin/showCollaboration';
    $('#registerForm').submit();
}

// user 显示协作页面
function userCollabForm() {
    document.getElementById("registerForm").action = '/user/showCollaboration';
    $('#registerForm').submit();
}
