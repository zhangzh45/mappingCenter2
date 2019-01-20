/**
 * Created by yuzaizai on 2016/12/1.
 */

var oTable;
$(document).ready(function() {
    oTable=$("#EditOrganRoleTable1").DataTable({
        "aoColumnDefs":
            [
                { "bSortable": false, "aTargets": [ 0 ]}
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

    $('#EditOrganRoleTable1 tbody').on( 'click', 'td.details-control',function () {
        var tr = $(this).closest('tr');
        var row = oTable.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            // 业务角色id
            var id = this.dataset.id;
            var name = this.dataset.value;
            var list = document.getElementById(id).value;
            var organRoleList = JSON.parse(list);
            row.child(format(organRoleList,name,id)).show();
            tr.addClass('shown');
        }
    } );
} );


function format (d,name,id) {
    // `d` is the original data object for the row
    var sOut = '<table class ="table table-hover table-bordered"  id ="SubEditOrganRoleTable1" style="padding-left:50px;">';
	var subid = "sub" + id;
    if ( d!=null && d.length > 0 ) {
        for (var i=0;i< d.length;i++ ) {
            if ( d[i].isMapped  ) {
                sOut += '<tr><td>'+ d[i].posName+'</td><td>'+ d[i].depName+'</td><td><input  name="subCheck" type="checkbox" checked id="'+ subid +'" value="'+ id +'"  data-name="'+ name +'" data-id="'+ d[i]._id+'" data-value="'+ d[i].posName+'" onclick="subCheckClick(\''+ subid+'\',\''+ id+'\',\''+ d[i]._id+'\')" /></td></tr>';
            } else  {
                sOut += '<tr><td>'+  d[i].posName+'</td><td>'+ d[i].depName+'</td><td><input name="subCheck" type="checkbox"  id="'+subid +'"  value="'+ id +'" data-name="'+ name +'" data-id="'+ d[i]._id+'" data-value="'+ d[i].posName+'"  onclick="subCheckClick(\''+ subid+'\',\''+ id+'\',\''+ d[i]._id+'\')" /></td></tr>';
            }
        }
    }
    sOut += '</table>';
    return(sOut||"暂无");
}
function selectAll(){
   // $("#submitToken").attr("value","0");
    if ($("#checkAll form-control").context.activeElement.checked ) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}



//子复选框的事件
function setSelectSubAll( name,id ){
	name = 'sub' + id;
    //$(":checkbox [id='Fool']").prop("checked",true);
    var busiId = "busiRole" +id; // 获取选中的行的id
    var posListString = document.getElementById(id).value;
    var posListObj = JSON.parse(posListString);
    if (posListObj != null && posListObj.length>0) {
        if(  $('#'+busiId).context.activeElement.checked ) {
            for (var i=0;i<posListObj.length;i++) {
                if ( !posListObj[i].isMapped ) {
                    posListObj[i].isMapped = true;
                }
            }
            $("input[type='checkbox'][id='"+name+"']").prop("checked",true);
            document.getElementById(id).setAttribute('value',JSON.stringify(posListObj));
        } else {
            for (var j=0;j<posListObj.length;j++) {
                if ( posListObj[j].isMapped ) {
                    posListObj[j].isMapped = false;
                }
            }
            $("input[type='checkbox'][id='"+name+"']").prop("checked",false);
            document.getElementById(id).setAttribute('value',JSON.stringify(posListObj));
        }
    }

}


function subCheckClick(subid,id,posId) { // posId 为职位的_id
    var busiId = "busiRole" +id; // 获取选中的行的id
    if (!$("#"+subid).checked) {
        $("#"+busiId).prop("checked", false);
    }
    var chsub = $("input[type='checkbox'][id='"+subid+"']").length; //获取subcheck的个数
    var checkedsub = $("input[type='checkbox'][id='"+subid+"']:checked").length; //获取选中的subcheck的个数
    if (checkedsub == chsub) {
        $("#"+busiId).prop("checked", true);
    }

    //更新数据
    var isChecked =  $("#"+subid).context.activeElement.checked;
    var posListString = document.getElementById(id).value;
    var posListObj = JSON.parse(posListString);
    for(var i=0;i< posListObj.length;i++) {
        if(posListObj[i]._id == posId && isChecked!= posListObj[i].isMapped) {  // 当所选中的职位映射关系与obj中的数据不符则修改数据
            posListObj[i].isMapped = isChecked;
        }
    }
    document.getElementById(id).setAttribute('value',JSON.stringify(posListObj)); // 刷新值

}

function submitForm() {
    var mapId = document.getElementById("mapId").value;
    var role2PosOldStringa = document.getElementById("role2Pos").value;
	var role2PosOldStringb = escape(encodeURI(role2PosOldStringa));
	var role2PosOldString = decodeURI(role2PosOldStringb);
    var role2PosNew = new Array();
    $('#EditOrganRoleTable1 tbody td.details-control').click();
    var checknum = $("input[type='checkbox'][name='subCheck']:checked").length;
    if (checknum > 0) {
        for (var i = 0; i < checknum; i++) {
            var mappingObj = new Object();
            mappingObj["mapId"] = mapId;
            mappingObj["organPosName"] = $("input[type='checkbox'][name='subCheck']:checked")[i].dataset.value;
            mappingObj["busiRoleName"] = $("input[type='checkbox'][name='subCheck']:checked")[i].dataset.name;
            mappingObj["organPosId"] = $("input[type='checkbox'][name='subCheck']:checked")[i].dataset.id;
            mappingObj["busiRoleId"] = $("input[type='checkbox'][name='subCheck']:checked")[i].value;
            role2PosNew.push(mappingObj);
        }
        try {
            var role2PosNewString = JSON.stringify(role2PosNew);  // 将映射对象转换成json字符串的格式
        } catch (e) {
            alert(e);
        }
        $("#EditOrganRoleForm").attr("action", '/rolemap/updateOrganRoleMapping/' + mapId + '&'+role2PosOldString+ '&' + role2PosNewString);
        $("#EditOrganRoleForm").submit();


    } else {
        alert("请先选择！");
    }
}




function back() {
    var mapId = document.getElementById("mapId").value;
    location.href='/rolemap/editRoleMapping/' + mapId;
}