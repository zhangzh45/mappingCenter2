/**
 * Created by yuzaizai on 2016/4/24.
 */
var User = require('../models/User');
var request = require('request');
var CryptoJS = require('crypto-js');
var OrganPos = require('../models/OrganPos');
var Cache = require('memory-cache');
//show Signup
exports.showSignup = function(req,res) {
    res.render('Signup',{
        title: '注册页面'
    })
};

//show Signin
exports.showSignin = function(req,res) {
    res.render('Signin',{
        title: '登录页面'
    })
};

//signin
exports.signin= function(req,res){
    var _user=req.body.user;
    var name=_user.name;
    var password= _user.password;
    User.findOne({name:name},function(err,user){
        if (err){
            console.log(err);
        }
        if(user == null || user == undefined) {
            res.redirect("/signup");
        } else {
            user.comparePassword(password,function(err,isMatch){
                if(err){
                    console.log(err);
                }
                console.log(password,user.password);
                if(isMatch){
                    req.session.user = user;
                    res.redirect('/user/userpage');
                } else {
                    res.redirect('/signin');
                }
            });
        }
    })
};


//signup 注册
exports.signup = function(req,res){
    var _user = req.body.user;
    User.findOne({name:_user.name},function(err,user){
        if (err){
            console.log(err);
        }
        if (user){
            return res.redirect('/signin');
        } else {
            _user.type = "admin";
            user = new User(_user);
            user.save(function(err,user){
                if (err) {
                    console.log(err);
                }
                else {
                    req.session.user = user;
                    res.redirect('/organ/showsignup');
                }

            });
        }
    });
    console.log(_user);
};

// midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin')
    }
    req.session.user = user;
    next();
};
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.type != "admin") {
        return res.redirect('/signin')
    }
    next()
};
//logout
exports.logout = function(req,res){
    delete req.session.user;
  //  app.locals.user=null;
    res.redirect('/');
};

//userlist page
exports.list = function(req,res){
    User.fetch(function(err,users){
        if (err) {
            console.log(err);
        }
        res.render('UserList',{
            title:'用户管理页',
            users: users
        })
    })
};

// userPage
exports.userPage = function(req,res) {
   res.render('UserPage',{
       title: '用户详情页'
   })
};

exports.getCollabUser = function(req,res) {
    var _collabUserUri=req.body.user.collabUserUri;
    var _user = req.session.user;
    _user.collabUserUri  = _collabUserUri;
    if ( _user) {
        // 更新字段collabUserUri
        User.update({_id:_user._id},{collabUserUri:_collabUserUri},function(error,user){
            if (error) {
                res.render('Error',{
                    message:"用户信息更新出错！"+error
                })
            }
            if (user) {
                request.get({url:_collabUserUri},function (err, EmpList) {
                    if (err || !EmpList.hasOwnProperty("body")) {
                        res.render('Error',{
                            message:_collabUserUri+"用户信息读取出错！"+err
                        })
                    }
                    var _empsListString = EmpList.body; // json格式的Employees对象数组 {"employees"，[{"empId":"123","name":"test1","password":"123456"}]}
                    var empObjects = JSON.parse(_empsListString); // 将json字符串转成对象
                    var _empListArray = new Array();
                    if ( empObjects.employees ) {
                        var _index =0;
                        var _empLen = empObjects.employees.length;
                        empObjects.employees.forEach (function( emp ) {
                                var _userNew = new Object();
                                _userNew.name = emp.name;
                                _userNew.empId = emp.id;
                                _userNew.password = emp.password;
                                _userNew.belongTo = _user._id.toString();
                                _userNew.posName = emp.posName;
                                _userNew.depName = emp.depName;
                                _empListArray.push(_userNew);
                                if ( _index == _empLen-1 ) {
                                    res.render('showCollaboration',{
                                        empList: _empListArray
                                    })
                                }
                                _index++;
                        });

                    }
                })
            }
        });
    }
};

// admin 添加协作用户
exports.registerCollabUser = function (req,res) {
    var _empList = JSON.parse(req.params.empList);
    if ( _empList !=null && _empList.length > 0 ) {
        var index = 0;
        _empList.forEach(function(item){
            var pwd =   decrypt(item.password);
          /*  User.findOne({name:item.name,empId:item.empId},function(findError,userF){
                err(res,findError,"用户信息查找失败！");
                if( userF !=null && userF != undefined) { // 若用户已经存在

                }
            });*/
            /*var _user = new User({
                name: item.name,
                empId: item.empId,
                belongTo: item.belongTo,
                password: pwd,
                type: "user"
            });*/
            var _userEncryp = new User();
            var _user=new Object();
            _user["name"] = item.name;
            _user["empId"] = item.empId;
            _user["belongTo"] = item.belongTo;
            _user["type"] = "user";
            _userEncryp.bcryptPassword(pwd,function(EncryptErr,encryptPwd){
                err(res,EncryptErr,"密码加密错误！");
                _user["password"] = encryptPwd;
                // 更新或插入，若存在name和empId相同的用户，则更新用户信息，不存在则插入新数据
                User.update({name:_user.name,empId:_user.empId},_user,{safe:true,upsert:true},function(error,user){
                    err(res,error,"用户信息存储失败！");
                    if( user ) {
                        // 根据用户ID从服务管理中心添加该用户注册过的应用
                        if ( index == _empList.length-1 ) {
                            res.redirect(307, '/admin/showCollaboration')
                        }
                        index++;
                    }
                })
            });
        });
    }
};

// 添加协作人员
exports.showCollaboration = function (req,res) {
    var _user = req.session.user;
    User.find({belongTo:_user._id.toString()}, function(error,users){  // 查询已有的协作人
        err(res,error,"用户查询出错！"+error);
        if ( users ) {
            res.render('showCollaboration', {
                title: "添加协作人",
                addedCollabUser: users
            })
        }
    });

};

function decrypt ( enStr ) {
    var keyHex = CryptoJS.enc.Utf8.parse("127.0.0.1");  // 密钥127.0.0.1
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({  // 解密
        ciphertext: CryptoJS.enc.Base64.parse(enStr)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return  decrypted.toString(CryptoJS.enc.Utf8);
}

function err ( res,error,message ) {
    if ( error != null ) {
        res.render('Error',{
            message: message+error
        })
    }
}