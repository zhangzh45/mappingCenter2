/**
 * Created by yuzaizai on 2016/11/23.
 */
function organsignup() {
    var organName = document.getElementById("organName").value;
    var organUri = document.getElementById("organPosUri").value;

    if( organName !="" && organUri!="") {
        $('#organSignupForm').prop('action','/organ/organSignup') ;
        $('#organSignupForm').submit();
    } else {
       location.href="/user/userpage";
    }
}

function registerOrgan() {
    var organName = document.getElementById("organName").value;
    var organUri = document.getElementById("organPosUri").value;
    if( organName !="" && organUri!="") {
        $('#RegisterOrganForm').prop('action','/organ/organSignup').submit();
      //  $('#RegisterOrganForm').submit();
    } else {
        alert("必填项不能为空！");
    }
}

function backOrganList() {
    location.href="/organ/organList";
}

function editOrgan() {
    var organUri = document.getElementById("organPosUri").value;
    var organName = document.getElementById("organName").value;
    if( organUri=="" ) {
        alert("职位链接不能为空！");
    } else {
        $('#EditOrganForm').prop('action','/organ/updateOrganInfo/'+organName).submit();
    }

}