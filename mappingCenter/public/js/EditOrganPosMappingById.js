/**
 * Created by yuzaizai on 2016/11/17.
 */

$(document).ready(function() {
    $("#EditOrganPosTable1").DataTable({
        "aoColumnDefs":
            [
                { "bSortable": false, "aTargets": [ 1 ] }
            ] ,
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
} );

function selectAll(){
    $("#submitToken").attr("value","0");
    if ($("#checkAll form-control").context.activeElement.checked ) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}

//子复选框的事件
function setSelectAll(){
    //当没有选中某个子复选框时，SelectAll取消选中
    if (!$("#subcheck").checked) {
        $("#checkAll").prop("checked", false);
    }
    var chsub = $("input[type='checkbox'][id='subcheck']").length; //获取subcheck的个数
    var checkedsub = $("input[type='checkbox'][id='subcheck']:checked").length; //获取选中的subcheck的个数
    if (checkedsub == chsub) {
        $("#checkAll").prop("checked", true);
    }
}


function submitForm() {
    var mapId = document.getElementById("mapId").value;
    var organPosName = document.getElementById("organPosName").value;
    var organPosId = document.getElementById("organPosId").value;
    var mappedBusiRoles = new Array();
    var checknum = $("input[type='checkbox'][id='subcheck']:checked").length;
    if ( checknum >0 ){
        var i=0;
        while( i < checknum ) {
            var busiRole = new Object();
            busiRole['name'] = $("input[type='checkbox'][id='subcheck']:checked")[i].value;
            busiRole['_id'] = $("input[type='checkbox'][id='subcheck']:checked")[i].dataset.id;
            mappedBusiRoles.push(busiRole);
            i++;
        }
        try {
            var mappedBusiRolesString = JSON.stringify(mappedBusiRoles);  // 将映射对象转换成json字符串的格式
        }catch(  e ) {
            alert(e);
        }
        $("#EditOrganPosForm").attr("action",'/rolemap/updateOrganPosMapping/'+ mapId+'&'+organPosId+'&'+organPosName+'&'+mappedBusiRolesString);
        $("#EditOrganPosForm").submit();

    }else{
        alert("请先选择！");
    }

}

function back() {
    var mapId = document.getElementById("mapId").value;
    location.href='/rolemap/editRoleMapping/' + mapId;
}
