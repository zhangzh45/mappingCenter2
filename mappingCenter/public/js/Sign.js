/**
 * Created by yuzaizai on 2016/11/23.
 */

function sign() {

    var password = document.getElementById('userPassword').value;
    var name = document.getElementById("userName").value;
    if( name != "" && password != "" ) {
        $('#signForm').submit();
    } else {
        alert("用户名、密码不能为空！");
    }
}