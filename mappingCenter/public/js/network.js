$(function () {
    resize.resize();
    $(window).resize(function () {
        resize.resize()
    })
});
var resize = {
    resize: function () {
        var e = $(".network");
        var d = $(".network-left"), h = 130, f = 100, c = 250;
        var g = $(".network-right"), j = g.find(".content-right"), b = g.find(".content-left");
        var a = $(window).width(), i = $(window).height();
        if ($("#right_page_width").length) {
            c = $("#right_page_width").val()
        }
        if (c == "550px") {
            b.css({"min-width": "inherit"})
        }
        if (a <= 1300) {
            h = 80
        } else {
            h = 130
        }
        d.css({width: h});
        j.css({width: c});
        if (a <= 960) {
            if (j.length) {
                j.hide();
                b.css({"margin-right": 0})
            }
        } else {
            if (j.length) {
                j.show();
               // b.css({"margin-right": c})
            }
        }
        g.css({width: e.width() - h, left: h});
        e.css({height: i - 52 - 17});
        if (i < 583) {
            f = 75;
            d.find(".network-menu-title").hide()
        } else {
            f = 100;
            d.find(".network-menu-title").show();
            if ($(".content-right-suggest").length > 0) {
                $(".content-right-suggest").slideDown()
            }
        }
        d.find(".network-menu").css({height: f});
        if (i <= 650) {
            if ($("#suggestusers").length && $("#suggestusers").html() == "") {
                if (typeof home != "undefined") {
                    home.loadUserCount = 3
                }
            }
            if ($("#teams-list").length && $("#teams-list").html() == "") {
                teams.getSuggestTeams(6, "#teams-list")
            }
        } else {
            if (i <= 889) {
                if ($("#suggestusers").length && $("#suggestusers").html() == "") {
                    if (typeof home != "undefined") {
                        home.loadUserCount = 5
                    }
                }
                if ($("#teams-list").length && $("#teams-list").html() == "") {
                    teams.getSuggestTeams(9, "#teams-list")
                }
                $(".content-right-visited").show()
            } else {
                if ($("#suggestusers").length && $("#suggestusers").html() == "") {
                    if (typeof home != "undefined") {
                        home.loadUserCount = 8
                    }
                }
                if ($("#teams-list").length && $("#teams-list").html() == "") {
                    teams.getSuggestTeams(9, "#teams-list")
                }
                $(".content-right-visited").show()
            }
        }
        resize.initInnerHeight();
        if (typeof home != "undefined" && typeof home != "function") {
            social.scrolltop()
        }
    }, initInnerHeight: function () {
        var a = $(".network-right").height();
        var b = $(".network-nav");
        if (b.length) {
            a -= b.outerHeight()
        }
        if ($(".content_container").length) {
            var c = $(".content_container");
            c.siblings("div:visible").each(function () {
                a -= $(this).outerHeight()
            });
            $(".content_container").height(a - 20)
        }
    }
};
var social = {
    doFollow: function (b, c, a) {
        $(b).disable();
        social.saveFollow(c, function () {
            $(b).enable();
            if (a != null) {
                if (a == "suggest") {
                    $(b).parent().parent().fadeOut(function () {
                        $(this).remove()
                    })
                } else {
                    friends.loadTab(a);
                    Util.globalTopTip("您已成功关注了新的用户", "top_success", 1000)
                }
            }
        })
    }, doUnFollow: function (b, c, a) {
        $.confirm({
            content: "确定取消关注当前用户吗？", onConfirm: function () {
                $(b).disable();
                social.saveUnFollow(c, function () {
                    $(b).enable();
                    if (a != null) {
                        friends.loadTab(a)
                    }
                })
            }
        })
    }, saveFollow: function (a, b) {
        Util.ajax({
            url: "/start/savefollow", data: {followIds: a}, success: function (c) {
                b()
            }
        })
    }, saveUnFollow: function (a, b) {
        Util.ajax({
            url: "/start/unfollow", data: {followId: a}, success: function (c) {
                b()
            }
        })
    }, followTag: function (a, b) {
        Util.ajax({
            url: "/tags/follow", data: {tagName: a}, success: function (c) {
                if (c.result == "success") {
                    if (b != null) {
                        b()
                    }
                }
            }
        })
    }, unFollowTag: function (a, b) {
        Util.ajax({
            url: "/tags/unfollow", data: {tagName: a}, success: function (c) {
                if (c.result == "success") {
                    if (b != null) {
                        b()
                    }
                }
            }
        })
    }, showTagsByTagName: function (a, b, c) {
        Util.ajax({
            url: "/tags/search", data: {tagName: a}, success: function (g) {
                var d = $("#tags_ul");
                if (d.length < 1) {
                    d = $("<ul id='tags_ul' class='popmenu radius3 popover shadow_2'></ul>").appendTo("body")
                }
                var f = [];
                if (g.tags.length > 0) {
                    for (var e = 0; e < g.tags.length; e++) {
                        f.push("<li>" + g.tags[e].tagName + "</li>")
                    }
                }
                f = f.join("");
                d.html(f);
                d.popMenu({fixed: true, target: b});
                d.children().on("mousedown.share", function (h) {
                    if (c != null) {
                        var i = $(this).text();
                        c(i)
                    } else {
                        b.val($(this).text())
                    }
                    d.popMenu("close");
                    h.stopPropagation()
                })
            }
        })
    }, scrolltop: function (b) {
        if (b == null) {
            b = ".content-left"
        }
        $(".scrolltotop").remove();
        var a = $("<div class='scrolltotop' onclick=\"social.goTop()\" original-title='回到顶部'></div>").appendTo("body");
        var c = $(".content-right").is(":visible");
        if (c) {
            a.css({right: "258px"})
        } else {
            a.css({right: "24px"})
        }
        $(document).off(b).on("scroll.gotop", b, function () {
            if ($(b).scrollTop() > 450) {
                a.fadeIn()
            } else {
                a.hide()
            }
        });
        $(b).trigger("scroll.gotop")
    }, goTop: function () {
        $(".content-left").scrollTop(0);
        $(".content_container").scrollTop(0)
    }
};
var invite = {
    init: function () {
        $("#tag_input").off("keyup.input").on("keyup.input", function (b) {
            var a = b.which;
            if (a == 13) {
                invite.addTag($("#tag_input").val());
                $("#tag_input").val("")
            }
            if (a == 188 || a == 32) {
                invite.addTag($("#tag_input").val().substr(0, $("#tag_input").val().length - 1));
                $("#tag_input").val("")
            }
        }).unbind("keydown.delete").bind("keydown.delete", function (a) {
            if (a.which == 8 && $("#tag_input").val() == "") {
                $("#tag_items span:last-child").remove()
            }
        });
        $("#tag_items").find(".close-tag").die().live("click", function () {
            $(this).parent().remove()
        });
        $("#invite_url").focus()
    }, addTag: function (b) {
        if (typeof b == "undefined") {
            b = $("#tag_input").val();
            $("#tag_input").val("")
        }
        if (b != "" && b.isEmail()) {
            var a = $("#tag_items").find(".tagitem").map(function () {
                return $(this).find("input").val()
            }).get();
            if ($.inArray(b, a) < 0) {
                $("#tag_items").append("<span class='tagitem'><span class='close-tag'></span><input type='hidden' name='tags' value='" + b + "'/>" + b + "</span>");
                $("#tag_items").show()
            }
        }
    }, getTags: function () {
        invite.addTag();
        var a = $("#tag_items").find(".tagitem").map(function () {
            return $(this).find("input").val()
        }).get().join(",");
        return a
    }, sendMailInvitation: function (a) {
        if (!a) {
            a = invite.getTags()
        }
        if (a == "") {
            return
        }
        var b = {};
        b.emailArray = a;
        $("#send_btn").attr("disabled", true).val("发送中...");
        Util.ajax({
            url: "/invitation/send", dataType: "json", data: b, success: function (c) {
                $("#tag_items").children("span").remove();
                $("#send_btn").attr("disabled", false).val("发送邀请");
                $("#invitation-resulttip").html(c)
            }
        })
    }
};
var notification = {
    init: function () {
        $(".noti_item").off().on("click", function () {
            $(".selected").removeClass("selected");
            $(this).addClass("selected");
            $(this).find(".noti_item_unread").remove();
            var a = $(this).attr("id");
            notification.showDetail(a)
        })
    }, loadTab: function (a, b) {
        if (a == null) {
            var c = window.location.hash;
            if (c != "") {
                a = c.substring(1)
            }
        }
        $(".noti_filter span[tit=" + a + "]").addClass("current").siblings().removeClass("current");
        window.location.hash = a == null ? "" : a == "all" ? "" : a;
        var d = {};
        if (b != null) {
            d.page = b
        }
        d._lastsource = a;
        Util.ajax({
            url: "/notification/list", type: "get", data: d, success: function (e) {
                $(".noti-list").html(e);
                notification.init()
            }
        })
    }, showDetail: function (a) {
        Util.get("/notification/detail", {notificationId: a}, function (b) {
            $("#detail").html(b);
            notification.getItem(a).addClass("read");
            Header.notificationsTips()
        })
    }, getItem: function (a) {
        return $(".noti_item[id=" + a + "]")
    }, removeAll: function () {
        $.confirm({
            content: "您确定要删除所有的通知信息吗？", onConfirm: function () {
                Util.ajax({
                    url: "/notification/remove_all", data: {}, success: function () {
                        $(".noti-list").html("<div class='alert success' style='text-align: center;'>所有通知已经被成功删除。</div>")
                    }
                })
            }
        })
    }, remove: function (a) {
        Util.ajax({
            url: "/notification/remove", data: {id: a}, success: function () {
                notification.getItem(a).remove();
                $("#detail").html("<div class='block none'></div>")
            }
        })
    }, refuseCollaboration: function (a) {
        Util.ajax({
            url: "/collaboration/refuse", data: {notificationId: a}, success: function () {
                $(".detail_content").find(".button").remove();
                showMsg("您已经拒绝了加入小组。")
            }
        })
    }, executeTeamInvitation: function (b, a) {
        Util.ajax({
            url: "/team_invite/execute", data: {notificationId: b, status: a}, success: function (c) {
                $(".detail_content").find(".button").remove();
                if (a == "accept") {
                    showMsg("您已经接受了邀请，并加入了小组。", "success");
                    showTeams()
                } else {
                    showMsg("您已经拒绝了加入小组。", "info")
                }
            }
        })
    }, executeTeamJoinRequest: function (b, a) {
        Util.ajax({
            url: "/teams/operate", data: {id: b, status: a}, success: function () {
                $(".detail_content").find(".button").remove();
                if (a == "accept") {
                    showMsg("已经接受了此请求，并且此成员已经加入。", "success")
                } else {
                    showMsg("已经拒绝了此请求。", "info")
                }
            }
        })
    }
};