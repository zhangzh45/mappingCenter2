if (window.jQuery) {
    (function (a) {
        a.extend({
            xml2json: function (g, b) {
                if (!g) {
                    return {}
                }
                function e(k, j) {
                    if (!k) {
                        return null
                    }
                    var n = "", m = null, q = null;
                    var p = k.nodeType, r = h(k.localName || k.nodeName);
                    var o = k.text || k.nodeValue || "";
                    if (k.childNodes) {
                        if (k.childNodes.length > 0) {
                            a.each(k.childNodes, function (w, v) {
                                var t = v.nodeType, u = h(v.localName || v.nodeName);
                                var s = v.text || v.nodeValue || "";
                                if (t == 8) {
                                    return
                                } else {
                                    if (t == 3 || t == 4 || !u) {
                                        if (s.match(/^\s+$/)) {
                                            return
                                        }
                                        n += s.replace(/^\s+/, "").replace(/\s+$/, "")
                                    } else {
                                        m = m || {};
                                        if (m[u]) {
                                            if (!m[u].length) {
                                                m[u] = d(m[u])
                                            }
                                            m[u][m[u].length] = e(v, true);
                                            m[u].length = m[u].length
                                        } else {
                                            m[u] = e(v)
                                        }
                                    }
                                }
                            })
                        }
                    }
                    if (k.attributes) {
                        if (k.attributes.length > 0) {
                            q = {};
                            m = m || {};
                            a.each(k.attributes, function (u, t) {
                                var v = h(t.name), s = t.value;
                                q[v] = s;
                                if (m[v]) {
                                    if (!m[v].length) {
                                        m[v] = d(m[v])
                                    }
                                    m[v][m[v].length] = s;
                                    m[v].length = m[v].length
                                } else {
                                    m[v] = s
                                }
                            })
                        }
                    }
                    if (m) {
                        m = a.extend((n != "" ? new String(n) : {}), m || {});
                        n = (m.text) ? (typeof(m.text) == "object" ? m.text : [m.text || ""]).concat([n]) : n;
                        if (n) {
                            m.text = n
                        }
                        n = ""
                    }
                    var l = m || n;
                    if (b) {
                        if (n) {
                            l = {}
                        }
                        n = l.text || n || "";
                        if (n) {
                            l.text = n
                        }
                        if (!j) {
                            l = d(l)
                        }
                    }
                    return l
                }

                var h = function (j) {
                    return String(j || "").replace(/-/g, "_")
                };
                var i = function (j) {
                    return (typeof j == "number") || String((j && typeof j == "string") ? j : "").test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/)
                };
                var d = function (j) {
                    if (!j.length) {
                        j = [j]
                    }
                    j.length = j.length;
                    return j
                };
                if (typeof g == "string") {
                    g = a.text2xml(g)
                }
                if (!g.nodeType) {
                    return
                }
                if (g.nodeType == 3 || g.nodeType == 4) {
                    return g.nodeValue
                }
                var c = (g.nodeType == 9) ? g.documentElement : g;
                var f = e(c, true);
                g = null;
                c = null;
                return f
            }, text2xml: function (f) {
                var c;
                try {
                    var b = (a.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
                    b.async = false
                } catch (d) {
                    throw new Error("XML Parser could not be instantiated")
                }
                try {
                    if (a.browser.msie) {
                        c = (b.loadXML(f)) ? b : false
                    } else {
                        c = b.parseFromString(f, "text/xml")
                    }
                } catch (d) {
                    throw new Error("Error parsing XML string")
                }
                return c
            }
        })
    })(jQuery)
}
;