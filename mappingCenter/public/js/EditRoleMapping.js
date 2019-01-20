$(function(){
$('#editBusiRoleTable').DataTable({
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
        bindBtnEvent();
    }
});

$('#editOrganPosTable').DataTable({
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
        var updateString = document.getElementById("updateOrganPosData").value;
        if ( updateString != "" && updateString != null ) {
            var updateObj = JSON.parse(updateString);
            for ( var i= 0 ;i < updateObj.length;i++ ) {
                var tr = document.getElementById(updateObj[i].posId);
                if (tr != null) {
                    tr.style.backgroundColor = 'rgba(92, 184, 92, 1)';
                }
            }
        }
        bindBtnEvent();
    }
});

$('#editOrganDepTable').DataTable({
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
        bindBtnEvent();
    }
});


$('#editOrganRoleTable').DataTable({
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
        bindBtnEvent();
    }
});
$('#editOrganDepTable_wrapper').toggle(false);
$('#editOrganRoleTable_wrapper').toggle(false);

$('#mapscope').change(function(){
    var scopeVal=$(this).children('option:selected').val();//这就是selected的值
    updateTable(scopeVal);
});

function updateTable( scopeVal ) {

    var organName = document.getElementById("organName").value;
    var uri = '';
    if ( scopeVal == 'position') {
        $('#editOrganPosTable_wrapper').toggle(true);
        $('#editOrganDepTable_wrapper').toggle(false);
        $('#editOrganRoleTable_wrapper').toggle(false);
        uri = '/organpos/getAllPos/'+organName;

    }
    if ( scopeVal == 'department') {
        $('#editOrganDepTable_wrapper').toggle(true);
        $('#editOrganPosTable_wrapper').toggle(false);
        $('#editOrganRoleTable_wrapper').toggle(false);
        uri = '/organdep/getAllDep/'+organName;
        $.ajax({
            type: 'get',
            url: uri,
            dataType: 'json',
            success: function( departs ) {
                $('#editOrganDepTable').DataTable({
                    data: departs,
                    "columns": [
                        { data: "_id" },
                        { data: "depName" }
                    ],
                    "aoColumns": [ {"mDataProp":"_id","bVisible": false,"aTargets":[0]},
                        {"mDataProp":"depName", "sTitle": "部门名称","aTargets":[1]}
                    ],
                    "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                        nRow.id = aData.depId;
                        /* Append the grade to the default row class name */
                       $('td:eq(0)', nRow).html( "<button name ='organDep' onclick='organDepSubmit(\""+ aData._id+"\",\""+ aData.depName+"\",\""+ aData.serviceId+"\")' class='button-glow button-border button-rounded button-primary' data-id='"+aData._id+"' type='button' value="+aData.depName+" id='"+aData._id+"'>"+aData.depName+"</button>");
                        return nRow;
                    },
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
                        var updateString = document.getElementById("updateOrganDepData").value;
                        if ( updateString != "" && updateString != null ) {
                            var updateObj = JSON.parse(updateString);
                            for ( var i= 0 ;i < updateObj.length;i++ ) {
                                var tr = document.getElementById(updateObj[i].depId);
                                if (tr != null) {
                                    tr.style.backgroundColor = 'rgba(92, 184, 92, 1)';
                                }
                            }
                        }
                        bindBtnEvent();
                    },
                    "destroy": true
                })
            },
            error: function( err) {
               // alert(err);
            }
        })
    }
    if ( scopeVal == 'role') {
        $('#editOrganPosTable_wrapper').toggle(false);
        $('#editOrganDepTable_wrapper').toggle(false);
        $('#editOrganRoleTable_wrapper').toggle(true);
        $('#editOrganRoleTable').toggle(true);
        uri = '/organrole/getAllRole/'+organName;
        $.ajax({
            type: 'get',
            url: uri,
            dataType: 'json',
            success: function( organRoles ) {
                $('#editOrganRoleTable').DataTable({
                    data: organRoles,
                    "columns": [
                        { data: "_id" },
                        { data: "name" }
                    ],
                    "aoColumns": [ {"mDataProp":"_id","bVisible": false,"aTargets":[0]},
                        {"mDataProp":"name", "sTitle": "组织角色名","aTargets":[1]}
                    ],
                    "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                        /* Append the grade to the default row class name */
                        nRow.id = aData.roleId;
                        $('td:eq(0)', nRow).html( "<button name ='organRole' onclick='organRoleSubmit(\""+ aData._id+"\",\""+ aData.name+"\")' class='button-glow button-border button-rounded button-primary' data-id='"+aData._id+"' type='button' value="+aData.name+" id='"+aData._id+"'>"+aData.name+"</button>");
                        return nRow;
                    },
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
                        var updateString = document.getElementById("updateOrganRoleData").value;
                        if ( updateString != "" && updateString != null ) {
                            var updateObj = JSON.parse(updateString);
                            for ( var i= 0 ;i < updateObj.length;i++ ) {
                                var tr = document.getElementById(updateObj[i].roleId);
                                if (tr != null) {
                                    tr.style.backgroundColor = 'rgba(92, 184, 92, 0.4)';
                                }
                            }
                        }
                        bindBtnEvent();
                    },
                    "destroy": true
                })
            },
            error: function( err) {
                // alert(err);
            }
        })
    }

}

function bindBtnEvent() {
    var $btnPrimary = $(".button-primary");
    $btnPrimary.unbind();
    $btnPrimary.on('click', function(e) {
        var target = $(e.target);
        var id = target.data('id');
        var name = target.context.name; // button名称
        //var tr = $('.item-id-' + id);

        var mapId = document.getElementById("mapId").value;
        var organName = document.getElementById("organName").value;
        var appName = document.getElementById("appName").value;
        if ( name=="busiRole") {
            var roleName = document.getElementById(id).value;
            document.getElementById('editBusiRoleForm').action='/rolemap/busiRoleMappingList/' + id+'&'+mapId+'&'+organName+'&'+roleName;
            $('#editBusiRoleForm').submit();
        }
        if ( name == "organPos" ) {
            var depName = document.getElementById( 'dep'+id).innerText;
            var organRoleName = document.getElementById('role'+id).innerText;
            var posName = document.getElementById(id).value;
            document.getElementById('editOrganPosForm').action='/rolemap/organPosMappingList/' +id+'&'+mapId+'&'+appName+'&'+posName+'&'+depName+'&'+organRoleName;
            $('#editOrganPosForm').submit();
        }
    })
}


//$(function(){
    // $('#editDepTable').toggle();
    var rolesConnect = io.connect('http://localhost', {'reconnect': false, 'auto connect': false});   // 关闭自动连接，以及重新连接
    var userId = document.getElementById("userId").value;
    var userType = document.getElementById("userType").value;
    if (userId != "undefined" && userType != "undefined" && userType == "admin") {
        rolesConnect.on('roles' + userId, function (data, fn) {   // 角色更新信息
            if (data != null && data.updateRole != null && data.updateRole.length > 0) {
                document.getElementById("updateOrganRoleData").setAttribute('value', JSON.stringify(data.updateRole));
            }
            fn(200); // 客户端成功接收信息
        });
        rolesConnect.on('departments' + userId, function (data, fn) {   // 部门更新信息
            if (data != null && data.updateDep != null && data.updateDep.length > 0) {
                document.getElementById("updateOrganDepData").setAttribute('value', JSON.stringify(data.updateDep));
            }
            fn(200); // 客户端成功接收信息
        });
        rolesConnect.on('positions'+ userId, function (data, fn) {   // 职位更新信息
            if (data != null && data.updatePos != null && data.updatePos.length > 0) {
                document.getElementById("updateOrganPosData").setAttribute('value', JSON.stringify(data.updatePos));
            }
            fn(200); // 客户端成功接收信息
        });
    }
    //$('.button-primary').click(function(e) {
    //    var target = $(e.target);
    //    var id = target.data('id');
    //    var name = target.context.name; // button名称
    //    //var tr = $('.item-id-' + id);
    //
    //    var mapId = document.getElementById("mapId").value;
    //    var organName = document.getElementById("organName").value;
    //    var appName = document.getElementById("appName").value;
    //    if ( name=="busiRole") {
    //        var roleName = document.getElementById(id).value;
    //        document.getElementById('editBusiRoleForm').action='/rolemap/busiRoleMappingList/' + id+'&'+mapId+'&'+organName+'&'+roleName;
    //        $('#editBusiRoleForm').submit();
    //    }
    //    if ( name == "organPos" ) {
    //        var depName = document.getElementById( 'dep'+id).innerText;
    //        var organRoleName = document.getElementById('role'+id).innerText;
    //        var posName = document.getElementById(id).value;
    //        document.getElementById('editOrganPosForm').action='/rolemap/organPosMappingList/' +id+'&'+mapId+'&'+appName+'&'+posName+'&'+depName+'&'+organRoleName;
    //        $('#editOrganPosForm').submit();
    //    }
    //
    //
    //
    //
    //});


});

function organRoleSubmit(id,organRoleName) {
    var mapId = document.getElementById("mapId").value;
    var appName = document.getElementById("appName").value;
    document.getElementById('editOrganRoleForm').action='/rolemap/organRoleMappingList/' +id+'&'+mapId+'&'+appName+'&'+organRoleName;
    $('#editOrganRoleForm').submit();
}

function organDepSubmit(id,organDepName) {
    var mapId = document.getElementById("mapId").value;
    var appName = document.getElementById("appName").value;
    document.getElementById('editOrganDepForm').action='/rolemap/organDepMappingList/' +id+'&'+mapId+'&'+appName+'&'+organDepName;
    $('#editOrganDepForm').submit();
}