var DM = {
    init: function () {
        var a = window.location.hash;
        if (a == "" || a == "#") {
            window.location.hash = ""
        }
        DM.initFileCountHeight();
        DM.reloadFileStats();
        $(".colla_item").live("click", function () {
            $(".colla_selected").removeClass("colla_selected");
            $(this).addClass("colla_selected");
            $(".colla_item_btn").css("display", "inline-block");
            if (!$(this).hasClass("team")) {
                var b = $(this).attr("role");
                DM.Colla.setRole(b)
            } else {
                $("#colla_role_setting").hide()
            }
        });
        DM.loadByHash();
        $(window).bind("hashchange", function () {
            DM.loadByHash()
        });
        $("#template_tag_input").die("keyup.input").live("keyup.input", function (d) {
            var d = d || window.event;
            var c = d.which;
            if (c == 13 || c == 188) {
                var b = $.trim($(this).val());
                if (b.indexOf(",") != -1) {
                    b = b.substr(0, b.length - 1)
                }
                DM.addTemplateTags(b);
                $(this).val("").focus();
                $("#_template_tags_box").scrollTop($("#template_tags_list").height());
                if ($("#template_tags_list").children("span.tagitem").length >= 5) {
                    $(this).val("").hide()
                }
            }
        }).die("keydown.delete").live("keydown.delete", function (c) {
            var c = c || window.event;
            var b = c.which;
            if (b == 8 && $(this).val() == "") {
                DM.removeTemplateTags($("#template_tags_list span.tagitem:last-child").find(".close-tag"))
            }
        }).suggest({
            url: "/tags/suggest", valueField: "tagName", format: function (b) {
                return b.tagName
            }, onEnter: function () {
                DM.addTemplateTags();
                $("#_template_tags_box").scrollTop($("#template_tags_list").height())
            }
        })
    },
    loadByHash: function () {
        if (DM.triggerByHash) {
            var a = window.location.hash;
            if (a.length > 1) {
                a = a.substring(1, a.length);
                if (a == "" || a == "collaboration" || a == "team" || a == "template" || a == "purchased_templates" || a == "fav" || a == "history" || a == "attach" || a == "trash") {
                    DM.param.resource = a
                }
            }
            DM.load()
        }
        DM.triggerByHash = true
    },
    param: {resource: "", folderId: "", searchTitle: "", sort: "", view: "", page: 1},
    triggerByHash: true,
    load: function (e) {
        Util.loading({show: true, delay: 500});
        if (DM.param.folderId == "") {
            var a = $(".dir").find("a")[$(".dir").find("a").length - 1];
            var b = $(a).attr("folderId");
            $.extend(DM.param, {folderId: b})
        }
        if (e && e.resource != DM.param.resource) {
            DM.param.sort = ""
        }
        var f = $("#diagrams_title").val();
        $.extend(DM.param, {searchTitle: f});
        if (e) {
            $.extend(DM.param, e)
        }
        DM.triggerByHash = false;
        window.location.hash = DM.param.resource;
        var c = DM.param.resource == "" ? "all" : DM.param.resource;
        $(".network-nav-items[tit=" + c + "]").addClass("active").siblings().removeClass("active");
        var d = $(".item_list").scrollTop();
        Util.ajax({
            url: "/folder/loadfiles", data: this.param, success: function (g) {
                Util.loading("close");
                $(".network-content").html(g);
                if (DM.param.searchTitle) {
                    $(".empty_tip").addClass("search");
                    $(".empty_tip").html("您搜索的文件不存在。<div>您可以继续查看我的文件下的其他文件。</div>")
                }
                $(".item_list").scrollTop(0);
                DM.showContent(e);
                DM.multiSelectEventInit();
                DM.clearMultiSelectValues()
            }
        })
    },
    multiSelectValues: {id: [], types: {}},
    clearMultiSelectValues: function () {
        DM.multiSelectValues.id = [];
        DM.multiSelectValues.types = {}
    },
    multiSelect: function (a, b, e) {
        var c = b.attr("tp");
        var d = b.attr("id");
        if (a) {
            $(".item_list").find(".selected").removeClass("selected");
            DM.multiSelectValues.id = [];
            DM.multiSelectValues.types = {}
        }
        if (b.hasClass("selected")) {
            DM.unSelect(b)
        } else {
            DM.multiSelectValues.id.push(d);
            DM.multiSelectValues.types[d] = c;
            b.addClass("selected")
        }
        DM.showContent();
        if (e != null) {
            e()
        }
    },
    unSelect: function (a) {
        var b = a.attr("id");
        delete DM.multiSelectValues.id.remove(b);
        delete DM.multiSelectValues.types[b];
        a.removeClass("selected")
    },
    multiSelectEventInit: function () {
        $(".file_item").off("mouseup.file_item").on("mouseup.file_item", function (c) {
            var a = $(this);
            if (c.ctrlKey) {
                DM.multiSelect(false, a)
            } else {
                DM.multiSelect(true, a)
            }
            var b = a.attr("category");
            if (b == "mind_right") {
                $("#nmind").show()
            } else {
                $("#nmind").hide()
            }
            c.stopPropagation()
        });
        $(".item-check .if-checkbox-f").off("mouseup.file_item").on("mouseup.file_item", function (b) {
            var a = $(this).parents(".file_item");
            DM.multiSelect(false, a);
            b.stopPropagation()
        });
        $(".item-check .if-checkbox-un").off("mouseup.file_item").on("mouseup.file_item", function (b) {
            var a = $(this).parents(".file_item");
            DM.multiSelect(false, a);
            b.stopPropagation()
        });
        $(".content_container").off("mouseup.content_container").on("mouseup.content_container", function (a) {
            $(this).find(".selected").removeClass("selected");
            DM.clearMultiSelectValues();
            DM.showContent({})
        });
        $(".publiced").on("click", function (b) {
            var a = $(this).parent().parent();
            var c = a.attr("id");
            DM.doUnPublish(c);
            b.stopPropagation()
        })
    },
    showContent: function (f) {
        if (DM.multiSelectValues.id.length == 1) {
            var a = DM.getSelected();
            var b = a.attr("img");
            $("#thumb_img").attr("src", b);
            var c = a.attr("tp");
            var d = a.attr("category");
            $("#preview_box").children("li").hide();
            $("#colla_items").empty();
            $("#file_info_title").text(a.attr("tit")).parent().show();
            $(".btn_operation").show();
            if (c == "folder") {
                $("#file-view").hide();
                $("#file-edit").hide();
                $("#file-share").hide();
                $("#file-open").show()
            } else {
                if (c == "chart") {
                    $("#file-open").hide();
                    $("#file_info_date").text(a.attr("date")).parent().show();
                    $("#file_info_modify").text(a.attr("modify")).parent().show();
                    DM.Colla.loadCollaboration()
                } else {
                    if (c == "fav") {
                        $("#file-edit").show();
                        $("#file_info_favtime").text(a.attr("date")).parent().show();
                        $("#file_info_owner").text(a.attr("owner")).parent().show();
                        $("#file_info_owner").attr("href", a.attr("ownerUrl"));
                        $(".btn_view").attr("href", a.attr("url"))
                    } else {
                        if (c == "trash") {
                            $("#file_info_deletetime").text(a.attr("deleted")).parent().show()
                        } else {
                            if (c == "trash_chart") {
                                $("#file_info_deletetime").text(a.attr("deleted")).parent().show()
                            } else {
                                if (c == "attach") {
                                    $("#file_info_date").text(a.attr("date")).parent().show();
                                    $(".btn_view").attr("href", a.attr("url"))
                                } else {
                                    if (c == "colla") {
                                        $("#file_info_modify").text(a.attr("date")).parent().show();
                                        $("#file_info_owner").text(a.attr("owner")).parent().show();
                                        $("#file_info_owner").attr("href", a.attr("ownerUrl"));
                                        $(".btn_edit").attr("href", "/diagraming/" + a.attr("id"));
                                        $(".btn_view").attr("href", "/view/" + a.attr("id"));
                                        DM.Colla.loadCollaboration({editable: false})
                                    } else {
                                        if (c == "team_chart") {
                                            $("#file_info_date").text(a.attr("date")).parent().show();
                                            $("#file_info_modify").text(a.attr("modify")).parent().show();
                                            $(".btn_edit").attr("href", "/diagraming/" + a.attr("id"));
                                            $(".btn_view").attr("href", "/view/" + a.attr("id"));
                                            $(".btn_group_folder").hide()
                                        } else {
                                            if (c == "team_folder") {
                                                $("#file_info_date").parent().hide();
                                                $("#file_info_modify").parent().hide();
                                                $("#colla_items").empty();
                                                $(".btn_group_chart").hide()
                                            } else {
                                                $("#file-view").hide();
                                                $("#file-edit").hide();
                                                $("#file-share").hide();
                                                $("#file-open").hide();
                                                $(".btn_operation").hide()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (d == "mind_right") {
                $(".export-list").hide();
                $("#export_png, #export_pdf, #export_pos").parents(".export-list").show()
            } else {
                if (d == "mind") {
                    $("#export_xmind, #export_fmind").parents(".export-list").show()
                } else {
                    if (d == "network") {
                        $("#export_xmind, #export_fmind").parents(".export-list").hide()
                    } else {
                        $("#export_xmind, #export_fmind").parents(".export-list").hide()
                    }
                }
            }
        } else {
            if (DM.multiSelectValues.id.length > 1) {
                var c = $(".network-nav-items.active").attr("tit");
                $("#thumb_img").attr("src", "/images/default/diagrams/folder.png");
                $(".btn_operation").hide();
                $("#colla_items").empty();
                $("#file-del").show();
                $("#file-more").show();
                $("#file_info_date").parent().hide();
                $("#file_info_modify").parent().hide();
                $("#file_info_title").parent().hide();
                if (c == "fav") {
                    $(".btn_operation:last").show();
                    $("#file_info_owner").parent().hide();
                    $("#file_info_favtime").parent().hide();
                    $("#file_info_selected").text(DM.getMultiSelectFilesText("fav")).parent().show()
                } else {
                    if (c == "collaboration") {
                        $(".btn_operation:last").show();
                        $("#file_info_owner").parent().hide();
                        $("#file_info_selected").text(DM.getMultiSelectFilesText("colla")).parent().show()
                    } else {
                        if (c == "trash") {
                            $(".btn_operation:last").show();
                            $("#file_info_owner").parent().hide();
                            $("#file_info_selected").text(DM.getMultiSelectFilesText("trash_chart", "trash")).parent().show()
                        } else {
                            $("#file_info_selected").text(DM.getMultiSelectFilesText()).parent().show()
                        }
                    }
                }
            } else {
                var e = $(".item_list").children(".file_item").length;
                if (e > 0) {
                    $("#thumb_img").attr("src", "/images/default/diagrams/folder.png")
                } else {
                    $("#thumb_img").attr("src", "/images/default/diagrams/folder_empty.png")
                }
                $("#preview_box").children("li").hide();
                $(".btn_operation").hide();
                $(".btn_publish").hide();
                $("#colla_items").empty();
                if (f && f.callback) {
                    f.callback()
                }
                if (resize != null) {
                    resize.initInnerHeight()
                }
                $("#file_info_title").text($(".network-nav-items.active").text()).parent().show()
            }
        }
    },
    getMultiSelectFilesText: function (d, c) {
        d = d == null ? "chart" : d;
        c = c == null ? "folder" : c;
        var e = $(".file_item[tp=" + c + "].selected").length;
        e = e == 0 ? "" : e + "个文件夹";
        var b = $(".file_item[tp=" + d + "].selected").length;
        b = b == 0 ? "" : b + "个文件";
        var a = b + " " + e;
        return a
    },
    initFileCountHeight: function () {
        $(window).bind("resize.filecount", function () {
            var a = $(".content-right").height();
            $("#preview_container").css("min-height", a - 229 - $(".diagrams-info").outerHeight() + "px")
        });
        $(window).trigger("resize.filecount")
    },
    reloadFileStats: function () {
        Util.ajax({
            url: "/view/getprivatefilecount", success: function (a) {
                $(".diagram_right_stats_bar").children("span").text("私有文件：" + a.filecount + " / " + a.totalcount);
                $(".diagram_right_stats_bar").children("div").css("width", a.filecount / a.totalcount * 100 + "%");
                if (a.totalcount - a.filecount <= 4) {
                    $(".diagram_right_stats_bar").children("div").addClass("diagram-levelbar-active")
                } else {
                    $(".diagram_right_stats_bar").children("div").removeClass("diagram-levelbar-active")
                }
            }
        })
    },
    showSort: function (a) {
        $("#sort_menu").popMenu({fixed: true, offsetY: 1, target: $(a)})
    },
    showMoreMenu: function (d) {
        var b = DM.getSelected();
        var c = b.length;
        var a = "";
        if (c == 1) {
            a = b.attr("tp")
        }
        $("#more_menu").popMenu({fixed: true, offsetY: 1, target: $(d), closeAfterClick: true});
        $("#more_menu li").removeClass("disable");
        if (a == "") {
            $("#menu_clone, #menu_edit").removeAttr("onclick").addClass("disable")
        } else {
            if (a == "folder") {
                $("#menu_clone").removeAttr("onclick").addClass("disable")
            } else {
                $("#menu_clone").attr("onclick", "DM.newCreateConfirm()");
                $("#menu_edit").attr("onclick", "DM.showTitleEdit('edit')")
            }
        }
    },
    toEdit: function () {
        var a = DM.getSelected();
        if (a.attr("category") == "mind_right") {
            window.open("/mindmap/" + a.attr("id"))
        } else {
            window.open("/diagraming/" + a.attr("id"))
        }
    },
    toView: function () {
        var a = DM.getSelected();
        window.open("/view/" + a.attr("id"))
    },
    viewSelectedTemplate: function (b) {
        var a = DM.getSelected();
        window.open("/view/" + a.attr("id"))
    },
    showShareMenu: function (b) {
        var a = DM.getSelected();
        $("#share_menu").popMenu({fixed: true, offsetY: 1, target: $(b), closeAfterClick: true})
    },
    getSelected: function () {
        return $(".item_list").find(".selected")
    },
    deleteConfirm: function () {
        var a = DM.getSelected();
        var b = a.attr("tit");
        if (a.length > 1) {
            b = DM.getMultiSelectFilesText()
        }
        $.confirm({
            content: "您将把&nbsp;<i><b>" + b + "</b></i>&nbsp;&nbsp;移除到垃圾箱中，是否继续？<br/><br/>删除后，您可以从回收站恢复文件。",
            onConfirm: function () {
                var e = DM.multiSelectValues.id.join(",");
                var c = [];
                $.each(DM.multiSelectValues.id, function (f, g) {
                    c.push(DM.multiSelectValues.types[g])
                });
                var d = c.join(",");
                Util.loading({show: true, delay: 0, content: "in processing"});
                Util.ajax({
                    url: "/folder/to_trash", data: {fileType: d, fileId: e}, success: function (f) {
                        if (f.result == "success") {
                            DM.load();
                            DM.reloadFileStats()
                        }
                        Util.loading("close");
                        DM.clearMultiSelectValues()
                    }
                })
            }
        })
    },
    newCreateConfirm: function () {
        var b = DM.getSelected();
        var c = b.attr("category");
        var a = "";
        if (c == "mind" || c == "mind_right") {
            a = "&category=" + c
        }
        var d = b.attr("id");
        Util.checkPrivateFileCount(function () {
            location = "/diagraming/new?template=" + d + a
        })
    },
    removeReferenced: function () {
        var a = DM.getSelected();
        var c = a.attr("tit");
        var d = a.attr("id");
        var b = a.attr("price");
        $.confirm({
            content: "您将要删除对&nbsp;&quot;" + c + "&nbsp;&quot;模板的引用。<br/>对此模板的引用曾经花费您&nbsp;" + b + "&nbsp;个金币。<br/>是否继续？",
            onConfirm: function () {
                Util.ajax({
                    url: "/diagrams/remove_referenced", data: {chartId: d}, success: function (e) {
                        a.animate(function () {
                            a.css({opaicity: "0"})
                        }, 200);
                        setTimeout(function () {
                            a.remove()
                        }, 200)
                    }
                })
            }
        })
    },
    deleteLikeConfirm: function () {
        var a = DM.getSelected();
        var b = a.attr("tit");
        if (a.length > 1) {
            b = DM.getMultiSelectFilesText("fav")
        }
        $.confirm({
            content: "您将把&nbsp;<b><i>" + b + "</i></b>&nbsp; 从我的收藏中删除，是否继续？", onConfirm: function () {
                var c = DM.multiSelectValues.id.join(",");
                Util.ajax({
                    url: "/folder/to_trash", data: {fileType: "fav", fileId: c}, success: function (d) {
                        DM.load()
                    }
                })
            }
        })
    },
    deleteCollaConfirm: function () {
        var a = DM.getSelected();
        var b = a.attr("tit");
        if (a.length > 1) {
            b = DM.getMultiSelectFilesText("colla")
        }
        $.confirm({
            content: "您将删除&nbsp;<b><i>" + b + "</i></b><br/><br/>删除之后，您将退出此文件的协作，并且无法继续编辑它。",
            onConfirm: function () {
                var c = DM.multiSelectValues.id.join(",");
                Util.ajax({
                    url: "/folder/to_trash", data: {fileType: "colla", fileId: c}, success: function (d) {
                        DM.load()
                    }
                })
            }
        })
    },
    deleteTeamConfirm: function () {
        var b = DM.getSelected();
        var d = b.attr("tit");
        var e = b.attr("id");
        var a = b.attr("tp");
        var c = "您将删除：&nbsp;<b>" + d + "</b>";
        if (a == "team_folder") {
            c += "<br/><br/>删除之后，此文件夹将在小组中消失，里边包含的文件也将删除。"
        } else {
            c += "<br/><br/>删除之后，此文件将在小组中消失，小组成员将无法再继续编辑它。"
        }
        $.confirm({
            content: c, onConfirm: function () {
                Util.ajax({
                    url: "/folder/to_trash", data: {type: a, id: e}, success: function (f) {
                        DM.load()
                    }
                })
            }
        })
    },
    clearTrash: function (a) {
        var f = {fileType: "all", fileId: ""};
        var d = "您将清空回收站，是否继续？<br/>此操作不可恢复。";
        if (a) {
            var c = DM.getSelected();
            var e = c.attr("tit");
            if (c.length > 1) {
                e = DM.getMultiSelectFilesText("trash_chart", "trash")
            }
            f.fileId = DM.multiSelectValues.id.join(",");
            var b = [];
            $.each(DM.multiSelectValues.id, function (g, h) {
                b.push(DM.multiSelectValues.types[h])
            });
            f.fileType = b.join(",");
            d = "您将把&nbsp;<b><i>" + e + "</i></b>&nbsp;&nbsp;从垃圾箱中彻底删除，是否继续？<br/>此操作不可恢复。"
        }
        $.confirm({
            content: d, onConfirm: function () {
                Util.loading({show: true, delay: 0, content: "in processing"});
                Util.ajax({
                    url: "/folder/remove_from_trash", data: f, success: function (g) {
                        DM.load();
                        Util.loading("close")
                    }
                })
            }
        })
    },
    restoreTrash: function (a) {
        var f = {fileType: "all", fileId: ""};
        var d = "确认还原所有文件？";
        if (a) {
            var c = DM.getSelected();
            var e = c.attr("tit");
            if (c.length > 1) {
                e = DM.getMultiSelectFilesText("trash_chart", "trash")
            }
            f.fileId = DM.multiSelectValues.id.join(",");
            var b = [];
            $.each(DM.multiSelectValues.id, function (g, h) {
                b.push(DM.multiSelectValues.types[h])
            });
            f.fileType = b.join(",");
            d = "您将把&nbsp;<b><i>" + e + "</i></b>&nbsp;&nbsp;从垃圾箱中还原，是否继续？"
        }
        $.confirm({
            content: d, onConfirm: function () {
                Util.loading({show: true, delay: 0, content: "in processing"});
                Util.ajax({
                    url: "/folder/restore", data: f, success: function (g) {
                        if (g.result == "overed") {
                            Util.globalTopTip("私有存储空间已经不足，只能创建公开文件，您可以 <a target='_blank' href='/support/privatefile'>增加私有文件数量</a>", "top_error", 9000)
                        } else {
                            DM.load();
                            DM.reloadFileStats()
                        }
                        Util.loading("close")
                    }
                })
            }
        })
    },
    deleteAttachment: function () {
        var b = DM.getSelected();
        var c = b.attr("tit");
        var a = b.attr("id");
        $.confirm({
            content: "您将删除附件：" + c + "<br/>删除后，链接到此附件的数据属性将失效。是否继续？", onConfirm: function () {
                Util.ajax({
                    url: "/folder/to_trash", data: {type: "attach", id: a}, success: function (d) {
                        DM.load()
                    }
                })
            }
        })
    },
    showTitleEdit: function (e) {
        $("#folder_new_title").removeAttr("submitting");
        var b = DM.getSelected();
        var a = b.attr("id");
        if (e == "edit") {
            var d = b.attr("tit");
            $("#folder_new_title").val(d);
            if (b.attr("tp") == "folder" || b.attr("tp") == "team_folder") {
                $("#dlg_new_folder").attr("title", "编辑文件夹")
            } else {
                $("#dlg_new_folder").attr("title", "文件重命名")
            }
        } else {
            $("#folder_new_title").val("新建文件夹");
            $("#dlg_new_folder").attr("title", "新建文件夹")
        }
        $("#dlg_new_folder").dialog();
        $("#folder_new_title").select();
        $("#folder_new_title").unbind("keyup").bind("keyup", function (f) {
            if (f.keyCode == 13) {
                c();
                return
            }
            if ($.trim($(this).val()) != "") {
                $("#btn_submit_folder").attr("disabled", false)
            } else {
                $("#btn_submit_folder").attr("disabled", true)
            }
            if ($.trim($(this).val()).length > 60) {
                $(this).val($.trim($(this).val()).substring(0, 60))
            }
        });
        $("#btn_submit_folder").unbind("click").bind("click", function (f) {
            c()
        });
        function c() {
            var h = $("#folder_new_title").val();
            if ($.trim(h) != "") {
                var g = {title: h};
                var f = "/folder/new";
                if (e == "edit") {
                    if (b.attr("tp") == "folder" || b.attr("tp") == "team_folder") {
                        g.folderId = a;
                        f = "/folder/rename"
                    } else {
                        g.chartId = a;
                        f = "/folder/rename/chart"
                    }
                }
                if ($("#folder_new_title").attr("submitting")) {
                    return
                }
                $("#folder_new_title").attr("submitting", "true");
                Util.ajax({
                    url: f, data: g, success: function (i) {
                        if (i.result == "success") {
                            $("#dlg_new_folder").dialog("close");
                            DM.load({
                                callback: function () {
                                    $("#" + a).trigger("click")
                                }
                            })
                        }
                        $("#folder_new_title").removeAttr("submitting")
                    }
                })
            }
        }
    },
    openFileImportWin: function () {
        $("#dlg_import").dialog()
    },
    openFolder: function () {
        var b = DM.getSelected();
        var a = b.attr("id");
        DM.load({folderId: a})
    },
    showCopy: function () {
        $(".changer_folder").attr("folderId", "root").text("我的文件");
        $("#dlg_copy").dialog();
        $("#btn_submit_move").unbind().bind("click", function () {
            a("/folder/move")
        });
        $("#btn_submit_copy").unbind().bind("click", function () {
            a("/folder/copy")
        });
        function a(c) {
            var f = DM.getSelected();
            var d = [];
            var e = DM.multiSelectValues.id.join(",");
            $.each(DM.multiSelectValues.id, function (g, h) {
                d.push(DM.multiSelectValues.types[h])
            });
            var b = $(".changer_folder").attr("folderid");
            Util.loading({show: true, delay: 0, content: "in processing"});
            Util.ajax({
                url: c, data: {fileType: d, fileId: e, target: b}, success: function (g) {
                    if (g.result == "overed") {
                        Util.globalTopTip("您的私有存储空间不足以存放您要复制的文件或文件夹，您可以 <a target='_blank' href='/support/privatefile'>扩容</a>", "top_error", 9000);
                        DM.load()
                    } else {
                        DM.load()
                    }
                    $("#dlg_copy").dialog("close");
                    DM.reloadFileStats();
                    Util.loading("close");
                    DM.clearMultiSelectValues()
                }
            })
        }
    },
    dropFolderList: function (d) {
        var c = $("#folderlist_panel");
        c.popMenu({
            fixed: true,
            target: $(d),
            offsetY: 1,
            position: "left",
            zindex: 4,
            autoClose: true,
            closeAfterClick: true
        });
        c.html("<img src='/images/default/loading.gif' style='margin:5px;'/>");
        Util.get("/folder/getfolderdata", {}, function (g) {
            var f = $("#folderlist_panel");
            f.html("<ul><li id='root' style='padding-left:0px'><span id='root'><img class='folder_tree_icon' src='/images/default/files/folder_empty.png'/>我的文件</span></li></ul>");
            a(g, "root");
            f.find("span").unbind().bind("click", function () {
                $(".changer_folder").text($(this).text());
                $(".changer_folder").attr("folderId", $(this).attr("id"))
            })
        });
        var b = DM.getSelected();
        var e = [];
        $.each(b, function (g, h) {
            var f = $(h);
            if (f.attr("tp") == "folder") {
                e.push(f.attr("id"))
            }
        });
        function a(m, o) {
            var k = m.folders;
            var h = k[o];
            var n = $("#folderlist_panel").find("li#" + o);
            if (h && h.length) {
                var g = $("<ul parentId='" + o + "'></ul>").appendTo(n);
                for (var j = 0; j < h.length; j++) {
                    var l = h[j];
                    if (!e.inArray(l.folderId)) {
                        g.append("<li id='" + l.folderId + "'><span id='" + l.folderId + "'><img class='folder_tree_icon' src='/images/default/files/folder_empty.png'/>" + l.title + "</span></li>");
                        if (typeof k[l.folderId] != "undefined") {
                            a(m, l.folderId)
                        }
                    }
                }
            }
        }
    },
    doUnPublish: function (a) {
        Util.ajax({
            url: "/folder/unpublish", data: {id: a}, success: function (b) {
                DM.load({
                    callback: function () {
                        $("#" + a).trigger("click")
                    }
                });
                if (b.result == "overed") {
                    Util.globalTopTip("私有存储空间已经不足，只能创建公开文件，您可以 <a target='_blank' href='/support/privatefile'>扩容</a>", "top_error", 9000)
                }
                if (b.result != "overed") {
                    DM.reloadFileStats()
                }
                $("#hover_tip").remove()
            }
        })
    },
    showPublishEmbed: function () {
        var c = DM.getSelected();
        var e = c.attr("id");
        $("#dlg_publish_embed").dialog();
        $("#iframe_html").val("");
        $(".embed_preview").html("");
        var a, b;
        a = $("#embed_width").val();
        b = $("#embed_height").val();
        d(a, b);
        $("#iframe_html").select();
        function d(f, j) {
            var g = '<iframe id="embed_dom" name="embed_dom" frameborder="0" style="border:1px solid #000;display:block;width:' + f + "px; height:" + j + 'px;" src="https://www.processon.com/embed/' + e + '"></iframe>';
            $("#iframe_html").val(g);
            $(".embed_preview_wrap").css({"margin-top": (-j / 2) + "px", "margin-left": (-f / 2) + "px"});
            $(".embed_preview").html("").html(g);
            var i = document.getElementById("embed_dom");
            i.onload = i.onreadystatechange = function () {
                if (!i.readyState || i.readyState == "complete") {
                    setTimeout(function () {
                        $(".embed_preview .preview_dis").remove();
                        setTimeout(function () {
                            $(".embed_obj").fadeIn()
                        }, 100)
                    }, 400)
                }
            }
        }

        $(".embed_size").find("input").keyup(function () {
            var f = $.trim($("#embed_width").val()) == "" ? 340 : $.trim($("#embed_width").val());
            var g = $.trim($("#embed_height").val()) == "" ? 160 : $.trim($("#embed_height").val());
            f = parseInt(f);
            g = parseInt(g);
            $(".embed_preview").find("div:first").css({width: f + "px", height: g + "px"});
            $(".embed_preview").find("iframe").css({width: f + "px", height: g + "px"});
            d(f, g)
        });
        $("#iframe_html").unbind().bind("click", function () {
            $(this).select()
        });
        $(".embed_preview").keydown(function () {
            $(".embed_size").find("input").blur()
        })
    },
    onlinePic: function () {
        var a = DM.getSelected();
        $("#dlg_online_pic").dialog();
        $("#img_link_input").val("https://www.processon.com/chart_image/" + a.attr("ori") + ".png");
        $("#img_link_input").off().on("click", function () {
            $(this).select()
        })
    },
    showPublish: function () {
        var h = "";
        var f;
        $("#as_template").removeAttr("checked");
        $("#public_edit").removeAttr("checked");
        $("#tag_tip").hide();
        $("#dlg_publish").dialog();
        b($("._publish_nav"));
        var d = DM.getSelected();
        var j = d.attr("id");
        var g = "https://www.processon.com/view/" + j;
        $("#public_link").text(g).attr("href", g);
        $("#tag_items").children("span").remove();
        Util.get("/folder/get_chart", {id: j}, function (m) {
            f = m.chart;
            i(f.status);
            if (f.language != "") {
                $("#publish_language").val(f.language)
            }
            $("#publish_industry").val(f.industry);
            if (f.tags != null && f.tags.length > 0) {
                for (var l = 0; l < f.tags.length; l++) {
                    a(f.tags[l])
                }
            }
            if ($("#tag_items").children("span").length < 5) {
                $("#tag_input").val("").show()
            } else {
                $("#tag_input").val("").hide()
            }
            $("#publish_description").val(f.description);
            if (f.template == true) {
                $("#as_template").attr("checked", "true")
            } else {
                $("#as_template").removeAttr("checked")
            }
        });
        $("#to_publish_edit").unbind().bind("click", function () {
            $("#publish_show_link").slideUp("fast", function () {
            });
            $(".publish_opt").slideDown();
            $("#dlg_publish").css({height: "435px"});
            $("#dlg_publish").css({
                top: ($(window).height() - $("#dlg_publish").outerHeight()) / 2 + "px",
                left: ($(window).width() - $("#dlg_publish").outerWidth()) / 2 + "px"
            })
        });
        function b(l) {
            $("._content").hide();
            $(".embed_preview").html("");
            $("._nav").removeClass("action_nav");
            $(l).addClass("action_nav")
        }

        $("._nav").unbind().bind("click", function () {
            b($(this));
            if ($(this).attr("for") == "_publish_content") {
                i(f.status)
            } else {
                $("." + $(this).attr("for")).show();
                var l, m;
                l = $("#embed_width").val();
                m = $("#embed_height").val();
                c(l, m);
                $("#iframe_html").select()
            }
        });
        function c(l, o) {
            var m = '<iframe id="embed_dom" name="embed_dom" frameborder="0" style="border:1px solid #000;width:' + l + "px; height:" + o + 'px;" src="https://www.processon.com/embed/' + j + '"></iframe>';
            $("#iframe_html").val(m);
            if ($(".embed_preview").html() == "") {
                $(".embed_preview").append(m);
                var n = document.getElementById("embed_dom");
                n.onload = n.onreadystatechange = function () {
                    if (!n.readyState || n.readyState == "complete") {
                        setTimeout(function () {
                            $(".embed_preview .preview_dis").remove();
                            setTimeout(function () {
                                $(".embed_obj").fadeIn()
                            }, 100)
                        }, 400)
                    }
                }
            }
        }

        $(".embed_size").find("input").unbind().keyup(function () {
            var l = $.trim($("#embed_width").val()) == "" ? 340 : $.trim($("#embed_width").val());
            var m = $.trim($("#embed_height").val()) == "" ? 160 : $.trim($("#embed_height").val());
            l = parseInt(l);
            m = parseInt(m);
            $(".embed_preview").find("div:first").css({width: l + "px", height: m + "px"});
            $(".embed_preview").find("iframe").css({width: l + "px", height: m + "px"});
            c(l, m)
        });
        $(".publish_opt_link").unbind().bind("click", function () {
            Util.get("/view/private_link_create", {id: j}, function (l) {
                $("#private-link-a").val("https://www.processon.com/view/share/" + l.link);
                $(".private-link").show();
                $(".publish_opt_link").hide();
                h = l.link
            })
        });
        $("#private-link-a").unbind().bind("click", function () {
            $(this).select()
        });
        $(".remove-link").die().live("click", function () {
            if (h == "") {
                return
            }
            Util.ajax({
                url: "/view/remove_linkId", data: {id: j}, success: function (l) {
                    h = "";
                    $("#private-link-a").val("");
                    $(".private-link").hide();
                    $(".publish_opt_link").css("display", "inline-block")
                }
            })
        });
        $("#tag_input").unbind("keyup.input").bind("keyup.input", function (m) {
            if ($.trim($(this).val()).length > 30) {
                $(this).val($.trim($(this).val()).substring(0, 30))
            }
            var l = m.which;
            if (l == 13) {
                a($("#tag_input").val());
                $("#tag_input").val("")
            }
            if (l == 188) {
                a($("#tag_input").val().substr(0, $("#tag_input").val().length - 1));
                $("#tag_input").val("")
            }
            $("#publish_addtags").scrollTop($(".input_item_box").height());
            if ($("#tag_items").children("span").length >= 5) {
                $("#tag_input").val("").hide()
            }
        }).unbind("keydown.delete").bind("keydown.delete", function (l) {
            if (l.which == 8 && $("#tag_input").val() == "") {
                $("#tag_items span:last-child").remove()
            }
        }).suggest({
            url: "/tags/suggest", valueField: "tagName", format: function (l) {
                return l.tagName
            }, onEnter: function () {
                a();
                $(".feedTags").scrollTop($(".input_item_box").height())
            }
        });
        $("#tag_items").find(".close-tag").die().live("click", function () {
            $(this).parent().remove();
            if ($("#tag_items").children("span").length < 5) {
                $("#tag_input").val("").show().focus()
            }
        });
        $("#btn_submit_publish").unbind().bind("click", function () {
            var l = "public";
            e(l)
        });
        $("#btn_submit_private").unbind().bind("click", function () {
            var l = "private";
            e(l)
        });
        function e(l) {
            var m = {};
            m.id = j;
            m.language = $("#publish_language").val();
            m.industry = $("#publish_industry").val();
            m.description = $("#publish_description").val();
            m.tags = k();
            m.status = l;
            m._public_edit = ($("#public_edit")[0].checked == true) ? "true" : "false";
            m._public_clone = ($("#public_clone")[0].checked == true) ? "true" : "false";
            if (l == "public" && m.tags.length == 0) {
                $("#tag_tip").show();
                $("#publish_addtags").find("input").focus();
                return
            }
            $("#tag_tip").hide();
            $("#btn_submit_publish").disable();
            Util.ajax({
                url: "/folder/publish", data: m, success: function (o) {
                    var n = Number(o.addCoins);
                    DM.load({
                        callback: function () {
                            $("#" + j).trigger("click")
                        }
                    });
                    $("#dlg_publish").dialog("close");
                    if (o.result == "overed") {
                        Util.globalTopTip("私有存储空间已经不足，只能创建公开文件，您可以 <a target='_blank' href='/support/privatefile'>扩容</a>", "top_error", 9000)
                    } else {
                        if (n > 0) {
                            Util.globalTopTip('发布文件成功，<font style="font-size:16px;"> +' + n + " </font>积分")
                        }
                    }
                    if (o.result != "overed") {
                        DM.reloadFileStats()
                    }
                    $("#btn_submit_publish").enable()
                }
            })
        }

        function i(l) {
            if (l == "public") {
                $("#publish_show_link").show();
                $(".publish_opt").hide();
                $("#dlg_publish").css({height: "300px"})
            } else {
                $("#publish_show_link").hide();
                $(".publish_opt").show();
                $("#dlg_publish").css({height: "435px"})
            }
            $("#dlg_publish").css({
                top: ($(window).height() - $("#dlg_publish").outerHeight()) / 2 + "px",
                left: ($(window).width() - $("#dlg_publish").outerWidth()) / 2 + "px"
            })
        }

        function a(m) {
            if (typeof m == "undefined") {
                m = $("#tag_input").val();
                $("#tag_input").val("")
            }
            if (m != "") {
                var l = $("#tag_items").find(".tagitem").map(function () {
                    return $(this).find("input").val()
                }).get();
                if ($.inArray(m, l) < 0) {
                    $("#tag_items").append("<span class='tagitem'><span class='close-tag'></span><input type='hidden' name='tags' value='" + m + "'/>" + m + "</span>");
                    $("#tag_items").show()
                }
            }
        }

        function k() {
            a();
            var l = $("#tag_items").find(".tagitem").map(function () {
                return $(this).find("input").val()
            }).get();
            return l
        }
    },
    showViewLink: function () {
        var c = DM.getSelected();
        var d = c.attr("id");
        var b = null;
        var a = "";
        Util.get("/folder/get_chart", {id: d}, function (h) {
            b = h.chart;
            a = b.viewLinkId;
            var i = b.title;
            $(".create_view_link h3").find("span._tip2").html(i);
            $("#view_link_window").dialog();
            if (a == "" || a == null) {
                DM.showCreateViewLink()
            } else {
                var g = "off";
                var e = null;
                if (b.viewPassword != null || b.viewPassword != "") {
                    g = "on";
                    e = b.viewPassword
                }
                DM.showShareViewLink(g, e);
                var f = "https://www.processon.com/view/link/" + a;
                $("#_view_link_input").val(f).select()
            }
        })
    },
    showCreateViewLink: function () {
        $(".create_view_link h3").find("span._tip1").html("创建分享浏览链接");
        $("#view_link_window").find(".txt").css({width: "390px"}).removeAttr("readonly", "readonly");
        if ($("#_locale").val() === "zh") {
            $("#view_link_window").find(".txt").css({width: "410px"})
        }
        $("#_view_link_input").val("");
        var a = "<p>希望分享给别人，又不想完全公开？您可以在此创建一个浏览链接，分享给别人后，可以通过此链接来安全地浏览您的文件。 </p><p>当然，您也可以给浏览链接添加密码，以便您享有更多的控制权限。 </p>";
        $(".create_dis").html(a);
        setTimeout(function () {
            $(".create.button").show()
        }, 200)
    },
    showShareViewLink: function (d, b) {
        var e = "-1px";
        var c = "#fff;color:#323232;text-shadow:0px 1px 0px rgba(255,255,255,0.3)";
        if (d == "on" && b != "" && b != null) {
            e = "33px";
            c = "#5da206;color:#fff;text-shadow:0px 1px 0px rgba(0,0,0,0.3)"
        }
        $(".create_view_link h3").find("span._tip1").html("分享链接以便其他人可以浏览文件 ");
        $(".create.button").hide();
        $("#view_link_window").find(".txt").css({width: "98%"}).attr("readonly", "readonly");
        var a = '<p>密码保护</p><p><a href="javascript:;" onclick="DM.deleteViewLink()">删除链接</a>&nbsp;撤销访问权</p><div class="edit_pw_protect" style="background:' + c + ';" onclick="DM.changePWState(this)"><span class="pw_protect_on">开</span><span class="pw_protect_off">关</span><div class="pw_protect_watch" style="left: ' + e + ';"></div></div><div class="password_input_w"><input type="text" class="_pw txt" value="" placeholder=\'密码\' /><span class="button add_pw_btn" onclick="DM.addViewLinkPassword(this)">添加 </span><div style="clear:both;"></div></div>';
        $(".create_dis").html(a);
        if (d == "on" && b != "" && b != null) {
            $(".button.add_pw_btn").text("更改");
            $(".password_input_w").show().find("._pw").val(b)
        }
    },
    createViewLink: function (b) {
        var a = DM.getSelected();
        var c = a.attr("id");
        Util.ajax({
            url: "/view/addlink", data: {chartId: c}, success: function (f) {
                DM.showShareViewLink("off");
                var d = f.viewLinkId;
                var e = "https://www.processon.com/view/link/" + d;
                $("#_view_link_input").val(e).select()
            }
        })
    },
    deleteViewLink: function () {
        var a = DM.getSelected();
        var b = a.attr("id");
        Util.ajax({
            url: "/view/dellink", data: {chartId: b}, success: function (c) {
                DM.showCreateViewLink()
            }
        })
    },
    changePWState: function (a) {
        var d = $(a).find(".pw_protect_watch")[0];
        var b = DM.getSelected();
        var e = b.attr("id");
        var c = d.offsetLeft;
        if (c == -1) {
            $(d).css({left: "33px"});
            $(".button.add_pw_btn").text("添加");
            $(".password_input_w").show().find("._pw").val("").focus()
        } else {
            Util.ajax({
                url: "/view/removepassword", data: {chartId: e}, success: function (f) {
                    $(d).css({left: "-1px"});
                    $(".edit_pw_protect").css({
                        background: "#fff",
                        color: "#323232",
                        "text-shadow": "0px 1px 0px rgba(255,255,255,0.3)"
                    });
                    $(".password_input_w").find("._pw").val("");
                    $(".password_input_w").hide()
                }
            })
        }
    },
    addViewLinkPassword: function (c) {
        var b = DM.getSelected();
        var d = b.attr("id");
        var a = $.trim($(c).parent().find("._pw").val());
        if (a == "") {
            $("._pw").focus();
            return false
        }
        Util.ajax({
            url: "/view/addpassword", data: {viewPassword: a, chartId: d}, success: function (e) {
                $(".edit_pw_protect").css({
                    background: "#5da206",
                    color: "#fff",
                    "text-shadow": "0px 1px 0px rgba(0,0,0,0.3)"
                });
                $(".button.add_pw_btn").text("更改")
            }
        })
    },
    showExport: function () {
        $("#dlg_export").dialog();
        $("#export_png").click()
    },
    doExport: function () {
        $("#dlg_export").dialog("close");
        Util.loading({show: 10000, delay: 500});
        var a = $("input[name=export-format]:checked").val(), c = DM.getSelected().attr("id"), b = DM.getSelected().attr("category");
        if (b == "mind" || b == "mind_right") {
            $("#export_mind").val("mind")
        } else {
            $("#export_mind").val("")
        }
        $("#export_type").val(a);
        $("#export_id").val(c);
        if ($("#export_mind").val() == "mind" && (a == "svg" || a == "pdfHD")) {
            this.exportFile(a);
            return
        }
        Util.loading("close");
        $("#export_form").submit();
        $("#export_submit").disable();
        setTimeout(function () {
            $("#export_submit").enable()
        }, 2000)
    },
    exportFile: function (e) {
        var g = DM.getSelected(), f = g.attr("category"), a = $("body"), d = "/diagraming/";
        if (/mind/.test(f)) {
            d = "/mind/"
        }
        if (/ui|ios|andriod/.test(f)) {
            d = "/apps/"
        }
        var c = $("<div id='iframe_svg' style='visibility:hidden;opacity:0;'><iframe src=" + d + g.attr("id") + "></iframe></div>").appendTo(a);
        c.find("iframe").on("load", function (h) {
            var b = $(this).contents();
            b.find("#export_" + e).trigger("click");
            b.find("#export_ok").trigger("click");
            Util.loading("close");
            setTimeout("iframe_svg.remove()", 8000)
        })
    },
    Colla: {
        loadCollaborationReq: null, loadCollaboration: function (a) {
            var b = {reload: false, editable: true};
            $.extend(b, a);
            if (this.loadCollaborationReq) {
                this.loadCollaborationReq.abort()
            }
            var c = DM.getSelected();
            var d = c.attr("id");
            if (!b.reload && $("#colla_items").attr("chartId") == d && $("#colla_items").html() != "") {
                return
            }
            $("#colla_items").empty();
            $("#colla_items").attr("chartId", d);
            this.loadCollaborationReq = Util.ajax({
                url: "/collaboration/list_users",
                data: {chartId: d, editable: b.editable},
                success: function (e) {
                    $("#colla_items").html(e);
                    this.loadCollaborationReq = null
                }
            })
        }, getSelected: function () {
            return $(".colla_selected")
        }, deleteCollaboration: function () {
            DM.Colla.cancelDeleteCollaboration();
            var b = DM.Colla.getSelected();
            var d = b.find(".collabra_name").text();
            var e = "";
            if (b.hasClass("team")) {
                e = "您将终止此文件与小组： <span style='font-weight:bold;'>" + d + "</span> 的协作，是否继续？"
            } else {
                e = '您将把 <span style="font-weight:bold;">' + d + "</span> 从您的协作成员中删除，是否继续？"
            }
            var c = '<div id="delete_colla_confirm" style="display:none;" class="alert">' + e + '<div style="margin-top:5px;"><a href="javascript:" class="button green">确定</a>&nbsp;&nbsp;<a href="javascript:" class="button" onclick="DM.Colla.cancelDeleteCollaboration()">取消</a></div></div>';
            var a = $(c).insertAfter($(".colla_btns"));
            a.fadeIn().find(".green").unbind().bind("click", function () {
                DM.Colla.doDeleteCollaboration();
                DM.Colla.cancelDeleteCollaboration()
            })
        }, cancelDeleteCollaboration: function () {
            $("#delete_colla_confirm").remove()
        }, doDeleteCollaboration: function () {
            var b = {};
            var a = DM.Colla.getSelected();
            if (a.hasClass("team")) {
                b.type = "team";
                b.teamId = a.attr("teamId");
                b.chartId = DM.getSelected().attr("id")
            } else {
                b.type = "user";
                b.collaborationId = a.attr("collaId")
            }
            Util.ajax({
                url: "/collaboration/delete", data: b, success: function (c) {
                    $(".colla_item_btn").hide();
                    a.remove()
                }
            })
        }, showRoleSetting: function (a, b) {
            $("#coll_role_menu").popMenu({
                fixed: true,
                target: $(a),
                position: "left",
                autoClose: true,
                closeAfterClick: true,
                offsetY: 1
            });
            $("#coll_role_menu").find("span").removeClass("selected");
            $("#coll_role_menu").find("li[role=" + b + "]").find("span").addClass("selected");
            $("#coll_role_menu").find("li").unbind().bind("click", function () {
                var e = $(this).attr("role");
                DM.Colla.setRole(e);
                var c = DM.Colla.getSelected();
                var d = c.attr("collaId");
                if (e != c.attr("role")) {
                    c.attr("role", e);
                    if (e == "viewer") {
                        c.find(".role").text("浏览者")
                    } else {
                        c.find(".role").text("编辑者")
                    }
                    Util.ajax({
                        url: "/collaboration/set_role", data: {collaborationId: d, role: e}, success: function (f) {
                        }
                    })
                }
            })
        }, setRole: function (a) {
            if (a == "viewer") {
                $("#colla_role_setting").find(".text").text("浏览者")
            } else {
                $("#colla_role_setting").find(".text").text("编辑者")
            }
            $("#colla_role_setting").attr("role", a)
        }, showAdd: function () {
            $("#colla_add").dialog();
            $("#colla_suggest_box").empty();
            $("#add_step2").hide();
            $("#add_step1").show();
            var a = "";
            Util.ajax({
                url: "/collaboration/get_contacter_team_members", data: {source: "diagrams"}, success: function (c) {
                    $("#colla_suggest_box").css({background: "none"});
                    $("#colla_suggest_box").html(c);
                    var b = $("#colla_add").outerHeight();
                    var d = $(window).height();
                    $("#colla_add").css({top: (d - b) * 0.5 + "px"})
                }
            });
            $("#input_add_colla").val("").unbind().bind("keyup", function () {
                var b = $(this).val();
                if (b == a) {
                    return
                }
                a = b;
                if (b == "") {
                    $("#colla_suggest_box").css({background: "url(/images/default/view_loading.gif) center center no-repeat"});
                    Util.ajax({
                        url: "/collaboration/get_contacter_team_members", data: {}, success: function (d) {
                            $("#colla_suggest_box").css({background: "none"});
                            $("#colla_suggest_box").html(d);
                            var c = $("#colla_add").outerHeight();
                            var e = $(window).height();
                            $("#colla_add").css({top: (e - c) * 0.5 + "px"})
                        }
                    });
                    $("#colla_suggest_box").empty();
                    $("#add_step2").hide();
                    $("#add_step1").show();
                    return
                }
                Util.ajax({
                    url: "/collaboration/getmembers", data: {value: b}, success: function (d) {
                        $("#colla_suggest_box").html(d);
                        var c = $("#colla_add").outerHeight();
                        var e = $(window).height();
                        $("#colla_add").css({top: (e - c) * 0.5 + "px"});
                        if ($("#colla_suggest_box").find("ul").length > 0) {
                            $("#add_step2").show();
                            $("#add_step1").hide()
                        } else {
                            $("#add_step2").hide();
                            $("#add_step1").show()
                        }
                    }
                })
            });
            $(".colla_suggest").find("li").die().live("click", function () {
                if ($(this).attr("joinType") == "user" || $(this).attr("joinType") == "email") {
                    var c = {
                        type: $(this).attr("joinType"),
                        target: $(this).attr("target"),
                        chartId: DM.getSelected().attr("id")
                    };
                    Util.ajax({
                        url: "/collaboration/add", data: c, success: function (d) {
                            if (d.result == "exists") {
                                $("#colla_suggest_box").html("<div class='alert'><b>" + d.name + "</b>已经加入了此文件的协作中了。</div>")
                            } else {
                                if (c.type == "team") {
                                    $("#colla_suggest_box").html("<div class='alert success'><b>" + d.name + "</b>&nbsp;已经成功加入此文件的协作中，现在您可以与您的小组成员一起及时的进行编辑。</div>")
                                } else {
                                    $("#colla_suggest_box").html("<div class='alert success'>您已经成功邀请：<b>" + d.name + "</b>，请耐心等待受邀人接受您的邀请。</div>")
                                }
                                DM.Colla.loadCollaboration({reload: true})
                            }
                            $("#input_add_colla").val("").focus()
                        }
                    })
                } else {
                    if ($(this).attr("joinType") == "team") {
                        var b = $(this).attr("target");
                        if (!$(this).hasClass("active")) {
                            $(this).addClass("active");
                            $(".team_member[target='" + b + "']").show();
                            Util.ajax({
                                url: "/collaboration/show_team_member", data: {teamId: b}, success: function (i) {
                                    var d = +(i.teamMemberCount);
                                    var h = +(i.firstSize);
                                    var k = i.users;
                                    var f = "";
                                    var g, j, e;
                                    $.each(k, function (m) {
                                        e = "/images/default/default/profile-full-male.png";
                                        var l = k[m];
                                        g = l.userId;
                                        if (l.photoFileName != null && l.photoFileName != "") {
                                            e = "/file/" + l.photoFileName + "/photo"
                                        }
                                        j = l.fullName;
                                        f += '<li joinType="user" target="' + g + '"><img src="' + e + '"/>' + j + "</li>"
                                    });
                                    if (h < d) {
                                        f += '<div class="slider" all="' + d + '" onclick="DM.Colla.showMoreContacter(\'team\', this)"><span></span></div>'
                                    }
                                    $(".team_member[target='" + b + "']").css({background: "none"});
                                    $(".team_member[target='" + b + "']").append(f)
                                }
                            })
                        } else {
                            $(this).removeClass("active");
                            $(".team_member[target='" + b + "']").hide();
                            $(".team_member[target='" + b + "']").html("");
                            $(".team_member[target='" + b + "']").css({background: "url(/images/default/view_loading.gif) center center no-repeat"})
                        }
                    }
                }
            })
        }, showMoreContacter: function (b, d) {
            var c = {};
            var a = +($(d).attr("all"));
            if (b == "contacters") {
                var e = $(d).parent().find("li[joinType='user']").length;
                c.source = b;
                c.split = e
            } else {
                if (b == "team") {
                    var e = $(d).parent().find("li[joinType='user']").length;
                    c.source = b;
                    c.teamId = $(d).parent().attr("target");
                    c.split = e
                }
            }
            Util.ajax({
                url: "/collaboration/get_add_more", data: c, success: function (i) {
                    var k = i.users;
                    var g = "";
                    var f = "", h, j;
                    $.each(k, function (m) {
                        var l = k[m];
                        g = "/images/default/default/profile-full-male.png";
                        h = l.userId;
                        if (l.photoFileName != null && l.photoFileName != "") {
                            g = "/file/" + l.photoFileName + "/photo"
                        }
                        j = l.fullName;
                        f += '<li joinType="user" target="' + h + '"><img src="' + g + '"/>' + j + "</li>"
                    });
                    $(d).before(f);
                    if ($(d).parent().find("li[joinType='user']").length == a) {
                        $(d).hide()
                    } else {
                        $(d).show()
                    }
                    $(d).parent().scrollTop(9999)
                }
            })
        }
    }
};
function fileChange() {
    var b = $("#importVisiopath").val();
    var a = b.substr(b.lastIndexOf("\\") + 1);
    var c = a.substr(a.lastIndexOf(".")).toLowerCase();
    if (c == ".vdx") {
        $(".import_file_wraper").show();
        $("#fileName").val(a.substr(0, a.lastIndexOf("."))).focus()
    } else {
        $(".button.submit_btn").unbind("click");
        $("#import_error").text("请上传一个Visio文件(*.vdx),当前我们仅支持Visio中的Cross-function | Flowchart ").slideDown();
        setTimeout(function () {
            $("#import_error").hide().text("");
            $("#fileName").val("").parent().hide()
        }, 3000)
    }
}
function importBtnSubmit() {
    if ($("#fileName").val() == "" || $("#fileName").val() == null) {
        $(".button.submit_btn").unbind("click");
        $("#import_error").text("请选择要导入的文件 ").slideDown();
        setTimeout(function () {
            $("#import_error").hide().text("")
        }, 2000)
    } else {
        $("#import_visio_file").submitForm({
            onSubmit: function () {
                $(".button.submit_btn").html("<span class='ico bt importing'></span>导入中...")
            }, error: function () {
                $("#import_error").text("导入文件失败 ").slideDown();
                setTimeout(function () {
                    $("#import_error").hide().text("");
                    $(".button.submit_btn").html("导入")
                }, 3000)
            }, success: function (a) {
                if (a.result == "type_error") {
                    $(".button.submit_btn").unbind("click");
                    $("#import_error").text("您上传的文件格式不正确或文件已经损坏。 ").slideDown();
                    setTimeout(function () {
                        $("#import_error").hide().text("");
                        $(".button.submit_btn").html("导入")
                    }, 3000)
                } else {
                    $(".button.submit_btn").html("导入");
                    $("#import_success").text("跳转中...").show();
                    window.location.href = "/diagraming/" + a.result
                }
            }
        })
    }
}
$(function () {
    DM.init()
});