$(function () {
    var a = $(".notification_badge");
    if (a.length) {
        Header.notificationsTips();
        Header.messageTips();
        showGiftIcon()
    }
});
var Header = {};
var headerNotifyCount = 0;
var headerMessageCount = 0;
Header.notificationsTips = function () {
    $.get("/notification/count", {}, function (a) {
        headerNotifyCount = a.count;
        manageHeaderTips()
    })
};
Header.messageTips = function () {
    $.get("/message/count", {}, function (a) {
        headerMessageCount = a.count;
        manageHeaderTips()
    })
};
function manageHeaderTips() {
    if (headerNotifyCount > 0) {
        $(".global-tip:first").text(headerNotifyCount).show().css({display: "inline-block"})
    } else {
        $(".global-tip:first").text(headerNotifyCount).hide()
    }
    if (headerMessageCount > 0) {
        $(".global-tip:last").text(headerMessageCount).show().css({display: "inline-block"})
    } else {
        $(".global-tip:last").text(headerMessageCount).hide()
    }
    if (headerNotifyCount > 0 || headerMessageCount > 0) {
        $(".notification_badge").show()
    } else {
        $(".notification_badge").hide()
    }
}
Header.doSearch = function () {
    var a = $.trim($("#global_input").val());
    if (a == "") {
        $("#global_input").val("").focus();
        return false
    }
    return true
};
var showGiftIcon = function () {
    var a = $(".header_label");
    var c = $("<a href='https://www.processon.com/network/invitelist' target='_blank' style='position:absolute;left:-43px;top:-2px;' class='reward-icon gift_white'></a>");
    a.prepend(c);
    var b = 1;
    var d = 0;
    setInterval(function () {
        if (d <= 15) {
            c.css({"-ms-transform": "rotate(0deg)", "-webkit-transform": "rotate(0deg)", transform: "rotate(0deg)"})
        } else {
            if (d <= 35) {
                if (b == 1) {
                    c.css({
                        "-ms-transform": "rotate(3deg)",
                        "-webkit-transform": "rotate(3deg)",
                        transform: "rotate(3deg)"
                    });
                    b = 0
                } else {
                    c.css({
                        "-ms-transform": "rotate(-3deg)",
                        "-webkit-transform": "rotate(-3deg)",
                        transform: "rotate(-3deg)"
                    });
                    b = 1
                }
                if (d == 35) {
                    d = 0
                }
            }
        }
        d++
    }, 120)
};
Header.checkReward = function () {
    Util.ajax({
        url: "/reward/checkdate", success: function (e) {
            if (e.show_reward) {
                var a = $(".header_label");
                if (a.length > 0) {
                    var c = $("<span style='position:absolute;left:-43px;top:-2px;' class='reward-icon gift_white'></span>");
                    a.prepend(c);
                    var b = 1;
                    var d = 0;
                    setInterval(function () {
                        if (d <= 15) {
                            c.css({
                                "-ms-transform": "rotate(0deg)",
                                "-webkit-transform": "rotate(0deg)",
                                transform: "rotate(0deg)"
                            })
                        } else {
                            if (d <= 35) {
                                if (b == 1) {
                                    c.css({
                                        "-ms-transform": "rotate(3deg)",
                                        "-webkit-transform": "rotate(3deg)",
                                        transform: "rotate(3deg)"
                                    });
                                    b = 0
                                } else {
                                    c.css({
                                        "-ms-transform": "rotate(-3deg)",
                                        "-webkit-transform": "rotate(-3deg)",
                                        transform: "rotate(-3deg)"
                                    });
                                    b = 1
                                }
                                if (d == 35) {
                                    d = 0
                                }
                            }
                        }
                        d++
                    }, 120);
                    c.on("click", function () {
                        if ($("#reward_dlg").length > 0) {
                            $("#reward_dlg").remove()
                        }
                        var j = $("<div id='reward_dlg' class='reward-dlg'></div>");
                        j.appendTo("body").slideDown();
                        var i = $("<a class='reward-dlg-close'>关闭</a>");
                        j.append(i);
                        var g = $("<div class='reward-dlg-con'></div>").appendTo(j);
                        var h = $("<div class='reward-dlg-con-left'></div>").appendTo(g);
                        var f = $("<div class='reward-dlg-con-right'></div>").appendTo(g);
                        i.on("click", function () {
                            j.remove()
                        });
                        Util.ajax({
                            url: "/reward/getcount", success: function (p) {
                                var m = $("<a target='_blank' href='/event/555ad91ee4b0cc4aa3d56dce' class='reward-bottom-left'>活动详情</a>");
                                h.append(m);
                                if (p.jcount > 0) {
                                }
                                if (p.count > 0) {
                                    var n = $("<span class='reward-heart-filecount'></span>");
                                    h.append(n);
                                    var l = $("<div style='margin-top:27px;font-size:15px;' class='reward-dlg-tip1'>谢谢你回家，这是我们的一个小礼物，<br>点击打开它，里面可能有520张私有文件哦！</div>");
                                    var k = $("<span style='cursor:pointer;font-size:156px;color:#ff0000;position:absolute;left:50%;top:50%;margin-left:-80px;margin-top:-80px' class='if if-heart'></span>");
                                    h.append(l);
                                    h.append(k);
                                    var q = 1;
                                    var o = window.setInterval(function () {
                                        if (q == 1) {
                                            k.css({fontSize: 180, marginTop: -90, marginLeft: -90});
                                            q++
                                        } else {
                                            k.css({fontSize: 156, marginTop: -80, marginLeft: -80});
                                            q = 1
                                        }
                                    }, 350);
                                    k.on("click", function () {
                                        window.clearInterval(o);
                                        k.animate({fontSize: 106, marginTop: -50, marginLeft: -80, left: "30%"}, 300);
                                        Util.ajax({
                                            url: "/reward/calccount", success: function (r) {
                                                n.text(r.filecount);
                                                if (r.count <= 0) {
                                                    k.off("click")
                                                }
                                                n.animate({opacity: 1, filter: "alpha(opacity=100)"}, 500);
                                                l.html("你已获取我们赠送的私有文件,请去我的文件查看<br>如果想继续获得奖励，那就快去邀请好友吧，每邀请一个好友即可再次领取哦！")
                                            }
                                        })
                                    })
                                } else {
                                    var l = $("<div class='reward-dlg-tip3'>你已经领取过奖励了，如果想继续获得奖励，<br>那就快去邀请好友吧，每邀请一个好友即可再次领取哦！<br><a target='_blank' href='/network/invite'>去邀请</a></div>");
                                    h.append(l);
                                    var k = $("<span style='font-size:96px;color:#ff0000;position:absolute;left:30%;top:55%;margin-left:-80px;margin-top:-80px' class='if if-heart'></span>");
                                    h.append(k)
                                }
                            }
                        })
                    })
                }
            }
        }
    })
};